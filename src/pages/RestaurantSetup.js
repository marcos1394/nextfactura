// src/pages/RestaurantSetup.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext';
// Usaremos un set de iconos consistente y de alta calidad
import {
    BuildingStorefrontIcon, PaintBrushIcon, CheckCircleIcon, ChevronRightIcon,
    PlusIcon, TrashIcon, TagIcon, MapPinIcon, ReceiptPercentIcon, KeyIcon,
    CpuChipIcon, CircleStackIcon, GlobeAltIcon, PhotoIcon
} from '@heroicons/react/24/outline';

// --- MOCK DATA & HELPERS ---
const initialRestaurant = {
    id: Date.now(), name: '', address: '', rfc: '', fiscalRegime: '601 - General de Ley Personas Morales',
    csdPassword: '', csdCertFile: null, csdKeyFile: null, logoFile: null,
    dbHost: '', dbPort: '', dbUser: '', dbPassword: '', dbName: ''
};

// --- SUBCOMPONENTES DE UI PARA EL WIZARD ---

// Stepper lateral que muestra el progreso
const SetupStepper = ({ currentStep, setStep }) => {
    const steps = [
        { id: 1, name: 'Portal del Cliente', icon: PaintBrushIcon },
        { id: 2, name: 'Tus Restaurantes', icon: BuildingStorefrontIcon },
        { id: 3, name: 'Resumen y Finalizar', icon: CheckCircleIcon }
    ];
    return (
        <nav className="space-y-1 p-4" aria-label="Setup Steps">
            {steps.map(step => (
                <button
                    key={step.name}
                    onClick={() => setStep(step.id)}
                    disabled={step.id > currentStep}
                    className={`group flex w-full items-center rounded-md p-3 text-sm font-medium transition-colors disabled:opacity-50 ${
                        currentStep === step.id
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                >
                    <step.icon className={`mr-3 h-6 w-6 flex-shrink-0 ${currentStep === step.id ? 'text-white' : 'text-gray-400 dark:text-slate-500 group-hover:text-gray-500'}`} />
                    <span>{step.name}</span>
                </button>
            ))}
        </nav>
    );
};

// Componente de Acordeón para agrupar campos
const Accordion = ({ title, icon: Icon, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-gray-800 dark:text-slate-200">{title}</span>
                </div>
                <ChevronRightIcon className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        <div className="p-6 space-y-4">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
/**
 * RestaurantSetup - Reimaginado como un asistente (wizard) guiado y amigable.
 * * Estrategia de UX/UI:
 * 1.  Wizard con Navegación Lateral: Se reemplaza el formulario largo por un layout de "wizard" con
 * un stepper vertical. Esto reduce la carga cognitiva y le da al usuario un "mapa" constante de su progreso.
 * 2.  Gestión de Complejidad con Pestañas: Para manejar múltiples restaurantes, se usa una interfaz de
 * pestañas. Esto evita una página vertical interminable y mantiene el contexto de cada restaurante aislado y claro.
 * 3.  Organización con Acordeones: Dentro de cada formulario de restaurante, los campos se agrupan en
 * secciones plegables (Datos Fiscales, Conexión). El usuario puede enfocarse en una tarea a la vez.
 * 4.  Simplicidad y Enfoque en el Diseño: La lógica de backend se simula para permitir un enfoque total
 * en crear una experiencia de usuario fluida, intuitiva y profesional para un proceso inherentemente complejo.
 */
function RestaurantSetup() {
    const { darkMode } = useThemeContext();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [restaurants, setRestaurants] = useState([initialRestaurant]);
    const [activeRestaurantId, setActiveRestaurantId] = useState(restaurants[0].id);
    const [portalConfig, setPortalConfig] = useState({
        portalName: 'Facturación El Sazón Porteño',
        subdomain: 'sazon-porteno',
        primaryColor: '#005DAB'
    });
    
    // Simulación de handlers
    const handleNext = () => setCurrentStep(s => Math.min(s + 1, 3));
    const handlePrev = () => setCurrentStep(s => Math.max(s - 1, 1));
    const handleFinalSubmit = () => {
        alert('¡Configuración guardada con éxito! (Simulado)');
        navigate('/dashboard');
    };
    
    const addRestaurant = () => {
        const newRestaurant = { ...initialRestaurant, id: Date.now(), name: `Sucursal ${restaurants.length + 1}` };
        setRestaurants(prev => [...prev, newRestaurant]);
        setActiveRestaurantId(newRestaurant.id);
    };

    const removeRestaurant = (idToRemove) => {
        const newRestaurants = restaurants.filter(r => r.id !== idToRemove);
        setRestaurants(newRestaurants);
        if (activeRestaurantId === idToRemove) {
            setActiveRestaurantId(newRestaurants[0]?.id || null);
        }
    };
    
    const activeRestaurant = restaurants.find(r => r.id === activeRestaurantId);

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-slate-900 text-white' : 'bg-white text-black'}`}>
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
                                    <Card title="Configuración del Portal de Clientes">
                                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">Personaliza la página donde tus clientes generarán sus facturas.</p>
                                        <div className="space-y-4">
                                           {/* Inputs para portalName, subdomain, primaryColor, etc. */}
                                            <InputField icon={GlobeAltIcon} label="Nombre del Portal" value={portalConfig.portalName} />
                                            <InputField icon={TagIcon} label="Subdominio" value={portalConfig.subdomain} addon=".nextmanager.com.mx" />
                                            <InputField icon={PhotoIcon} label="URL del Logo" placeholder="https://ejemplo.com/logo.png" />
                                            <div className="flex items-center gap-4">
                                                <label className="text-sm font-medium">Color de Marca</label>
                                                <input type="color" value={portalConfig.primaryColor} onChange={e => setPortalConfig({...portalConfig, primaryColor: e.target.value})} className="w-10 h-10"/>
                                            </div>
                                        </div>
                                    </Card>
                                )}
                                
                                {/* PASO 2: RESTAURANTES */}
                                {currentStep === 2 && (
                                     <Card title="Configura tus Restaurantes">
                                         {/* Pestañas para cada restaurante */}
                                        <div className="border-b border-gray-200 dark:border-slate-700 mb-6">
                                            <nav className="-mb-px flex space-x-4 overflow-x-auto">
                                                {restaurants.map(r => (
                                                    <button key={r.id} onClick={() => setActiveRestaurantId(r.id)}
                                                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeRestaurantId === r.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>
                                                        {r.name || `Restaurante ${restaurants.findIndex(res => res.id === r.id) + 1}`}
                                                    </button>
                                                ))}
                                                <button onClick={addRestaurant} className="whitespace-nowrap py-3 px-2 text-sm font-medium text-blue-500 hover:text-blue-700 flex items-center gap-1"><PlusIcon className="w-4 h-4" /> Añadir</button>
                                            </nav>
                                        </div>

                                        {/* Formulario del restaurante activo */}
                                        {activeRestaurant && (
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="text-xl font-semibold">Editando: {activeRestaurant.name}</h3>
                                                    {restaurants.length > 1 && <button onClick={() => removeRestaurant(activeRestaurantId)} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700"><TrashIcon className="w-4 h-4"/> Eliminar</button>}
                                                </div>
                                                <InputField icon={BuildingStorefrontIcon} label="Nombre Comercial" placeholder="Ej. El Sazón Porteño (Centro)" />
                                                <InputField icon={MapPinIcon} label="Dirección" placeholder="Av. Principal #123, Col. Centro" />
                                                
                                                <Accordion title="Datos Fiscales" icon={ReceiptPercentIcon}>
                                                    <InputField icon={TagIcon} label="RFC" placeholder="XAXX010101000" />
                                                    <InputField icon={MapPinIcon} label="Dirección Fiscal" placeholder="CP, Ciudad, Estado" />
                                                    {/* FileUploads y password de CSD irían aquí */}
                                                </Accordion>

                                                <Accordion title="Conexión a SoftRestaurant (Opcional)" icon={CircleStackIcon}>
                                                    <InputField icon={CpuChipIcon} label="Host / IP del Servidor" placeholder="192.168.1.100" />
                                                     {/* Otros campos de BD irían aquí */}
                                                </Accordion>
                                            </div>
                                        )}
                                     </Card>
                                )}
                                
                                {/* PASO 3: RESUMEN */}
                                {currentStep === 3 && (
                                    <Card title="Resumen y Finalizar">
                                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">Revisa que toda la información sea correcta antes de guardar.</p>
                                        <div className="space-y-4">
                                            <div><h4 className="font-semibold">Portal:</h4><p className="text-gray-600 dark:text-slate-300">{portalConfig.portalName} en <span className="font-mono text-blue-500">{portalConfig.subdomain}.nextmanager.com.mx</span></p></div>
                                            <div><h4 className="font-semibold">Restaurantes ({restaurants.length}):</h4><p className="text-gray-600 dark:text-slate-300">{restaurants.map(r => r.name || 'Sin Nombre').join(', ')}</p></div>
                                        </div>
                                    </Card>
                                )}
                                
                                {/* Controles de Navegación del Wizard */}
                                <div className="mt-8 flex justify-between">
                                    {currentStep > 1 ? (
                                        <button onClick={handlePrev} className="bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg">Anterior</button>
                                    ) : <div />}
                                    
                                    {currentStep < 3 ? (
                                        <button onClick={handleNext} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">Siguiente</button>
                                    ) : (
                                        <button onClick={handleFinalSubmit} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg">Finalizar y Guardar</button>
                                    )}
                                </div>

                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
}

// Componente de tarjeta genérico
const Card = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <div className="p-6">{children}</div>
    </div>
);

// Componente de input genérico
const InputField = ({ icon: Icon, label, addon, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{label}</label>
        <div className="relative">
            {Icon && <Icon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />}
            <input 
                {...props}
                className={`w-full py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${Icon ? 'pl-10' : 'pl-4'} ${addon ? 'pr-48' : 'pr-4'}`}
            />
            {addon && <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500 dark:text-slate-400">{addon}</span>}
        </div>
    </div>
);

export default RestaurantSetup;
