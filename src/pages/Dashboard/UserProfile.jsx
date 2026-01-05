import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth'; // Ajusta la ruta según tu estructura
import { 
    User, 
    Shield, 
    CreditCard, 
    Zap, 
    Store, 
    Puzzle, // Para conectores
    Edit2, 
    Download, 
    Copy, 
    Check, 
    MapPin,
    Calendar,
    Mail,
    LogOut
} from 'lucide-react';

// --- SUBCOMPONENTES DE UI ---

// Botón de acción pequeño
const ActionButton = ({ onClick, text, icon: Icon }) => (
    <button 
        onClick={onClick} 
        className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
    >
        {Icon && <Icon className="w-4 h-4" />}
        {text}
    </button>
);

// Tarjeta contenedora
const SectionCard = ({ title, action, children, className = '' }) => (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden ${className}`}>
        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
            {action}
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

// --- PESTAÑAS DE CONTENIDO ---

const ProfileTab = ({ data }) => (
    <SectionCard title="Información Personal" action={<ActionButton text="Editar Perfil" icon={Edit2} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre Completo</label>
                    <p className="text-base font-medium text-gray-900 dark:text-white mt-0.5">{data.name}</p>
                </div>
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Correo Electrónico</label>
                    <div className="flex items-center gap-2 mt-0.5">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <p className="text-base font-medium text-gray-900 dark:text-white">{data.email}</p>
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Miembro Desde</label>
                    <div className="flex items-center gap-2 mt-0.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                            {new Date(data.memberSince).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </SectionCard>
);

const SecurityTab = () => (
    <SectionCard title="Seguridad y Acceso">
        <div className="divide-y divide-gray-100 dark:divide-slate-700">
            <div className="py-4 flex items-center justify-between">
                <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Contraseña</h4>
                    <p className="text-sm text-gray-500 mt-1">Última actualización hace 3 meses.</p>
                </div>
                <button className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    Cambiar
                </button>
            </div>
            <div className="py-4 flex items-center justify-between">
                <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Autenticación de dos factores (2FA)</h4>
                    <p className="text-sm text-gray-500 mt-1">Añade una capa extra de seguridad.</p>
                </div>
                <button className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                    Activar
                </button>
            </div>
            <div className="py-4 flex items-center justify-between">
                <div>
                    <h4 className="font-medium text-red-600 dark:text-red-400">Cerrar todas las sesiones</h4>
                    <p className="text-sm text-gray-500 mt-1">Desconectar tu cuenta de otros dispositivos.</p>
                </div>
                <button className="px-4 py-2 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    Cerrar Sesiones
                </button>
            </div>
        </div>
    </SectionCard>
);

const BillingTab = ({ data }) => (
    <div className="space-y-6">
        <SectionCard title="Datos Fiscales" action={<ActionButton text="Actualizar Datos" icon={Edit2} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">RFC</label>
                    <p className="text-lg font-mono font-medium text-gray-900 dark:text-white mt-1">{data.rfc}</p>
                </div>
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Razón Social</label>
                    <p className="text-base font-medium text-gray-900 dark:text-white mt-1">{data.razonSocial || "No definida"}</p>
                </div>
                <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dirección Fiscal</label>
                    <div className="flex items-start gap-2 mt-1">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <p className="text-base text-gray-700 dark:text-slate-300">{data.fiscalAddress}</p>
                    </div>
                </div>
            </div>
        </SectionCard>

        <SectionCard title="Método de Pago" action={<ActionButton text="Cambiar Tarjeta" icon={CreditCard} />}>
            <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gray-200 dark:bg-slate-700 rounded flex items-center justify-center">
                    <div className="w-8 h-5 bg-blue-600 rounded-sm"></div> {/* Placeholder visual de tarjeta */}
                </div>
                <div>
                    <p className="font-medium text-gray-900 dark:text-white">•••• •••• •••• {data.last4 || '4242'}</p>
                    <p className="text-sm text-gray-500">Expira {data.expiryDate || '12/28'}</p>
                </div>
                <div className="ml-auto">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Activa
                    </span>
                </div>
            </div>
        </SectionCard>
    </div>
);

const PlanTab = ({ data }) => (
    <SectionCard title="Suscripción Actual" action={<ActionButton text="Ver Planes" icon={Zap} />}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{data.name}</h2>
                <p className="text-lg text-gray-600 dark:text-slate-400 mt-1">
                    ${data.price} <span className="text-sm">/ {data.period}</span>
                </p>
                <p className="text-sm text-gray-400 mt-2">Próxima renovación: {new Date(data.nextBillingDate).toLocaleDateString()}</p>
            </div>
            
            <div className="w-full md:w-1/2 space-y-3">
                <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-600 dark:text-slate-300">Folios utilizados</span>
                    <span className="text-blue-600 dark:text-blue-400">{data.usageCount} / {data.usageLimit}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${Math.min(data.usagePercentage, 100)}%` }}
                    ></div>
                </div>
                <p className="text-xs text-right text-gray-500">
                    {data.usagePercentage < 80 ? 'Consumo normal' : 'Estás cerca de tu límite'}
                </p>
            </div>
        </div>
    </SectionCard>
);

