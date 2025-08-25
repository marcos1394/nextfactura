import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext';

// Importamos todos los iconos necesarios
import {
    UserCircleIcon, ShieldCheckIcon, CreditCardIcon, SparklesIcon, BuildingStorefrontIcon,
    PencilSquareIcon, DocumentArrowDownIcon,  ArrowDownOnSquareStackIcon, KeyIcon, ClipboardDocumentIcon, CheckCircleIcon
} from '@heroicons/react/24/outline';

// --- SUBCOMPONENTES DE UI ---

const BillingTab = ({ data }) => (
    <Card title="Datos de Facturación" actionButton={<ActionButton />}>
        <div className="space-y-4 text-gray-600 dark:text-slate-300">
            <div>
                <h4 className="font-semibold text-gray-800 dark:text-slate-200">Información Fiscal</h4>
                <p><strong>RFC:</strong> {data.rfc}</p>
                <p><strong>Dirección Fiscal:</strong> {data.fiscalAddress}</p>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                <h4 className="font-semibold text-gray-800 dark:text-slate-200">Método de Pago</h4>
                <p><strong>Método:</strong> {data.paymentMethod}</p>
                <p><strong>Próximo cobro:</strong> {new Date(data.nextBillingDate).toLocaleDateString()}</p>
            </div>
        </div>
    </Card>
);

// --- Añade este nuevo componente ---

const PlanTab = ({ data }) => (
    <Card title="Mi Plan Actual" actionButton={<ActionButton text="Cambiar Plan"/>}>
         <div className="space-y-4 text-gray-600 dark:text-slate-300">
            <div>
                <h4 className="text-2xl font-bold text-gray-800 dark:text-slate-200">{data.name}</h4>
                <p className="text-lg">{`$${data.price} / ${data.period}`}</p>
            </div>
            <div className="pt-4">
                <p className="text-sm font-medium mb-1">Uso del plan</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${data.usagePercentage}%` }}></div>
                </div>
                <p className="text-xs text-right mt-1">{data.usagePercentage}% utilizado</p>
            </div>
        </div>
    </Card>
);


// --- Añade este nuevo componente ---

const RestaurantsTab = ({ data }) => (
    <Card title="Mis Restaurantes" actionButton={<ActionButton text="Añadir Restaurante"/>}>
        <ul className="divide-y divide-gray-200 dark:divide-slate-700">
            {data.map(restaurant => (
                <li key={restaurant.id} className="py-3 flex justify-between items-center">
                    <p className="font-medium text-gray-800 dark:text-slate-200">{restaurant.name}</p>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        restaurant.status === 'Activo' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}>
                        {restaurant.status}
                    </span>
                </li>
            ))}
        </ul>
    </Card>
);

// Componente de Tarjeta Genérico
const Card = ({ title, actionButton, children, className = '' }) => (
    <div className={`bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm ${className}`}>
        <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
            {actionButton}
        </div>
        <div className="p-6">{children}</div>
    </div>
);

// Botón de Acción genérico para las tarjetas
const ActionButton = ({ onClick, isEditing = false, text = 'Editar' }) => (
    <button onClick={onClick} className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
        <PencilSquareIcon className="w-5 h-5"/> {isEditing ? 'Ver' : text}
    </button>
);

// Navegación de Pestañas
const AccountTabs = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'profile', name: 'Perfil', icon: UserCircleIcon },
        { id: 'security', name: 'Seguridad', icon: ShieldCheckIcon },
        { id: 'billing', name: 'Facturación', icon: CreditCardIcon },
        { id: 'plan', name: 'Mi Plan', icon: SparklesIcon },
        { id: 'restaurants', name: 'Mis Restaurantes', icon: BuildingStorefrontIcon },
        { id: 'connectors', name: 'Conectores', icon: ArrowDownOnSquareStackIcon },
    ];
    return (
        <nav className="flex flex-col space-y-1">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                >
                    <tab.icon className={`mr-3 h-6 w-6 flex-shrink-0 ${activeTab === tab.id ? 'text-white' : 'text-gray-400 dark:text-slate-500'}`} />
                    <span>{tab.name}</span>
                </button>
            ))}
        </nav>
    );
};

// Contenido de la Pestaña de Perfil
const ProfileTab = ({ data }) => (
    <Card title="Información Personal">
        <div className="space-y-2 text-gray-600 dark:text-slate-300">
            <p><strong>Nombre:</strong> {data.name}</p>
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>Miembro desde:</strong> {new Date(data.memberSince).toLocaleDateString()}</p>
        </div>
    </Card>
);

const SecurityTab = () => (
    <Card title="Seguridad de la Cuenta">
        <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {/* Sección para Cambiar Contraseña */}
            <div className="py-4">
                <h4 className="font-semibold text-gray-800 dark:text-slate-200">Contraseña</h4>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Se recomienda cambiar la contraseña periódicamente para mantener tu cuenta segura.</p>
                <button className="mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    Cambiar Contraseña
                </button>
            </div>

            {/* Sección para Autenticación de Dos Factores */}
            <div className="py-4">
                <h4 className="font-semibold text-gray-800 dark:text-slate-200">Autenticación de Dos Factores (2FA)</h4>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Añade una capa extra de seguridad a tu cuenta al iniciar sesión.</p>
                <button className="mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    Gestionar 2FA
                </button>
            </div>
        </div>
    </Card>
);

// Contenido de la Pestaña de Conectores
const ConnectorsTab = ({ restaurant }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyToClipboard = () => {
        if (restaurant?.agentKey) {
            navigator.clipboard.writeText(restaurant.agentKey);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await fetch('/api/restaurants/connector/download', {
                headers: {
                    // Asegúrate de enviar el token de autenticación
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}` 
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'No tienes permiso para descargar este archivo.');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'NextFactura-Connector.msi';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <Card title="Integración con Punto de Venta">
            <div className="space-y-6">
                <div>
                    <h4 className="font-semibold text-gray-800 dark:text-slate-200">Conector para Soft Restaurant®</h4>
                    <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                        Descarga nuestro agente para sincronizar automáticamente las ventas de tu Punto de Venta con NextFactura.
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Tu Clave de Agente Única</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input 
                            type="text" 
                            value={restaurant?.agentKey || 'Clave no disponible...'} 
                            readOnly 
                            className="flex-1 block w-full rounded-none rounded-l-md p-2 bg-gray-100 dark:bg-slate-900 border-gray-300 dark:border-slate-600 font-mono text-sm" 
                        />
                        <button 
                            onClick={handleCopyToClipboard}
                            className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-600"
                        >
                            {isCopied ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : <ClipboardDocumentIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                    <button 
                        onClick={handleDownload}
                        className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                        <DocumentArrowDownIcon className="w-5 h-5" /> Descargar Instalador
                    </button>
                </div>
            </div>
        </Card>
    );
};

