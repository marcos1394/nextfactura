import React, { useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext';

// --- ICONOS LUCIDE (Consistentes con el resto de la app) ---
import {
    LayoutDashboard,
    User,
    Store,
    HelpCircle,
    Menu,
    X,
    Bell,
    Sun,
    Moon,
    LogOut,
    ChevronDown
} from 'lucide-react';

// --- DATOS DE MUESTRA (Idealmente vendrían de tu AuthContext) ---
const mockUser = {
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@elsazon.com',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop'
};

const navigationLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Mi Cuenta', href: '/profile', icon: User }, // Ajusté href a /profile para coincidir con el router anterior
    { name: 'Restaurantes', href: '/restaurant-config', icon: Store },
    { name: 'Ayuda', href: '/help-center', icon: HelpCircle },
];

// --- COMPONENTE DE ENLACE INDIVIDUAL ---
const SidebarLink = ({ item }) => {
    return (
        <NavLink
            to={item.href}
            className={({ isActive }) => `
                group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                }
            `}
        >
            {({ isActive }) => (
                <>
                    <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300'}`} />
                    <span>{item.name}</span>
                </>
            )}
        </NavLink>
    );
};

// --- CONTENIDO DEL SIDEBAR (Reutilizable para Móvil y Desktop) ---
const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-100 dark:border-slate-800">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                N
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                NextManager
            </span>
        </div>

        {/* Navegación */}
        <div className="flex-1 flex flex-col gap-1 px-4 py-6 overflow-y-auto">
            <div className="mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Menu Principal
            </div>
            {navigationLinks.map((item) => (
                <SidebarLink key={item.name} item={item} />
            ))}
        </div>

        {/* Footer del Sidebar (Perfil resumido o Logout) */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800">
            <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
            </button>
        </div>
    </div>
);

// --- SIDEBAR MÓVIL ---
const MobileSidebar = ({ isOpen, setIsOpen }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="relative z-50 lg:hidden">
                {/* Backdrop Oscuro */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm"
                />

                {/* Panel Deslizante */}
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed inset-y-0 left-0 w-full max-w-xs"
                >
                    <div className="relative h-full flex flex-col">
                        {/* Botón Cerrar */}
                        <div className="absolute top-0 right-0 -mr-12 pt-4">
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            >
                                <X className="h-6 w-6 text-white" />
                            </button>
                        </div>
                        
                        {/* Contenido */}
                        <SidebarContent />
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

// --- LAYOUT PRINCIPAL ---
function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { darkMode, toggleTheme } = useThemeContext();
    const location = useLocation();

    // Título dinámico basado en la ruta actual
    const currentRoute = navigationLinks.find(link => link.href === location.pathname);
    const pageTitle = currentRoute ? currentRoute.name : 'Dashboard';

    return (
        <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark bg-slate-950' : 'bg-gray-50'}`}>
            
            {/* Sidebar Móvil */}
            <MobileSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Sidebar Desktop (Oculto en móvil) */}
            <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 shadow-xl z-30">
                <SidebarContent />
            </div>

            {/* Área Principal */}
            <div className="flex flex-1 flex-col lg:pl-72 transition-all duration-300">
                
                {/* --- HEADER --- */}
                <header className="sticky top-0 z-20 flex h-20 flex-shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 shadow-sm backdrop-blur-md sm:gap-x-6 sm:px-6 lg:px-8">
                    
                    {/* Botón Hamburguesa (Móvil) */}
                    <button 
                        type="button" 
                        className="-m-2.5 p-2.5 text-gray-700 dark:text-white lg:hidden" 
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Abrir menú</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Título de la Página (Visible en Desktop) */}
                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                            {pageTitle}
                        </h1>
                    </div>

                    {/* Acciones del Header */}
                    <div className="flex items-center gap-x-4 lg:gap-x-6">
                        {/* Toggle Tema */}
                        <button 
                            onClick={toggleTheme} 
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
                            aria-label="Cambiar tema"
                        >
                            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>

                        {/* Notificaciones */}
                        <button type="button" className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-800">
                            <span className="sr-only">Ver notificaciones</span>
                            <Bell className="h-5 w-5" aria-hidden="true" />
                            {/* Dot de notificación */}
                            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
                        </button>

                        {/* Separador Vertical */}
                        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-slate-700" aria-hidden="true" />

                        {/* Dropdown de Usuario */}
                        <div className="relative">
                            <Link to="/profile" className="flex items-center gap-x-4 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                <img
                                    className="h-9 w-9 rounded-full bg-gray-50 object-cover ring-2 ring-white dark:ring-slate-700"
                                    src={mockUser.avatarUrl}
                                    alt=""
                                />
                                <span className="hidden lg:flex lg:items-center">
                                    <span className="ml-2 text-sm font-semibold leading-6 text-gray-900 dark:text-white" aria-hidden="true">
                                        {mockUser.name}
                                    </span>
                                    <ChevronDown className="ml-2 h-4 w-4 text-gray-400" aria-hidden="true" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* --- CONTENIDO PRINCIPAL --- */}
                <main className="flex-1 overflow-y-auto py-8">
                    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                        {/* Aquí se inyectan las páginas */}
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AppLayout;