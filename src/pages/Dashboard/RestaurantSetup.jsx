import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../../context/ThemeContext';
import { 
    Loader2, 
    CheckCircle2, 
    ChevronRight,
    AlertCircle,
    Download
} from 'lucide-react';

// --- SERVICIOS API ---
import api, { 
    createRestaurant, 
    updatePortalConfig, 
    checkSubdomainAvailability, 
    getFiscalRegimes, 
    generateAgentKey, 
    getFullRestaurantConfig 
} from '../../services/api';

// --- COMPONENTES VISUALES ---
import SetupStepper from '../../components/Restaurant/SetupStepper';
import PortalForm from '../../components/Restaurant/PortalForm';
import PortalPreview from '../../components/Restaurant/PortalPreview';
import RestaurantForm from '../../components/Restaurant/RestaurantForm';
import SummaryStep from '../../components/Restaurant/SummaryStep'; 
import InstallationSuccess from '../../components/Restaurant/InstallationSuccess';

// --- HELPER: MODELO DE DATOS INICIAL ---
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

const RestaurantSetup = () => {
    const { user, isLoading: isAuthLoading } = useAuth();
    const { darkMode } = useThemeContext();
    
    // --- ESTADOS GLOBALES ---
    const [currentStep, setCurrentStep] = useState(1);
    const [isConfigLoading, setIsConfigLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successData, setSuccessData] = useState(null); 
    
    // --- ESTADOS DE NEGOCIO ---
    const [restaurants, setRestaurants] = useState([]);
    const [activeRestaurantId, setActiveRestaurantId] = useState(null);
    const [fiscalRegimes, setFiscalRegimes] = useState([]);
    
    // Configuración del Portal
    const [portalConfig, setPortalConfig] = useState({
        portalName: '',
        subdomain: '',
        primaryColor: '#2563eb',
        logoUrl: '',
        logoFile: null,
        welcomeMessage: 'Bienvenido a nuestro portal de facturación',
        showWelcomeMessage: true,
        backgroundImage: '',
        backgroundFile: null
    });

    // Estados de UI
    const [isGeneratingKey, setIsGeneratingKey] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isCheckingSubdomain, setIsCheckingSubdomain] = useState(false);
    const [subdomainStatus, setSubdomainStatus] = useState({ available: null, message: '', cleanName: '' });
    
    // Debounce de 500ms para no saturar la API
    const debouncedSubdomain = useDebounce(portalConfig.subdomain, 500);

    // --- 1. CARGA DE DATOS INICIALES ---
    const loadData = useCallback(async () => {
        if (!user) return;
        setIsConfigLoading(true);
        try {
            const regimes = await getFiscalRegimes();
            setFiscalRegimes(regimes);

            const response = await getFullRestaurantConfig();
            
            if (response.success && response.restaurants.length > 0) {
                setRestaurants(response.restaurants);
                setActiveRestaurantId(response.restaurants[0].id);
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

    // --- 2. MANEJADORES DE CAMBIOS ---
    const updatePortal = (key, value) => {
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

    // --- 3. LÓGICA DE NEGOCIO (API CALLS) ---

    // A. Validación de Subdominio (CORREGIDO PARA EVITAR ERROR 400)
    useEffect(() => {
        const check = async () => {
            const cleanName = debouncedSubdomain; 
            
            // 1. Si está vacío o es muy corto, reseteamos estado.
            if (!cleanName || cleanName.length < 3) {
                setSubdomainStatus({ available: null, message: '', cleanName });
                return;
            }

            // 2. CORRECCIÓN IMPORTANTE: 
            // Si el nombre termina en guion (ej: "restaurante-") o tiene caracteres raros,
            // NO hacemos la petición. Esto evita el error 400 del backend.
            const isValidFormat = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanName);
            
            if (!isValidFormat) {
                 // Si termina en guion, asumimos que el usuario sigue escribiendo.
                 if (cleanName.endsWith('-')) return;
                 
                 // Si tiene otros caracteres inválidos, mostramos error local sin llamar a API.
                 setSubdomainStatus({ available: false, message: 'Solo letras, números y guiones medios', cleanName });
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
                console.error(err);
                // Manejamos el error suavemente
                setSubdomainStatus({ available: false, message: 'No disponible', cleanName });
            } finally {
                setIsCheckingSubdomain(false);
            }
        };
        
        if (debouncedSubdomain) check();
        else setSubdomainStatus({ available: null, message: '', cleanName: '' });

    }, [debouncedSubdomain]);

    // B. Generar Clave de Agente
    const handleGenerateKey = async () => {
        if (String(activeRestaurantId).startsWith('temp_')) return toast.warn("Primero guarda los cambios para generar la clave.");
        setIsGeneratingKey(true);
        try {
            const res = await generateAgentKey(activeRestaurantId);
            if (res.success) {
                updateRestaurant('agentKey', res.agentKey);
                toast.success("Clave generada correctamente.");
            }
        } catch (err) {
            toast.error(err.message || "Error al generar clave");
        } finally {
            setIsGeneratingKey(false);
        }
    };

    // C. Descargar Instalador MSI (Blob) (MEJORADO)
    const handleDownloadInstaller = async () => {
        setIsDownloading(true);
        try {
            // Usamos la instancia 'api' para asegurar que lleva el Token de Auth en los headers
            const response = await api.get('/connector/download', { 
                responseType: 'blob',
                headers: {
                    'Accept': 'application/octet-stream' // Header explícito para descargas
                }
            });

            // Crear enlace de descarga virtual
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'NextFactura_Connector_Setup.msi'); 
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success("Descarga iniciada.");
        } catch (error) {
            console.error("Error descarga:", error);
            
            // Manejo específico de errores HTTP
            if (error.response) {
                if (error.response.status === 404) {
                    toast.error("El instalador no se encuentra disponible en este momento.");
                } else if (error.response.status === 403) {
                    toast.error("Tu plan actual no permite esta descarga.");
                } else {
                    toast.error(`Error del servidor: ${error.response.status}`);
                }
            } else {
                toast.error("Error de conexión al intentar descargar.");
            }
        } finally {
            setIsDownloading(false);
        }
    };

    // D. Guardado Final (Submit)
    const handleFinalSubmit = async () => {
        const active = restaurants.find(r => r.id === activeRestaurantId);
        // Validaciones básicas antes de enviar
        if(!active.fiscalAddress) return toast.error('La Dirección Fiscal es obligatoria.');
        if(!portalConfig.portalName) return toast.error('El nombre del portal es obligatorio.');

        setIsSubmitting(true);
        try {
            const newRests = restaurants.filter(r => String(r.id).startsWith('temp_'));
            let lastResult = null;

            // 1. Guardar Restaurantes Nuevos
            await Promise.all(newRests.map(async r => {
                const { restaurantData, fiscalData, files } = preparePayload(r);
                const res = await createRestaurant(restaurantData, fiscalData, files);
                lastResult = res; 
                return res;
            }));

            // 2. Actualizar Configuración del Portal
            // Buscamos un ID válido (existente o recién creado) para asociar el portal
            const targetId = restaurants.find(r => !String(r.id).startsWith('temp_'))?.id || lastResult?.restaurant?.id;
            
            if (targetId) {
                const portalFiles = { logo: portalConfig.logoFile, backgroundImage: portalConfig.backgroundFile };
                await updatePortalConfig(targetId, portalConfig, portalFiles);
            } else {
                // Fallback si no hay ID (raro)
                throw new Error("No se pudo identificar el restaurante para guardar el portal.");
            }

            toast.success("¡Configuración guardada exitosamente!");
            
            // 3. Preparar paso de éxito
            const finalAgentKey = lastResult?.restaurant?.agentKey || restaurants.find(r => r.id === activeRestaurantId)?.agentKey;
            
            if (finalAgentKey) {
                setSuccessData({
                    name: lastResult?.restaurant?.name || active.name,
                    agentKey: finalAgentKey
                });
                setCurrentStep(4); // Ir a pantalla de éxito
            } else {
                // Si no hay key, recargamos para mostrar dashboard
                await loadData();
                setCurrentStep(1); 
            }

        } catch (err) {
            console.error(err);
            toast.error(`Error al guardar: ${err.message || 'Error desconocido'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- 4. RENDERIZADO (VIEW) ---

    // Loader Inicial
    if (isAuthLoading || isConfigLoading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-slate-900">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Cargando tu entorno...</p>
            </div>
        );
    }

    // Pantalla de Éxito (Paso 4)
    if (currentStep === 4 && successData) {
        return (
            <div className={`min-h-screen ${darkMode ? 'dark bg-slate-900' : 'bg-gray-50'}`}>
                <InstallationSuccess 
                    restaurantName={successData.name}
                    agentKey={successData.agentKey}
                    onFinish={() => window.location.href = '/dashboard'}
                />
            </div>
        );
    }

    // Flujo Principal (Pasos 1, 2, 3)
    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                
                {/* Header Global */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Configuración Inicial</h1>
                    <p className="mt-1 text-gray-500 dark:text-slate-400">Pon en marcha tu facturación en 3 pasos.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Lateral: Stepper de Navegación */}
                    <aside className="lg:col-span-3">
                        <SetupStepper currentStep={currentStep} setStep={setCurrentStep} />
                    </aside>

                    {/* Principal: Contenido Dinámico */}
                    <main className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* PASO 1: PORTAL */}
                                {currentStep === 1 && (
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                        <PortalForm 
                                            config={portalConfig}
                                            onUpdate={updatePortal}
                                            subdomainStatus={subdomainStatus}
                                            isCheckingSubdomain={isCheckingSubdomain}
                                        />
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-gray-500 uppercase text-xs tracking-wider">Vista Previa</h3>
                                            <PortalPreview config={portalConfig} />
                                        </div>
                                    </div>
                                )}

                                {/* PASO 2: RESTAURANTES */}
                                {currentStep === 2 && (
                                    <RestaurantForm 
                                        restaurants={restaurants}
                                        activeId={activeRestaurantId}
                                        setActiveId={setActiveRestaurantId}
                                        onAdd={addRestaurant}
                                        onRemove={removeRestaurant}
                                        onUpdate={updateRestaurant}
                                        fiscalRegimes={fiscalRegimes}
                                        // Props para Conexión y Descarga
                                        isGeneratingKey={isGeneratingKey}
                                        onGenerateKey={handleGenerateKey}
                                        onDownloadInstaller={handleDownloadInstaller}
                                        isDownloadingInstaller={isDownloading}
                                    />
                                )}

                                {/* PASO 3: RESUMEN */}
                                {currentStep === 3 && (
                                    <SummaryStep 
                                        portalConfig={portalConfig}
                                        restaurants={restaurants}
                                    />
                                )}

                                {/* BOTONERA INFERIOR */}
                                <div className="mt-8 flex justify-between pt-6 border-t border-gray-200 dark:border-slate-700">
                                    {/* Botón Atrás */}
                                    {currentStep > 1 ? (
                                        <button 
                                            onClick={() => setCurrentStep(c => c - 1)} 
                                            className="px-6 py-2 rounded-lg border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
                                        >
                                            Atrás
                                        </button>
                                    ) : <div></div>}
                                    
                                    {/* Botón Siguiente / Guardar */}
                                    {currentStep < 3 ? (
                                        <button 
                                            onClick={() => setCurrentStep(c => c + 1)} 
                                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
                                        >
                                            Siguiente <ChevronRight className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={handleFinalSubmit} 
                                            disabled={isSubmitting} 
                                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50 transition-colors shadow-sm"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                            Guardar y Finalizar
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

// --- HELPER: PREPARAR DATOS PARA EL BACKEND ---
const preparePayload = (restaurant) => ({
    restaurantData: {
        name: restaurant.name,
        address: restaurant.address,
        connectionMethod: restaurant.connectionMethod,
        agentKey: restaurant.agentKey || undefined, 
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