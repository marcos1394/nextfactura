import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../../context/ThemeContext';

// --- SERVICIOS API ---
import { 
    createRestaurant, 
    updatePortalConfig, 
    testPOSConnection,
    checkSubdomainAvailability,
    getFiscalRegimes,
    generateAgentKey,
    getFullRestaurantConfig
} from '../../services/api';

// --- ICONOS LUCIDE ---
import {
    Store, MapPin, Tag, XCircle, FileSpreadsheet, Database, 
    Download, BookOpen, Cpu, QrCode, Plus, Trash2, Loader2,
    Check, ChevronRight, CheckCircle2, ChevronDown, FileText,
    Key, Server, User, Lock, Globe, Palette, Image as ImageIcon,
    Eye, AlertTriangle, RefreshCw
} from 'lucide-react';

// --- HELPER: OBJETO VACÍO ---
const createBlankRestaurant = () => ({
    id: `temp_${Date.now()}`,
    name: 'Nuevo Restaurante',
    address: '',
    rfc: '',
    businessName: '',
    fiscalRegime: '',
    fiscalAddress: '',
    csdCertFile: null,
    csdKeyFile: null,
    csdPassword: '',
    connectionMethod: 'agent',
    agentKey: '',
    dbHost: '',
    dbPort: '1433',
    dbName: '',
    dbUser: '',
    dbPassword: '',
    enableSoftRestaurant: true
});

