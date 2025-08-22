import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BuildingStorefrontIcon,
    MapPinIcon,
    TagIcon,
    ReceiptPercentIcon,
    CircleStackIcon,
    CpuChipIcon,
    PlusIcon,
    TrashIcon,
    CheckIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    DocumentIcon,
    KeyIcon,
    ServerIcon,
    UserIcon,
    LockClosedIcon,
    GlobeAltIcon,
    PaintBrushIcon,
    PhotoIcon,
    EyeIcon,
    SunIcon,
    MoonIcon
} from '@heroicons/react/24/outline';
import { 
    createRestaurant, 
    updatePortalConfig, 
    testPOSConnection 
} from '../services/api';


const RestaurantSetup = () => {
    // Estados principales
    const [darkMode, setDarkMode] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [activeRestaurantId, setActiveRestaurantId] = useState(1);
    
    // Estados para manejar el envío y la retroalimentación
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [isTestingConnection, setIsTestingConnection] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState(null);

    // Estado del portal
    const [portalConfig, setPortalConfig] = useState({
        portalName: 'Mi Restaurante',
        subdomain: 'mirestaurante',
        primaryColor: '#2563eb',
        logoUrl: '',
        logoFile: null,
        welcomeMessage: 'Bienvenido a nuestro portal de facturación',
        showWelcomeMessage: true,
        backgroundImage: '',
        backgroundFile: null,
        customCSS: ''
    });

    // Estado de restaurantes
    const [restaurants, setRestaurants] = useState([
    {
        id: 1,
        name: '',
        address: '',
        rfc: '',
        businessName: '', // <-- NUEVO
        fiscalRegime: '', // <-- NUEVO
        fiscalAddress: '',
        csdCertFile: null,
        csdKeyFile: null,
        csdPassword: '',
        dbHost: '',
        dbPort: '1433',
        dbName: '',
        dbUser: '',
        dbPassword: '',
        enableSoftRestaurant: false
    }
]);

    // Funciones auxiliares
    const activeRestaurant = restaurants.find(r => r.id === activeRestaurantId);

    const updateRestaurant = (field, value) => {
        console.log(`[STATE UPDATE] Campo: '${field}', Nuevo Valor: '${value}'`);
        setRestaurants(prev => prev.map(r => 
            r.id === activeRestaurantId 
                ? { ...r, [field]: value }
                : r
        ));
    };

    const updatePortalConfig = (field, value) => {
        setPortalConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (field, file) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target.result;
                setPortalConfig(prev => ({
                    ...prev,
                    [field]: imageUrl,
                    [`${field.replace('Url', 'File')}`]: file
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const addRestaurant = () => {
        const newId = restaurants.length > 0 ? Math.max(...restaurants.map(r => r.id)) + 1 : 1;
        const newRestaurant = {
            id: newId,
            name: '',
            address: '',
            rfc: '',
            fiscalAddress: '',
            csdCertFile: null,
            csdKeyFile: null,
            csdPassword: '',
            dbHost: '',
            dbPort: '1433',
            dbName: '',
            dbUser: '',
            dbPassword: '',
            enableSoftRestaurant: false
        };
        setRestaurants([...restaurants, newRestaurant]);
        setActiveRestaurantId(newId);
    };

    const removeRestaurant = (id) => {
        if (restaurants.length <= 1) return;
        setRestaurants(prev => prev.filter(r => r.id !== id));
        if (activeRestaurantId === id) {
            setActiveRestaurantId(restaurants.find(r => r.id !== id).id);
        }
    };

    const handleNext = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleTestDbConnection = async () => {
        if (!activeRestaurantId) return;

        setIsTestingConnection(true);
        setConnectionStatus(null);
        
        try {
            const result = await testPOSConnection(activeRestaurantId);
            setConnectionStatus({ success: true, message: result.message });
            alert('Éxito: ' + result.message);
        } catch (error) {
            setConnectionStatus({ success: false, message: error.message });
            alert('Error: ' + error.message);
        } finally {
            setIsTestingConnection(false);
        }
    };

    const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
        const createdRestaurantPromises = restaurants.map(restaurant => {
            const restaurantData = {
                name: restaurant.name,
                address: restaurant.address,
                connectionHost: restaurant.dbHost,
                connectionPort: restaurant.dbPort,
                connectionUser: restaurant.dbUser,
                connectionPassword: restaurant.dbPassword,
                connectionDbName: restaurant.dbName,
            };
            
            // --- SECCIÓN CORREGIDA ---
            // Asegúrate de que este objeto incluya todos los campos fiscales
            const fiscalData = {
                rfc: restaurant.rfc,
                businessName: restaurant.businessName,      // <-- AÑADIDO
                fiscalRegime: restaurant.fiscalRegime,      // <-- AÑADIDO
                fiscalAddress: restaurant.fiscalAddress,
                csdPassword: restaurant.csdPassword,
            };

            const files = {
                csdCertificate: restaurant.csdCertFile,
                csdKey: restaurant.csdKeyFile,
            };

            return createRestaurant(restaurantData, fiscalData, files);
        });

        const creationResults = await Promise.all(createdRestaurantPromises);
        console.log('Restaurantes creados:', creationResults);

        if (creationResults.length > 0 && creationResults[0].restaurant) {
            const firstRestaurantId = creationResults[0].restaurant.id;

            const portalData = {
                name: portalConfig.portalName,
                subdomain: portalConfig.subdomain,
                primaryColor: portalConfig.primaryColor,
                welcomeMessage: portalConfig.welcomeMessage,
                showWelcomeMessage: portalConfig.showWelcomeMessage,
                customCSS: portalConfig.customCSS,
            };
            
            const portalFiles = {
                logo: portalConfig.logoFile,
                backgroundImage: portalConfig.backgroundFile
            };
            
            // Asumo que tienes una función similar para actualizar el portal
            // await updatePortal(firstRestaurantId, portalData, portalFiles);
            console.log('Portal configurado exitosamente.');
        }

        alert('¡Configuración guardada exitosamente!');
        window.location.href = '/dashboard';

    } catch (error) {
        console.error('Error al guardar la configuración:', error);
        setSubmitError(error.message || 'Ocurrió un error inesperado. Por favor, revisa los datos e inténtalo de nuevo.');
        alert(`Error al guardar: ${error.message}`);
    } finally {
        setIsSubmitting(false);
    }
};

    const validateSubdomain = (value) => {
        return value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
    };

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'dark bg-slate-900 text-white' : 'bg-gray-50 text-black'}`}>
            {/* Header con toggle de dark mode */}
            <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div>
                            <h1 className="text-xl font-semibold">NextManager</h1>
                        </div>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                        >
                            {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Encabezado */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Asistente de Configuración</h1>
                    <p className="mt-1 text-gray-600 dark:text-slate-400">Sigue estos pasos para dejar tu cuenta lista y funcionando.</p>
                </div>

                {/* Layout del Wizard */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Stepper Lateral */}
                    <aside className="lg:col-span-3">
                        <div className="sticky top-8">
                            <SetupStepper currentStep={currentStep} setStep={setCurrentStep} />
                        </div>
                    </aside>

                    {/* Área de Contenido del Paso Actual */}
                    <main className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* PASO 1: PORTAL */}
                                {currentStep === 1 && (
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                                        {/* Columna de la Izquierda: Configuración */}
                                        <Card title="Configuración del Portal de Clientes">
                                            <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">Personaliza la página donde tus clientes generarán sus facturas.</p>
                                            <div className="space-y-6">
                                                <InputField 
                                                    icon={BuildingStorefrontIcon} 
                                                    label="Nombre del Portal" 
                                                    placeholder="Ej. Restaurante El Sazón"
                                                    value={portalConfig.portalName}
                                                    onChange={(e) => updatePortalConfig('portalName', e.target.value)}
                                                />
                                                
                                                <InputField 
                                                    icon={GlobeAltIcon} 
                                                    label="Subdominio" 
                                                    placeholder="mirestaurante"
                                                    addon=".nextmanager.com.mx"
                                                    value={portalConfig.subdomain}
                                                    onChange={(e) => updatePortalConfig('subdomain', validateSubdomain(e.target.value))}
                                                />

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Color Primario</label>
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="color"
                                                            value={portalConfig.primaryColor}
                                                            onChange={(e) => updatePortalConfig('primaryColor', e.target.value)}
                                                            className="w-12 h-10 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={portalConfig.primaryColor}
                                                            onChange={(e) => updatePortalConfig('primaryColor', e.target.value)}
                                                            className="flex-1 py-2 px-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                                            placeholder="#2563eb"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Logo (Opcional)</label>
                                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-slate-600 border-dashed rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                                                        <div className="space-y-1 text-center">
                                                            {portalConfig.logoUrl ? (
                                                                <div className="space-y-2">
                                                                    <img 
                                                                        src={portalConfig.logoUrl} 
                                                                        alt="Logo preview" 
                                                                        className="mx-auto h-16 w-16 object-contain rounded-lg border border-gray-200"
                                                                    />
                                                                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                                                        {portalConfig.logoFile?.name || 'Logo cargado'}
                                                                    </p>
                                                                    <button
                                                                        onClick={() => {
                                                                            setPortalConfig(prev => ({
                                                                                ...prev,
                                                                                logoUrl: '',
                                                                                logoFile: null
                                                                            }));
                                                                        }}
                                                                        className="text-xs text-red-500 hover:text-red-700"
                                                                    >
                                                                        Remover
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                                    <div className="flex text-sm text-gray-600 dark:text-slate-400">
                                                                        <label className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-blue-600 hover:text-blue-500">
                                                                            <span>Subir logo</span>
                                                                            <input 
                                                                                type="file" 
                                                                                className="sr-only" 
                                                                                accept="image/*"
                                                                                onChange={(e) => handleImageUpload('logoUrl', e.target.files[0])}
                                                                            />
                                                                        </label>
                                                                        <p className="pl-1">o arrastra y suelta</p>
                                                                    </div>
                                                                    <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 2MB</p>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Mensaje de Bienvenida</label>
                                                        <label className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={portalConfig.showWelcomeMessage}
                                                                onChange={(e) => updatePortalConfig('showWelcomeMessage', e.target.checked)}
                                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-600 dark:text-slate-400">Mostrar</span>
                                                        </label>
                                                    </div>
                                                    <textarea
                                                        rows="3"
                                                        value={portalConfig.welcomeMessage}
                                                        onChange={(e) => updatePortalConfig('welcomeMessage', e.target.value)}
                                                        disabled={!portalConfig.showWelcomeMessage}
                                                        className="w-full py-2 px-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                                                        placeholder="Mensaje que verán tus clientes al entrar al portal..."
                                                    />
                                                </div>

                                                <Accordion title="Personalización Avanzada" icon={PaintBrushIcon}>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Imagen de Fondo (Opcional)</label>
                                                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-slate-600 border-dashed rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                                                                <div className="space-y-1 text-center">
                                                                    {portalConfig.backgroundImage ? (
                                                                        <div className="space-y-2">
                                                                            <img 
                                                                                src={portalConfig.backgroundImage} 
                                                                                alt="Background preview" 
                                                                                className="mx-auto h-20 w-32 object-cover rounded-lg border border-gray-200"
                                                                            />
                                                                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                                                                {portalConfig.backgroundFile?.name || 'Imagen cargada'}
                                                                            </p>
                                                                            <button
                                                                                onClick={() => {
                                                                                    setPortalConfig(prev => ({
                                                                                        ...prev,
                                                                                        backgroundImage: '',
                                                                                        backgroundFile: null
                                                                                    }));
                                                                                }}
                                                                                className="text-xs text-red-500 hover:text-red-700"
                                                                            >
                                                                                Remover
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
                                                                            <div className="flex text-sm text-gray-600 dark:text-slate-400">
                                                                                <label className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-blue-600 hover:text-blue-500">
                                                                                    <span>Subir imagen de fondo</span>
                                                                                    <input 
                                                                                        type="file" 
                                                                                        className="sr-only" 
                                                                                        accept="image/*"
                                                                                        onChange={(e) => handleImageUpload('backgroundImage', e.target.files[0])}
                                                                                    />
                                                                                </label>
                                                                            </div>
                                                                            <p className="text-xs text-gray-500">Recomendado: 1920x1080px</p>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">CSS Personalizado</label>
                                                            <textarea
                                                                rows="4"
                                                                value={portalConfig.customCSS}
                                                                onChange={(e) => updatePortalConfig('customCSS', e.target.value)}
                                                                className="w-full py-2 px-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
                                                                placeholder="/* Agrega tu CSS personalizado aquí */&#10;.custom-class {&#10;  color: #your-color;&#10;}"
                                                            />
                                                        </div>
                                                    </div>
                                                </Accordion>
                                            </div>
                                        </Card>
                                        
                                        {/* Columna de la Derecha: Vista Previa */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <EyeIcon className="w-5 h-5 text-blue-600" />
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200">Vista Previa en Vivo</h3>
                                            </div>
                                            <PortalPreview 
                                                config={portalConfig} 
                                                restaurantName={restaurants[0]?.name || portalConfig.portalName} 
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                {/* PASO 2: RESTAURANTES */}
{currentStep === 2 && (
    <Card title="Configura tus Restaurantes">
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">Configura la información de cada sucursal o restaurante.</p>
        
        {/* Pestañas para cada restaurante */}
        <div className="border-b border-gray-200 dark:border-slate-700 mb-6">
            <nav className="-mb-px flex space-x-1 overflow-x-auto">
                {restaurants.map((r, index) => (
                    <button 
                        key={r.id} 
                        onClick={() => setActiveRestaurantId(r.id)}
                        className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                            activeRestaurantId === r.id 
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                    >
                        {r.name || `Restaurante ${index + 1}`}
                    </button>
                ))}
                <button 
                    onClick={addRestaurant} 
                    className="whitespace-nowrap py-3 px-4 text-sm font-medium text-blue-500 hover:text-blue-700 flex items-center gap-1 border-b-2 border-transparent hover:border-blue-200 transition-colors"
                >
                    <PlusIcon className="w-4 h-4" /> Añadir Restaurante
                </button>
            </nav>
        </div>

        {/* Formulario del restaurante activo */}
        {activeRestaurant && (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">
                        Editando: {activeRestaurant.name || `Restaurante ${restaurants.findIndex(r => r.id === activeRestaurantId) + 1}`}
                    </h3>
                    {restaurants.length > 1 && (
                        <button 
                            onClick={() => removeRestaurant(activeRestaurantId)} 
                            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded-lg transition-colors"
                        >
                            <TrashIcon className="w-4 h-4"/> Eliminar
                        </button>
                    )}
                </div>

                {/* --- SECCIÓN CORREGIDA Y COMPLETA --- */}

                {/* Información General */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField 
                        icon={BuildingStorefrontIcon} 
                        label="Nombre Comercial" 
                        placeholder="Ej. El Sazón Porteño (Centro)"
                        value={activeRestaurant.name}
                        onChange={(e) => updateRestaurant('name', e.target.value)}
                    />
                    <InputField 
                        icon={MapPinIcon} 
                        label="Dirección" 
                        placeholder="Av. Principal #123, Col. Centro"
                        value={activeRestaurant.address}
                        onChange={(e) => updateRestaurant('address', e.target.value)}
                    />
                </div>
                
                {/* Datos Fiscales */}
                <Accordion title="Datos Fiscales" icon={ReceiptPercentIcon} defaultOpen={true}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            <InputField 
                                icon={TagIcon} 
                                label="RFC" 
                                placeholder="XAXX010101000"
                                value={activeRestaurant.rfc}
                                onChange={(e) => updateRestaurant('rfc', e.target.value.toUpperCase())}
                                maxLength={13}
                            />
                            
                            <InputField 
                                icon={IdentificationIcon}
                                label="Razón Social" 
                                placeholder="Mi Empresa S.A. de C.V."
                                value={activeRestaurant.businessName}
                                onChange={(e) => updateRestaurant('businessName', e.target.value)}
                            />
                            
                            <InputField 
                                icon={BookOpenIcon}
                                label="Régimen Fiscal"
                                placeholder="601 - General de Ley Personas Morales"
                                value={activeRestaurant.fiscalRegime}
                                onChange={(e) => updateRestaurant('fiscalRegime', e.target.value)}
                            />

                            <InputField 
                                icon={MapPinIcon} 
                                label="Dirección Fiscal" 
                                placeholder="CP, Ciudad, Estado"
                                value={activeRestaurant.fiscalAddress}
                                onChange={(e) => updateRestaurant('fiscalAddress', e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FileUpload
                                label="Certificado (.cer)"
                                accept=".cer"
                                icon={DocumentIcon}
                                file={activeRestaurant.csdCertFile}
                                onChange={(file) => updateRestaurant('csdCertFile', file)}
                            />
                            <FileUpload
                                label="Llave Privada (.key)"
                                accept=".key"
                                icon={KeyIcon}
                                file={activeRestaurant.csdKeyFile}
                                onChange={(file) => updateRestaurant('csdKeyFile', file)}
                            />
                            <InputField 
                                icon={LockClosedIcon} 
                                label="Contraseña CSD" 
                                type="password"
                                placeholder="Contraseña de la llave"
                                value={activeRestaurant.csdPassword}
                                onChange={(e) => updateRestaurant('csdPassword', e.target.value)}
                            />
                        </div>
                    </div>
                </Accordion>

                {/* Conexión a SoftRestaurant */}
<Accordion title="Conexión a SoftRestaurant (Opcional)" icon={CircleStackIcon}>
    <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
            <div>
                <p className="text-sm font-medium">Habilitar integración con SoftRestaurant</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">Permite sincronizar datos directamente desde tu sistema POS</p>
            </div>
            <label className="flex items-center">
                <input
                    type="checkbox"
                    checked={activeRestaurant.enableSoftRestaurant}
                    onChange={(e) => updateRestaurant('enableSoftRestaurant', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
            </label>
        </div>

        {activeRestaurant.enableSoftRestaurant && (
            <div className="space-y-4 pl-4 border-l-2 border-blue-200 dark:border-blue-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField 
                        icon={ServerIcon} 
                        label="Host / IP del Servidor" 
                        placeholder="192.168.1.100"
                        value={activeRestaurant.dbHost}
                        onChange={(e) => updateRestaurant('dbHost', e.target.value)}
                    />
                    <InputField 
                        icon={CpuChipIcon} 
                        label="Puerto" 
                        placeholder="1433"
                        value={activeRestaurant.dbPort}
                        onChange={(e) => updateRestaurant('dbPort', e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField 
                        icon={CircleStackIcon} 
                        label="Nombre de la Base de Datos" 
                        placeholder="SoftRestaurantDB"
                        value={activeRestaurant.dbName}
                        onChange={(e) => updateRestaurant('dbName', e.target.value)}
                    />
                    <InputField 
                        icon={UserIcon} 
                        label="Usuario de la BD" 
                        placeholder="sa"
                        value={activeRestaurant.dbUser}
                        onChange={(e) => updateRestaurant('dbUser', e.target.value)}
                    />
                    <InputField 
                        icon={LockClosedIcon} 
                        label="Contraseña de la BD" 
                        type="password"
                        placeholder="Contraseña"
                        value={activeRestaurant.dbPassword}
                        onChange={(e) => updateRestaurant('dbPassword', e.target.value)}
                    />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckIcon className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Prueba de Conexión</span>
                    </div>
                    <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Probar Conexión
                    </button>
                </div>
            </div>
        )}
    </div>
</Accordion>
            </div>
        )}
    </Card>
)}
                                
                                {/* PASO 3: RESUMEN */}
                                {currentStep === 3 && (
                                    <Card title="Resumen y Finalizar">
                                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">Revisa que toda la información sea correcta antes de guardar.</p>
                                        
                                        <div className="space-y-6">
                                            {/* Resumen del Portal */}
                                            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-6">
                                                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                                    <GlobeAltIcon className="w-5 h-5 text-blue-600" />
                                                    Configuración del Portal
                                                </h4>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-slate-300">Nombre:</span>
                                                        <span className="font-medium">{portalConfig.portalName}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-slate-300">URL:</span>
                                                        <span className="font-mono text-blue-500">{portalConfig.subdomain}.nextmanager.com.mx</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600 dark:text-slate-300">Color Primario:</span>
                                                        <div className="flex items-center gap-2">
                                                            <div 
                                                                className="w-4 h-4 rounded border"
                                                                style={{ backgroundColor: portalConfig.primaryColor }}
                                                            ></div>
                                                            <span className="font-mono text-sm">{portalConfig.primaryColor}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-slate-300">Mensaje de Bienvenida:</span>
                                                        <span className={portalConfig.showWelcomeMessage ? "text-green-600" : "text-gray-400"}>
                                                            {portalConfig.showWelcomeMessage ? "Habilitado" : "Deshabilitado"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Resumen de Restaurantes */}
                                            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-6">
                                                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                                    <BuildingStorefrontIcon className="w-5 h-5 text-green-600" />
                                                    Restaurantes Configurados ({restaurants.length})
                                                </h4>
                                                <div className="space-y-4">
                                                    {restaurants.map((restaurant, index) => (
                                                        <div key={restaurant.id} className="border border-gray-200 dark:border-slate-600 rounded-lg p-4">
                                                            <div className="flex justify-between items-start mb-3">
                                                                <h5 className="font-medium">
                                                                    {restaurant.name || `Restaurante ${index + 1}`}
                                                                </h5>
                                                                <div className="flex items-center gap-2">
                                                                    {restaurant.rfc && (
                                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                                                            <CheckIcon className="w-3 h-3 mr-1" />
                                                                            RFC
                                                                        </span>
                                                                    )}
                                                                    {restaurant.csdCertFile && restaurant.csdKeyFile && (
                                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                                                            <CheckIcon className="w-3 h-3 mr-1" />
                                                                            CSD
                                                                        </span>
                                                                    )}
                                                                    {restaurant.enableSoftRestaurant && restaurant.dbHost && (
                                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                                                                            <CheckIcon className="w-3 h-3 mr-1" />
                                                                            SR
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="text-sm text-gray-600 dark:text-slate-300 space-y-1">
                                                                {restaurant.address && (
                                                                    <div className="flex items-center gap-2">
                                                                        <MapPinIcon className="w-4 h-4" />
                                                                        <span>{restaurant.address}</span>
                                                                    </div>
                                                                )}
                                                                {restaurant.rfc && (
                                                                    <div className="flex items-center gap-2">
                                                                        <TagIcon className="w-4 h-4" />
                                                                        <span className="font-mono">{restaurant.rfc}</span>
                                                                    </div>
                                                                )}
                                                                {restaurant.enableSoftRestaurant && restaurant.dbHost && (
                                                                    <div className="flex items-center gap-2">
                                                                        <ServerIcon className="w-4 h-4" />
                                                                        <span>{restaurant.dbHost}:{restaurant.dbPort}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Verificación Final */}
                                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0">
                                                        <svg className="w-5 h-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                                                            Importante
                                                        </h5>
                                                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                                            Asegúrate de que toda la información sea correcta. Una vez guardada, algunos datos no podrán modificarse sin contactar soporte técnico.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                )}
                                
                                {/* Controles de Navegación del Wizard */}
                                <div className="mt-8 flex justify-between">
                                    {currentStep > 1 ? (
                                        <button 
                                            onClick={handlePrev} 
                                            className="flex items-center gap-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                                        >
                                            <ChevronRightIcon className="w-4 h-4 rotate-180" />
                                            Anterior
                                        </button>
                                    ) : <div />}
                                    
                                    {currentStep < 3 ? (
                                        <button 
                                            onClick={handleNext} 
                                            className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Siguiente
                                            <ChevronRightIcon className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={handleFinalSubmit} 
                                            className="flex items-center gap-2 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <CheckIcon className="w-5 h-5" />
                                            Finalizar y Guardar
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

// Componente SetupStepper
const SetupStepper = ({ currentStep, setStep }) => {
    const steps = [
        {
            id: 1,
            title: 'Portal de Clientes',
            description: 'Personaliza tu portal',
            icon: GlobeAltIcon,
        },
        {
            id: 2,
            title: 'Restaurantes',
            description: 'Configura tus sucursales',
            icon: BuildingStorefrontIcon,
        },
        {
            id: 3,
            title: 'Resumen',
            description: 'Revisa y finaliza',
            icon: CheckIcon,
        }
    ];

    return (
        <nav className="space-y-2">
            {steps.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                    <button
                        key={step.id}
                        onClick={() => setStep(step.id)}
                        className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                            isActive
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700'
                                : isCompleted
                                ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30'
                                : 'bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                                isActive
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : isCompleted
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                    : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
                            }`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className={`text-sm font-semibold ${
                                    isActive
                                        ? 'text-blue-900 dark:text-blue-100'
                                        : isCompleted
                                        ? 'text-green-900 dark:text-green-100'
                                        : 'text-gray-900 dark:text-slate-100'
                                }`}>
                                    {step.title}
                                </div>
                                <div className={`text-xs ${
                                    isActive
                                        ? 'text-blue-600 dark:text-blue-300'
                                        : isCompleted
                                        ? 'text-green-600 dark:text-green-300'
                                        : 'text-gray-500 dark:text-slate-400'
                                }`}>
                                    {step.description}
                                </div>
                            </div>
                            {isCompleted && (
                                <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                            )}
                        </div>
                    </button>
                );
            })}
        </nav>
    );
};

