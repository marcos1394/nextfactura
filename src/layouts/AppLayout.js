// src/layouts/AppLayout.js
import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
// Iconos para la navegación y el header
import {
    ChartBarSquareIcon, UserCircleIcon, Cog6ToothIcon, QuestionMarkCircleIcon,
    Bars3Icon, XMarkIcon, BellIcon, SunIcon, MoonIcon
} from '@heroicons/react/24/solid';

// --- DATOS DE MUESTRA ---
const mockUser = {
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@elsazon.com',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop'
};

const navigationLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: ChartBarSquareIcon },
    { name: 'Mi Cuenta', href: '/account', icon: UserCircleIcon },
    { name: 'Configuración', href: '/restaurant-setup', icon: Cog6ToothIcon },
    { name: 'Ayuda', href: '/help-center', icon: QuestionMarkCircleIcon },
];

// --- SUBCOMPONENTES ---
const MobileSidebar = ({ isOpen, setIsOpen }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 flex lg:hidden"
            >
                <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-slate-800">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button onClick={() => setIsOpen(false)} className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                           <XMarkIcon className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto pt-5 pb-4">
                        <div className="flex flex-shrink-0 items-center px-4"><img className="h-8 w-auto" src="/logo-nextmanager.svg" alt="NextManager" /></div>
                        <nav className="mt-5 space-y-1 px-2">{navigationLinks.map(item => <SidebarLink key={item.name} item={item} />)}</nav>
                    </div>
                </motion.div>
                <div className="w-14 flex-shrink-0" aria-hidden="true" />
            </motion.div>
        )}
    </AnimatePresence>
);

const DesktopSidebar = () => (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                <div className="flex flex-shrink-0 items-center px-4"><img className="h-8 w-auto" src="/logo-nextmanager.svg" alt="NextManager" /></div>
                <nav className="mt-5 flex-1 space-y-1 px-2">{navigationLinks.map(item => <SidebarLink key={item.name} item={item} />)}</nav>
            </div>
        </div>
    </div>
);

const SidebarLink = ({ item }) => {
    const activeClass = 'bg-blue-600 text-white';
    const inactiveClass = 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700';
    return (
        <NavLink to={item.href} className={({ isActive }) => `${isActive ? activeClass : inactiveClass} group flex items-center rounded-md px-2 py-2 text-sm font-medium`}>
            <item.icon className={`mr-3 h-6 w-6 flex-shrink-0 ${!_isActive => _isActive ? 'text-white' : 'text-gray-400 dark:text-slate-500 group-hover:text-gray-500'}`} />
            {item.name}
        </NavLink>
    );
};

// --- COMPONENTE PRINCIPAL ---
function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { darkMode, toggleTheme } = useThemeContext();

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gray-100'}`}>
            <MobileSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <DesktopSidebar />
            <div className="flex flex-1 flex-col lg:pl-64">
                <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <button onClick={() => setSidebarOpen(true)} className="border-r border-gray-200 dark:border-slate-700 px-4 text-gray-500 lg:hidden"><Bars3Icon className="h-6 w-6" /></button>
                    <div className="flex flex-1 justify-between px-4">
                        <div className="flex flex-1">
                            {/* Espacio para un futuro buscador global */}
                        </div>
                        <div className="ml-4 flex items-center md:ml-6">
                            <button onClick={toggleTheme} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full">
                                {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
                            </button>
                            <button type="button" className="p-1 ml-3 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full"><BellIcon className="h-6 w-6" /></button>
                            {/* Menú de Perfil */}
                            <Link to="/account" className="ml-3 flex items-center">
                               <img className="h-8 w-8 rounded-full" src={mockUser.avatarUrl} alt="" />
                               <span className="hidden md:inline ml-2 text-sm font-medium text-gray-700 dark:text-slate-300">{mockUser.name}</span>
                            </Link>
                        </div>
                    </div>
                </header>
                <main className="flex-1">
                    {/* El contenido de cada página se renderizará aquí */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AppLayout;