// --- COMPONENTE PRINCIPAL ---
const RestaurantSetup = () => {
    const { user, isLoading: isAuthLoading } = useAuth();
    const { darkMode } = useThemeContext();
    
    // Estados de Navegación y Carga
    const [currentStep, setCurrentStep] = useState(1);
    const [isConfigLoading, setIsConfigLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Estados de Datos
    const [restaurants, setRestaurants] = useState([]);
    const [activeRestaurantId, setActiveRestaurantId] = useState(null);
    const [fiscalRegimes, setFiscalRegimes] = useState([]);
    
    // Estados de Acción
    const [isGeneratingKey, setIsGeneratingKey] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState(null);

    // Estado Portal
    const [portalConfig, setPortalConfig] = useState({
        portalName: '',
        subdomain: '',
        primaryColor: '#2563eb',
        logoUrl: '',
        logoFile: null,
        welcomeMessage: 'Bienvenido a nuestro portal de facturación',
        showWelcomeMessage: true,
        backgroundImage: '',
        backgroundFile: null,
        customCSS: ''
    });

    // Validación Subdominio
    const [isCheckingSubdomain, setIsCheckingSubdomain] = useState(false);
    const [subdomainStatus, setSubdomainStatus] = useState({ available: null, message: '', cleanName: '' });
    const debouncedSubdomain = useDebounce(portalConfig.subdomain, 500);

    // --- CARGA INICIAL ---
    const loadData = useCallback(async () => {
        if (!user) return;
        setIsConfigLoading(true);
        try {
            // 1. Cargar Regímenes
            const regimes = await getFiscalRegimes();
            setFiscalRegimes(regimes);

            // 2. Cargar Configuración Existente
            const response = await getFullRestaurantConfig();
            
            if (response.success && response.restaurants.length > 0) {
                setRestaurants(response.restaurants);
                setActiveRestaurantId(response.restaurants[0].id);
                
                // Cargar config del portal si existe (asumiendo que viene en la respuesta o en el primer restaurante)
                if (response.portalConfig) {
                    setPortalConfig(prev => ({ ...prev, ...response.portalConfig }));
                }
            } else {
                const newRest = createBlankRestaurant();
                setRestaurants([newRest]);
                setActiveRestaurantId(newRest.id);
            }
        } catch (error) {
            console.error("Error cargando configuración:", error);
            toast.error("No se pudieron cargar los datos.");
        } finally {
            setIsConfigLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!isAuthLoading) loadData();
    }, [isAuthLoading, loadData]);

    // --- MANEJADORES DE ESTADO ---
    
    const updatePortalConfig = (key, value) => {
        setPortalConfig(prev => ({ ...prev, [key]: value }));
    };

    const updateRestaurant = (field, value) => {
        setRestaurants(prev => 
            prev.map(r => r.id === activeRestaurantId ? { ...r, [field]: value } : r)
        );
    };

    const addRestaurant = () => {
        const newRest = createBlankRestaurant();
        setRestaurants(prev => [...prev, newRest]);
        setActiveRestaurantId(newRest.id);
    };

    const removeRestaurant = (id) => {
        if (restaurants.length <= 1) return toast.warn("Debes tener al menos un restaurante.");
        const newRestaurants = restaurants.filter(r => r.id !== id);
        setRestaurants(newRestaurants);
        if (activeRestaurantId === id) setActiveRestaurantId(newRestaurants[0].id);
    };

    // --- VALIDACIÓN SUBDOMINIO ---
    useEffect(() => {
        const check = async () => {
            const cleanName = debouncedSubdomain.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20);
            if (cleanName.length < 3) {
                setSubdomainStatus({ available: null, message: '', cleanName });
                return;
            }
            setIsCheckingSubdomain(true);
            try {
                const res = await checkSubdomainAvailability(cleanName);
                setSubdomainStatus({ 
                    available: res.available, 
                    message: res.message || (res.available ? 'Disponible' : 'No disponible'), 
                    cleanName 
                });
            } catch (err) {
                setSubdomainStatus({ available: false, message: 'Error al verificar', cleanName });
            } finally {
                setIsCheckingSubdomain(false);
            }
        };
        if (debouncedSubdomain) check();
    }, [debouncedSubdomain]);

    // --- ACCIONES API ---

    const handleGenerateKey = async () => {
        if (String(activeRestaurantId).startsWith('temp_')) return toast.warn("Guarda el restaurante antes de generar claves.");
        setIsGeneratingKey(true);
        try {
            const res = await generateAgentKey(activeRestaurantId);
            if (res.success) {
                updateRestaurant('agentKey', res.agentKey);
                toast.success("Clave generada.");
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsGeneratingKey(false);
        }
    };

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        try {
            // 1. Separar nuevos de existentes
            const newRests = restaurants.filter(r => String(r.id).startsWith('temp_'));
            const existingRests = restaurants.filter(r => !String(r.id).startsWith('temp_'));

            // 2. Procesar Existentes (Update - lógica simulada si no tienes endpoint masivo)
            // await Promise.all(existingRests.map(r => updateRestaurantApi(r))); 

            // 3. Procesar Nuevos (Create)
            const created = await Promise.all(newRests.map(r => {
                const { restaurantData, fiscalData, files } = preparePayload(r);
                return createRestaurant(restaurantData, fiscalData, files);
            }));

            // 4. Actualizar Portal (usando ID del primer restaurante válido)
            const targetId = existingRests[0]?.id || created[0]?.restaurant?.id;
            if (targetId) {
                const portalFiles = { logo: portalConfig.logoFile, backgroundImage: portalConfig.backgroundFile };
                await updatePortalConfig(targetId, portalConfig, portalFiles);
            }

            toast.success("¡Configuración guardada!");
            await loadData(); // Recargar para obtener IDs reales
            setCurrentStep(1); // Volver al inicio o ir al dashboard
        } catch (err) {
            console.error(err);
            toast.error(`Error: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- RENDER ---
    if (isAuthLoading || isConfigLoading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-slate-900">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Preparando tu entorno...</p>
            </div>
        );
    }

    const activeRestaurant = restaurants.find(r => r.id === activeRestaurantId) || restaurants[0];

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Configuración Inicial</h1>
                        <p className="mt-1 text-gray-500 dark:text-slate-400">Pon en marcha tu facturación en 3 pasos.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="lg:col-span-3">
                        <Stepper currentStep={currentStep} setStep={setCurrentStep} />
                    </aside>

                    {/* Content Area */}
                    <main className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* --- PASO 1: PORTAL --- */}
                                {currentStep === 1 && (
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                        <Card title="Apariencia del Portal">
                                            <div className="space-y-6">
                                                <InputField 
                                                    icon={Store} label="Nombre del Portal" 
                                                    value={portalConfig.portalName} 
                                                    onChange={e => updatePortalConfig('portalName', e.target.value)} 
                                                    placeholder="Ej. Restaurante La Plaza"
                                                />
                                                
                                                <div>
                                                    <InputField 
                                                        icon={Globe} label="Subdominio" 
                                                        value={portalConfig.subdomain}
                                                        onChange={e => updatePortalConfig('subdomain', e.target.value)}
                                                        addon=".nextmanager.mx"
                                                        placeholder="mirestaurante"
                                                    />
                                                    {/* Feedback Subdominio */}
                                                    <div className="mt-2 text-sm flex items-center gap-2">
                                                        {isCheckingSubdomain && <><Loader2 className="w-3 h-3 animate-spin"/> Verificando...</>}
                                                        {!isCheckingSubdomain && subdomainStatus.available === true && <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Disponible</span>}
                                                        {!isCheckingSubdomain && subdomainStatus.available === false && <span className="text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3"/> No disponible</span>}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Color Primario</label>
                                                        <div className="flex gap-2">
                                                            <input type="color" value={portalConfig.primaryColor} onChange={e => updatePortalConfig('primaryColor', e.target.value)} className="h-10 w-10 rounded cursor-pointer border-0" />
                                                            <input type="text" value={portalConfig.primaryColor} onChange={e => updatePortalConfig('primaryColor', e.target.value)} className="flex-1 rounded-lg border border-gray-300 dark:border-slate-600 bg-transparent px-3 text-sm" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-2">Mostrar Bienvenida</label>
                                                        <label className="flex items-center gap-2 cursor-pointer mt-2">
                                                            <input type="checkbox" checked={portalConfig.showWelcomeMessage} onChange={e => updatePortalConfig('showWelcomeMessage', e.target.checked)} className="rounded text-blue-600" />
                                                            <span className="text-sm">Habilitar</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <FileUpload 
                                                    label="Logotipo" 
                                                    icon={ImageIcon}
                                                    file={portalConfig.logoFile}
                                                    onChange={f => {
                                                        const url = URL.createObjectURL(f);
                                                        updatePortalConfig('logoFile', f);
                                                        updatePortalConfig('logoUrl', url);
                                                    }}
                                                    onRemove={() => {
                                                        updatePortalConfig('logoFile', null);
                                                        updatePortalConfig('logoUrl', '');
                                                    }}
                                                />
                                            </div>
                                        </Card>

                                        {/* Preview */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-gray-500 uppercase text-xs tracking-wider">Vista Previa</h3>
                                            <PortalPreview config={portalConfig} />
                                        </div>
                                    </div>
                                )}

                                {/* --- PASO 2: RESTAURANTES --- */}
                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        {/* Tabs */}
                                        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-slate-700">
                                            {restaurants.map((r, idx) => (
                                                <button
                                                    key={r.id}
                                                    onClick={() => setActiveRestaurantId(r.id)}
                                                    className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                                        activeRestaurantId === r.id 
                                                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600 dark:bg-slate-800 dark:text-blue-400' 
                                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-slate-300'
                                                    }`}
                                                >
                                                    {r.name || `Sucursal ${idx + 1}`}
                                                </button>
                                            ))}
                                            <button onClick={addRestaurant} className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1 transition-colors">
                                                <Plus className="w-4 h-4" /> Nueva
                                            </button>
                                        </div>

                                        {/* Formulario Activo */}
                                        {activeRestaurant && (
                                            <div className="grid grid-cols-1 gap-6">
                                                {/* Datos Generales */}
                                                <Card title="Datos Generales">
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <InputField icon={Store} label="Nombre Comercial" value={activeRestaurant.name} onChange={e => updateRestaurant('name', e.target.value)} />
                                                        <InputField icon={MapPin} label="Dirección" value={activeRestaurant.address} onChange={e => updateRestaurant('address', e.target.value)} />
                                                    </div>
                                                </Card>

                                                {/* Datos Fiscales */}
                                                <Card title="Datos Fiscales">
                                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                        <InputField icon={Tag} label="RFC" value={activeRestaurant.rfc} onChange={e => updateRestaurant('rfc', e.target.value.toUpperCase())} maxLength={13} />
                                                        <InputField icon={FileText} label="Razón Social" value={activeRestaurant.businessName} onChange={e => updateRestaurant('businessName', e.target.value)} />
                                                        <InputField 
    icon={MapPin} 
    label="Dirección Fiscal (Código Postal)" 
    placeholder="Ej. 06600"
    value={activeRestaurant.fiscalAddress} 
    onChange={e => updateRestaurant('fiscalAddress', e.target.value)} 
/>
                                                    </div>
                                                    
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium mb-2">Régimen Fiscal</label>
                                                        <div className="relative">
                                                            <BookOpen className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                                                            <select 
                                                                value={activeRestaurant.fiscalRegime} 
                                                                onChange={e => updateRestaurant('fiscalRegime', e.target.value)}
                                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 appearance-none focus:ring-2 focus:ring-blue-500"
                                                            >
                                                                <option value="">Selecciona un régimen...</option>
                                                                {fiscalRegimes.map(reg => (
                                                                    <option key={reg.code} value={reg.code}>{reg.code} - {reg.description}</option>
                                                                ))}
                                                            </select>
                                                            <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                                                        </div>
                                                    </div>

                                                    <div className="grid md:grid-cols-3 gap-4">
                                                        <FileUpload label="Certificado (.cer)" accept=".cer" file={activeRestaurant.csdCertFile} onChange={f => updateRestaurant('csdCertFile', f)} />
                                                        <FileUpload label="Llave Privada (.key)" accept=".key" file={activeRestaurant.csdKeyFile} onChange={f => updateRestaurant('csdKeyFile', f)} />
                                                        <InputField icon={Lock} label="Contraseña CSD" type="password" value={activeRestaurant.csdPassword} onChange={e => updateRestaurant('csdPassword', e.target.value)} />
                                                    </div>
                                                </Card>

                                                {/* Conexión */}
                                                <Card title="Conexión SoftRestaurant">
                                                    <div className="flex gap-4 mb-6">
                                                        <button 
                                                            onClick={() => updateRestaurant('connectionMethod', 'agent')}
                                                            className={`flex-1 py-3 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${activeRestaurant.connectionMethod === 'agent' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700' : 'border-gray-200 dark:border-slate-700 opacity-60'}`}
                                                        >
                                                            <Download className="w-6 h-6" />
                                                            <span className="font-medium">Agente Local (Recomendado)</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => updateRestaurant('connectionMethod', 'direct')}
                                                            className={`flex-1 py-3 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${activeRestaurant.connectionMethod === 'direct' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700' : 'border-gray-200 dark:border-slate-700 opacity-60'}`}
                                                        >
                                                            <Server className="w-6 h-6" />
                                                            <span className="font-medium">Conexión Directa SQL</span>
                                                        </button>
                                                    </div>

                                                    {activeRestaurant.connectionMethod === 'agent' ? (
                                                        <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
                                                            <div className="flex items-center gap-4 mb-6">
                                                                <div className="bg-white dark:bg-slate-700 p-3 rounded-lg shadow-sm">
                                                                    <QrCode className="w-8 h-8 text-gray-700 dark:text-white" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold">Clave de Vinculación</h4>
                                                                    <p className="text-sm text-gray-500">Ingresa esta clave en el Agente instalado en tu servidor.</p>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex gap-2">
                                                                <input readOnly value={activeRestaurant.agentKey || "Guarda para generar clave"} className="flex-1 font-mono text-center bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg py-2" />
                                                                <button onClick={handleGenerateKey} disabled={isGeneratingKey} className="px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                                                    {isGeneratingKey ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex gap-3 text-yellow-800 dark:text-yellow-200 text-sm">
                                                                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                                                <p>Esta opción requiere exponer tu base de datos a internet. Asegúrate de configurar el firewall correctamente.</p>
                                                            </div>
                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                <InputField icon={Server} label="Host / IP" placeholder="192.168.1.100" value={activeRestaurant.dbHost} onChange={e => updateRestaurant('dbHost', e.target.value)} />
                                                                <InputField icon={Cpu} label="Puerto" placeholder="1433" value={activeRestaurant.dbPort} onChange={e => updateRestaurant('dbPort', e.target.value)} />
                                                            </div>
                                                            <div className="grid md:grid-cols-3 gap-4">
                                                                <InputField icon={Database} label="Base de Datos" value={activeRestaurant.dbName} onChange={e => updateRestaurant('dbName', e.target.value)} />
                                                                <InputField icon={User} label="Usuario SQL" value={activeRestaurant.dbUser} onChange={e => updateRestaurant('dbUser', e.target.value)} />
                                                                <InputField icon={Lock} label="Contraseña SQL" type="password" value={activeRestaurant.dbPassword} onChange={e => updateRestaurant('dbPassword', e.target.value)} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </Card>

                                                <div className="flex justify-end pt-4">
                                                    {restaurants.length > 1 && (
                                                        <button onClick={() => removeRestaurant(activeRestaurantId)} className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1">
                                                            <Trash2 className="w-4 h-4" /> Eliminar Sucursal
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* --- PASO 3: RESUMEN --- */}
                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <Card title="Resumen Final">
                                            <div className="space-y-6">
                                                {/* Portal Summary */}
                                                <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                                    <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full">
                                                        <Globe className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">Portal: {portalConfig.portalName}</h4>
                                                        <p className="text-sm text-blue-700 dark:text-blue-300">URL: {portalConfig.subdomain}.nextmanager.mx</p>
                                                    </div>
                                                </div>

                                                {/* Restaurants Summary */}
                                                <div className="border rounded-xl divide-y divide-gray-200 dark:divide-slate-700 dark:border-slate-700">
                                                    {restaurants.map((r, i) => (
                                                        <div key={r.id} className="p-4 flex justify-between items-center">
                                                            <div className="flex items-center gap-3">
                                                                <div className="bg-gray-100 dark:bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                                                    {i + 1}
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium">{r.name}</p>
                                                                    <p className="text-xs text-gray-500">{r.rfc || 'Sin RFC'} • {r.connectionMethod === 'agent' ? 'Agente' : 'SQL Directo'}</p>
                                                                </div>
                                                            </div>
                                                            {r.csdCertFile && r.csdKeyFile ? (
                                                                <span className="text-green-500 text-xs bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full flex items-center gap-1"><Check className="w-3 h-3"/> CSD Listo</span>
                                                            ) : (
                                                                <span className="text-yellow-500 text-xs bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Falta CSD</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                )}

                                {/* --- NAVEGACIÓN INFERIOR --- */}
                                <div className="mt-8 flex justify-between pt-6 border-t border-gray-200 dark:border-slate-700">
                                    {currentStep > 1 ? (
                                        <button onClick={() => setCurrentStep(c => c - 1)} className="px-6 py-2 rounded-lg border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 text-sm font-medium">
                                            Atrás
                                        </button>
                                    ) : <div></div>}
                                    
                                    {currentStep < 3 ? (
                                        <button onClick={() => setCurrentStep(c => c + 1)} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                                            Siguiente <ChevronRight className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button onClick={handleFinalSubmit} disabled={isSubmitting} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50">
                                            {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                            Guardar Todo
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTES AUXILIARES ---

const Card = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 font-semibold bg-gray-50 dark:bg-slate-800/50">
            {title}
        </div>
        <div className="p-6">{children}</div>
    </div>
);

const InputField = ({ icon: Icon, label, addon, className = "", ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">{label}</label>
        <div className="relative">
            {Icon && <Icon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400 z-10" />}
            <input 
                {...props}
                className={`w-full py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${Icon ? 'pl-10' : 'pl-4'} ${addon ? 'pr-32' : 'pr-4'} ${className}`}
            />
            {addon && <span className="absolute inset-y-0 right-0 flex items-center pr-3 pl-3 text-sm text-gray-500 bg-gray-100 dark:bg-slate-800 rounded-r-lg border-l border-gray-300 dark:border-slate-600">{addon}</span>}
        </div>
    </div>
);

const FileUpload = ({ label, accept, file, onChange, onRemove }) => (
    <div>
        <label className="block text-sm font-medium mb-2">{label}</label>
        {!file ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Download className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500">Click o arrastrar</p>
                </div>
                <input type="file" className="hidden" accept={accept} onChange={e => onChange(e.target.files[0])} />
            </label>
        ) : (
            <div className="relative flex items-center p-3 border border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800 rounded-lg">
                <FileText className="w-8 h-8 text-green-600 mr-3" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-800 dark:text-green-300 truncate">{file.name}</p>
                    <p className="text-xs text-green-600">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                {onRemove && (
                    <button onClick={onRemove} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500">
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        )}
    </div>
);

const Stepper = ({ currentStep, setStep }) => {
    const steps = [
        { id: 1, title: 'Portal', icon: Globe },
        { id: 2, title: 'Restaurantes', icon: Store },
        { id: 3, title: 'Resumen', icon: Check }
    ];
    return (
        <div className="space-y-2 sticky top-6">
            {steps.map(s => (
                <button
                    key={s.id}
                    onClick={() => setStep(s.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                        currentStep === s.id 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                        : currentStep > s.id 
                        ? 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400' 
                        : 'bg-white dark:bg-slate-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                >
                    <div className={`p-2 rounded-lg ${currentStep === s.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-700'}`}>
                        <s.icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <p className="font-semibold text-sm">{s.title}</p>
                        <p className="text-xs opacity-80">{currentStep > s.id ? 'Completado' : currentStep === s.id ? 'En progreso' : 'Pendiente'}</p>
                    </div>
                    {currentStep > s.id && <CheckCircle2 className="ml-auto w-5 h-5" />}
                </button>
            ))}
        </div>
    );
};

const PortalPreview = ({ config }) => (
    <div className="border-4 border-gray-800 rounded-[2rem] overflow-hidden bg-gray-900 shadow-2xl max-w-sm mx-auto transform scale-95">
        <div className="bg-gray-800 h-8 flex justify-center items-center gap-2 px-4">
            <div className="w-16 h-1 bg-gray-700 rounded-full"></div>
        </div>
        <div className="aspect-[9/19] bg-white relative overflow-hidden flex flex-col"
             style={{ backgroundImage: config.backgroundImage ? `url(${config.backgroundImage})` : 'none', backgroundSize: 'cover' }}>
            {!config.backgroundImage && <div className="absolute inset-0 opacity-10 bg-repeat" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>}
            <div className={`flex-1 flex flex-col items-center justify-center p-6 text-center z-10 ${config.backgroundImage ? 'bg-black/40 text-white' : ''}`}>
                {config.logoUrl ? (
                    <img src={config.logoUrl} className="w-24 h-24 object-contain mb-6 drop-shadow-xl" alt="Logo" />
                ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-full mb-6 flex items-center justify-center text-2xl font-bold text-gray-400">LOGO</div>
                )}
                <h2 className="text-2xl font-bold mb-2">{config.portalName || 'Tu Restaurante'}</h2>
                {config.showWelcomeMessage && <p className="text-sm opacity-90 mb-8">{config.welcomeMessage}</p>}
                
                <div className="w-full space-y-3">
                    <div className="h-12 w-full rounded-lg shadow-lg flex items-center justify-center font-bold text-white" style={{ backgroundColor: config.primaryColor }}>
                        Facturar Ticket
                    </div>
                    <div className="h-12 w-full bg-white/90 text-gray-800 rounded-lg shadow-sm flex items-center justify-center font-semibold">
                        Consultar Factura
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- HELPER PAYLOAD (Sin cambios lógicos, solo ubicación) ---
const preparePayload = (restaurant) => ({
    restaurantData: {
        name: restaurant.name,
        address: restaurant.address,
        connectionMethod: restaurant.connectionMethod,
        agentKey: restaurant.agentKey,
        dbHost: restaurant.dbHost,
        dbPort: restaurant.dbPort,
        connectionUser: restaurant.dbUser,
        connectionPassword: restaurant.dbPassword,
        connectionDbName: restaurant.dbName,
    },
    fiscalData: {
        rfc: restaurant.rfc,
        businessName: restaurant.businessName,
        fiscalRegime: restaurant.fiscalRegime,
        fiscalAddress: restaurant.fiscalAddress,
        csdPassword: restaurant.csdPassword,
    },
    files: {
        csdCertificate: restaurant.csdCertFile,
        csdKey: restaurant.csdKeyFile,
    }
});

export default RestaurantSetup;