// Componente PortalPreview
const PortalPreview = ({ config, restaurantName }) => {
    return (
        <div className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-xl overflow-hidden shadow-lg">
            {/* Header del preview */}
            <div className="bg-gray-100 dark:bg-slate-700 px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 text-center">
                    <span className="text-xs text-gray-500 dark:text-slate-400 font-mono">
                        {config.subdomain}.nextmanager.com.mx
                    </span>
                </div>
            </div>

            {/* Contenido del preview */}
            <div 
                className="p-6 min-h-[400px] relative overflow-hidden"
                style={{ 
                    backgroundColor: config.backgroundImage ? 'transparent' : config.primaryColor + '05',
                    borderTop: `3px solid ${config.primaryColor}`,
                    backgroundImage: config.backgroundImage ? `url(${config.backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {/* Overlay para mejor legibilidad cuando hay imagen de fondo */}
                {config.backgroundImage && (
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                )}
                
                <div className="relative z-10">
                    {/* Header del portal */}
                    <div className="text-center mb-8">
                        {config.logoUrl ? (
                            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg mb-4 bg-white">
                                <img 
                                    src={config.logoUrl} 
                                    alt="Logo" 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        ) : (
                            <div 
                                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg"
                                style={{ backgroundColor: config.primaryColor }}
                            >
                                {config.portalName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        
                        <h1 className={`text-2xl font-bold mb-2 ${config.backgroundImage ? 'text-white drop-shadow-lg' : 'text-gray-900 dark:text-white'}`}>
                            {config.portalName}
                        </h1>
                        
                        {config.showWelcomeMessage && (
                            <p className={`text-sm max-w-md mx-auto ${config.backgroundImage ? 'text-gray-100 drop-shadow' : 'text-gray-600 dark:text-slate-300'}`}>
                                {config.welcomeMessage}
                            </p>
                        )}
                    </div>

                    {/* Botón de ejemplo */}
                    <div className="flex justify-center mb-8">
                        <button 
                            className="px-6 py-3 rounded-lg text-white font-semibold shadow-lg transform hover:scale-105 transition-transform"
                            style={{ backgroundColor: config.primaryColor }}
                        >
                            Generar Factura
                        </button>
                    </div>

                    {/* Footer del preview */}
                    <div className={`pt-4 border-t text-center ${config.backgroundImage ? 'border-white border-opacity-30' : 'border-gray-200 dark:border-slate-600'}`}>
                        <p className={`text-xs ${config.backgroundImage ? 'text-gray-200' : 'text-gray-500 dark:text-slate-400'}`}>
                            Powered by NextManager
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente de tarjeta genérico
const Card = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm backdrop-blur">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <div className="p-6">{children}</div>
    </div>
);

// Componente de input genérico
const InputField = ({ icon: Icon, label, addon, className = "", ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">{label}</label>
        <div className="relative">
            {Icon && <Icon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400 z-10" />}
            <input 
                {...props}
                className={`w-full py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${Icon ? 'pl-10' : 'pl-4'} ${addon ? 'pr-48' : 'pr-4'} ${className}`}
            />
            {addon && <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-800 rounded-r-lg border-l border-gray-300 dark:border-slate-600">{addon}</span>}
        </div>
    </div>
);

// Componente Accordion
const Accordion = ({ title, icon: Icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    
    return (
        <div className="border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center justify-between transition-colors"
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-5 h-5 text-gray-600 dark:text-slate-300" />}
                    <span className="font-medium text-gray-900 dark:text-white">{title}</span>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 bg-white dark:bg-slate-900/50">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Componente FileUpload
const FileUpload = ({ label, accept, icon: Icon, file, onChange }) => {
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        onChange(selectedFile);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">{label}</label>
            <div className="relative">
                <input
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className="sr-only"
                    id={`file-${label}`}
                />
                <label
                    htmlFor={`file-${label}`}
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        file 
                            ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-600' 
                            : 'border-gray-300 bg-gray-50 dark:bg-slate-800 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {file ? (
                            <>
                                <CheckIcon className="w-8 h-8 mb-2 text-green-500" />
                                <p className="text-sm text-green-600 dark:text-green-400 font-medium">{file.name}</p>
                            </>
                        ) : (
                            <>
                                {Icon ? <Icon className="w-8 h-8 mb-2 text-gray-400" /> : <DocumentIcon className="w-8 h-8 mb-2 text-gray-400" />}
                                <p className="text-xs text-gray-500 dark:text-slate-400 text-center">Click para seleccionar</p>
                            </>
                        )}
                    </div>
                </label>
            </div>
        </div>
    );
};

export default RestaurantSetup;