// --- COMPONENTE PRINCIPAL ---
function UserProfile() {
    const { darkMode } = useThemeContext();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const fetchAccountData = async () => {
            setIsLoading(true);
            try {
                // Obtenemos el token de autenticación (ej. de localStorage)
                const token = localStorage.getItem('authToken');
                if (!token) throw new Error('Usuario no autenticado.');

                // Hacemos la llamada al backend para obtener TODOS los datos de la cuenta
                const response = await fetch('/api/auth/account-details', { // Endpoint de ejemplo
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('No se pudieron cargar los datos de la cuenta.');
                }
                
                const data = await response.json();
                setUserData(data.data); // Asumiendo que la API devuelve { success: true, data: { ... } }
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching account data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccountData();
    }, []);

    // --- Renderizado Condicional ---
    if (isLoading) {
        return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex justify-center items-center"><p className="text-gray-500">Cargando tu cuenta...</p></div>;
    }
    if (error) {
        return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex justify-center items-center"><p className="text-red-500">Error: {error}</p></div>;
    }

    return (
        <main className={`min-h-screen w-full p-4 sm:p-6 lg:p-8 font-sans ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-black'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-start gap-4 mb-8">
                    <img src={userData.profile.avatarUrl || `https://ui-avatars.com/api/?name=${userData.profile.name}`} alt="Avatar" className="w-16 h-16 rounded-full"/>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mi Cuenta</h1>
                        <p className="mt-1 text-gray-600 dark:text-slate-400">Gestiona tu perfil, facturación y configuraciones de seguridad.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <aside className="lg:col-span-3">
                        <AccountTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                    </aside>

                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                           <motion.div
    key={activeTab}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
>
    {activeTab === 'profile' && <ProfileTab data={userData.profile} />}
    {activeTab === 'security' && <SecurityTab />}
    {activeTab === 'billing' && <BillingTab data={userData.billing} />}
    {activeTab === 'plan' && <PlanTab data={userData.plan} />}
    {activeTab === 'restaurants' && <RestaurantsTab data={userData.restaurants} />}
    {activeTab === 'connectors' && <ConnectorsTab restaurant={userData.restaurants[0]} />}
</motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default UserProfile;