const RestaurantsTab = ({ data }) => (
    <SectionCard title="Mis Sucursales" action={<ActionButton text="Nueva Sucursal" icon={Store} />}>
        <div className="overflow-hidden">
            <ul className="divide-y divide-gray-100 dark:divide-slate-700">
                {data.map(restaurant => (
                    <li key={restaurant.id} className="py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors -mx-6 px-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                {restaurant.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{restaurant.name}</p>
                                <p className="text-sm text-gray-500">ID: {restaurant.id}</p>
                            </div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            restaurant.status === 'Activo' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${restaurant.status === 'Activo' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                            {restaurant.status}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    </SectionCard>
);

const ConnectorsTab = ({ restaurant }) => {
    const [copyState, setCopyState] = useState('idle'); // idle, copied

    const handleCopy = () => {
        if (restaurant?.agentKey) {
            navigator.clipboard.writeText(restaurant.agentKey);
            setCopyState('copied');
            setTimeout(() => setCopyState('idle'), 2000);
        }
    };

    const handleDownload = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('No estás autenticado.');

            // Simulación de descarga segura
            const response = await fetch('/api/restaurants/connector/download', {
                headers: { 'Authorization': `Bearer ${token}` } // Aseguramos el formato Bearer
            });

            if (!response.ok) throw new Error('Error al descargar.');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'NextManager-Connector.msi';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            alert(`No se pudo iniciar la descarga: ${error.message}`);
        }
    };

    return (
        <SectionCard title="Integración POS (Punto de Venta)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Puzzle className="w-5 h-5 text-blue-500" />
                            Agente de Sincronización
                        </h4>
                        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                            Descarga e instala nuestro agente en tu servidor Windows para conectar tu software de restaurante (Soft Restaurant®, Micros, etc.) con la nube de NextManager.
                        </p>
                    </div>
                    
                    <div className="pt-2">
                        <button 
                            onClick={handleDownload}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            <Download className="w-5 h-5" />
                            Descargar Instalador (.msi)
                        </button>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-xl border border-gray-200 dark:border-slate-700">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Clave de Agente (Token)
                    </label>
                    <div className="flex gap-2">
                        <code className="flex-1 block w-full rounded-lg p-3 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 font-mono text-sm text-gray-600 dark:text-slate-300 overflow-hidden text-ellipsis">
                            {restaurant?.agentKey || 'Generando clave...'}
                        </code>
                        <button 
                            onClick={handleCopy}
                            className="flex-shrink-0 p-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 transition-colors"
                            title="Copiar Clave"
                        >
                            {copyState === 'copied' ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">
                        * Pega esta clave durante la instalación del agente.
                    </p>
                </div>
            </div>
        </SectionCard>
    );
};

// --- COMPONENTE PRINCIPAL ---

const UserProfile = () => {
    // Simulamos un estado de carga robusto desde el hook
    const { user, isLoading, logout } = useAuth(); 
    const [activeTab, setActiveTab] = useState('profile');

    const menuItems = [
        { id: 'profile', label: 'Mi Perfil', icon: User },
        { id: 'security', label: 'Seguridad', icon: Shield },
        { id: 'billing', label: 'Facturación', icon: CreditCard },
        { id: 'plan', label: 'Plan y Uso', icon: Zap },
        { id: 'restaurants', label: 'Sucursales', icon: Store },
        { id: 'connectors', label: 'Conectores POS', icon: Puzzle },
    ];

    // --- Loading State (Skeleton) ---
    if (isLoading) {
        return (
            <div className="p-8 max-w-6xl mx-auto space-y-8 animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-slate-800 rounded-full"></div>
                    <div className="space-y-2">
                        <div className="h-6 w-48 bg-gray-200 dark:bg-slate-800 rounded"></div>
                        <div className="h-4 w-32 bg-gray-200 dark:bg-slate-800 rounded"></div>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-3 space-y-2">
                        {[1,2,3,4,5].map(i => <div key={i} className="h-10 w-full bg-gray-200 dark:bg-slate-800 rounded"></div>)}
                    </div>
                    <div className="col-span-9 h-96 bg-gray-200 dark:bg-slate-800 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    // --- Error State ---
    if (!user) return <div className="p-8 text-center text-red-500">No se pudo cargar la información del usuario.</div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            
            {/* Header del Perfil */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <img 
                            src={user.profile.avatarUrl || `https://ui-avatars.com/api/?name=${user.profile.name}&background=random`} 
                            alt="Avatar" 
                            className="w-20 h-20 rounded-full object-cover ring-4 ring-white dark:ring-slate-800 shadow-lg"
                        />
                        <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm">
                            <Edit2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.profile.name}</h1>
                        <p className="text-gray-500 dark:text-slate-400 font-medium">{user.profile.email}</p>
                    </div>
                </div>
                <button 
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-all font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    Cerrar Sesión
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Sidebar de Navegación */}
                <nav className="lg:col-span-3 space-y-1 sticky top-24">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                activeTab === item.id 
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-400'}`} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Área de Contenido */}
                <div className="lg:col-span-9">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'profile' && <ProfileTab data={user.profile} />}
                            {activeTab === 'security' && <SecurityTab />}
                            {activeTab === 'billing' && <BillingTab data={user.billing} />}
                            {activeTab === 'plan' && <PlanTab data={user.plan} />}
                            {activeTab === 'restaurants' && <RestaurantsTab data={user.restaurants} />}
                            {/* Pasamos el primer restaurante o null si no hay */}
                            {activeTab === 'connectors' && <ConnectorsTab restaurant={user.restaurants?.[0]} />}
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
};

export default UserProfile;