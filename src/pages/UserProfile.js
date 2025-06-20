// src/pages/UserProfile.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
// Usaremos un set de iconos consistente y de alta calidad
import {
    UserCircleIcon, ShieldCheckIcon, CreditCardIcon, SparklesIcon, BuildingStorefrontIcon,
    PencilSquareIcon, ArrowPathIcon, BellIcon
} from '@heroicons/react/24/outline';

// --- MOCK DATA (DATOS DE MUESTRA PARA DISEÑO) ---
const mockUserData = {
    profile: {
        name: 'Carlos Mendoza',
        email: 'carlos.mendoza@elsazon.com',
        avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop',
        memberSince: '2024-01-15',
    },
    billing: {
        rfc: 'MECA850101ABC',
        fiscalAddress: 'Av. Siempre Viva 742, Col. Centro, Springfield, CP 90210',
        paymentMethod: 'Visa **** **** **** 4242',
        nextBillingDate: '2025-06-15',
    },
    plan: {
        name: 'Paquete Completo',
        price: 7500,
        period: 'Anual',
        usagePercentage: 68,
    },
    restaurants: [
        { id: 1, name: 'El Sazón Porteño (Centro)', status: 'Activo' },
        { id: 2, name: 'El Sazón Porteño (Norte)', status: 'Activo' },
    ],
};

// --- SUBCOMPONENTES DE UI ---

// Navegación de Pestañas
const AccountTabs = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'profile', name: 'Perfil', icon: UserCircleIcon },
        { id: 'security', name: 'Seguridad', icon: ShieldCheckIcon },
        { id: 'billing', name: 'Facturación', icon: CreditCardIcon },
        { id: 'plan', name: 'Mi Plan', icon: SparklesIcon },
        { id: 'restaurants', name: 'Mis Restaurantes', icon: BuildingStorefrontIcon },
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
const ProfileTab = ({ data }) => {
    const [isEditing, setIsEditing] = useState(false);
    // Simulación de guardado
    const handleSave = () => { alert('Perfil guardado (simulado)'); setIsEditing(false); };
    return (
        <Card title="Información Personal" actionButton={<ActionButton onClick={() => setIsEditing(!isEditing)} isEditing={isEditing} />}>
            {isEditing ? (
                <div className="space-y-4">
                    <InputField label="Nombre Completo" defaultValue={data.name} />
                    <InputField label="Correo Electrónico" type="email" defaultValue={data.email} disabled />
                    <p className="text-xs text-gray-500">El correo electrónico no se puede cambiar.</p>
                </div>
            ) : (
                <div className="space-y-2 text-gray-600 dark:text-slate-300">
                    <p><strong>Nombre:</strong> {data.name}</p>
                    <p><strong>Email:</strong> {data.email}</p>
                    <p><strong>Miembro desde:</strong> {new Date(data.memberSince).toLocaleDateString()}</p>
                </div>
            )}
            {isEditing && <div className="mt-6 flex justify-end gap-3"><button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-200 dark:bg-slate-600">Cancelar</button><button onClick={handleSave} className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white">Guardar Cambios</button></div>}
        </Card>
    );
};

// Botón de Acción genérico para las tarjetas
const ActionButton = ({ onClick, isEditing = false }) => (
    <button onClick={onClick} className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
        <PencilSquareIcon className="w-5 h-5"/> {isEditing ? 'Ver' : 'Editar'}
    </button>
);
// Input genérico
const InputField = (props) => <input {...props} className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900" />;

// --- COMPONENTE PRINCIPAL ---
/**
 * UserProfile - Reimaginado como un "Centro de Cuenta" modular y accionable.
 * * Estrategia de UX/UI:
 * 1.  Hub Centralizado con Pestañas: Se abandona la página de "perfil" estática por un hub de gestión
 * con pestañas. Esto organiza la información compleja en secciones lógicas y manejables (Perfil,
 * Seguridad, Facturación, etc.), mejorando drásticamente la navegación y la usabilidad.
 * 2.  Diseño Accionable: Cada pieza de información es editable. El patrón de "ver y editar" permite
 * a los usuarios gestionar su cuenta de forma intuitiva sin ser abrumados por formularios constantes.
 * 3.  Layout Moderno y Consistente: Se utiliza un layout de dos columnas con navegación lateral, un
 * estándar en aplicaciones SaaS modernas, que proporciona una estructura clara y escalable.
 * 4.  Simulación de Datos para Diseño: Se utiliza un objeto de datos de muestra (`mock`) para poblar
 * la UI, permitiendo un enfoque total en el diseño de una experiencia de usuario robusta y profesional.
 */
function UserProfile() {
    const { darkMode } = useThemeContext();
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        // Simulación de carga de datos del perfil
        const timer = setTimeout(() => {
            setUserData(mockUserData);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (!userData) {
        return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex justify-center items-center"><p className="text-gray-500">Cargando perfil...</p></div>;
    }

    return (
        <main className={`min-h-screen w-full p-4 sm:p-6 lg:p-8 font-sans ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-black'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-start gap-4 mb-8">
                    <img src={userData.profile.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full"/>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mi Cuenta</h1>
                        <p className="mt-1 text-gray-600 dark:text-slate-400">Gestiona tu perfil, facturación y configuraciones de seguridad.</p>
                    </div>
                </div>

                {/* Layout del Hub de Cuenta */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Navegación Lateral de Pestañas */}
                    <aside className="lg:col-span-3">
                        <AccountTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                    </aside>

                    {/* Contenido de la Pestaña Activa */}
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
                                {activeTab === 'security' && (
                                    <Card title="Seguridad de la Cuenta">
                                        <div className="divide-y divide-gray-200 dark:divide-slate-700">
                                            <div className="py-4">
                                                <h4 className="font-semibold">Contraseña</h4>
                                                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Se recomienda cambiar la contraseña periódicamente.</p>
                                                <button className="mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">Cambiar Contraseña</button>
                                            </div>
                                            <div className="py-4">
                                                <h4 className="font-semibold">Autenticación de Dos Factores (2FA)</h4>
                                                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Añade una capa extra de seguridad a tu cuenta.</p>
                                                <button className="mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">Gestionar 2FA</button>
                                            </div>
                                        </div>
                                    </Card>
                                )}
                                {activeTab === 'billing' && <Card title="Facturación e Historial" actionButton={<ActionButton />}>...</Card>}
                                {activeTab === 'plan' && <Card title="Mi Plan Actual" actionButton={<ActionButton />}>...</Card>}
                                {activeTab === 'restaurants' && <Card title="Mis Restaurantes" actionButton={<ActionButton />}>...</Card>}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}

// Componente de Tarjeta Genérico
const Card = ({ title, actionButton, children }) => (
    <div className="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm">
        <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
            {actionButton}
        </div>
        <div className="p-6">{children}</div>
    </div>
);

export default UserProfile;
