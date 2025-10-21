import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
    SunIcon, MoonIcon, Bars3Icon, XMarkIcon, 
    UserCircleIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon,
    CreditCardIcon, QuestionMarkCircleIcon 
} from '@heroicons/react/24/solid';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

// --- HOOK PERSONALIZADO (para cerrar el menú al hacer clic fuera) ---
const useOutsideClick = (ref, callback) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, callback]);
};

// --- COMPONENTE AVATAR (para mostrar imagen o iniciales) ---
const Avatar = ({ user }) => {
    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        return names[0][0] + (names.length > 1 ? names[names.length - 1][0] : '');
    };

    return (
        <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-800 text-white flex items-center justify-center font-semibold overflow-hidden">
            {user.profile?.avatarUrl ? (
                <img src={user.profile.avatarUrl} alt={user.profile.name} className="w-full h-full object-cover" />
            ) : (
                getInitials(user.profile?.name)
            )}
        </div>
    );
};


export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // Nuevo estado para el dropdown

    const { darkMode, toggleTheme } = useThemeContext();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout, isLoading } = useAuth();

    // Refs para cerrar menús al hacer clic fuera
    const profileMenuRef = useRef(null);
    useOutsideClick(profileMenuRef, () => setIsProfileMenuOpen(false));

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    
    const handleLogout = async () => {
        await logout();
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
        if (isProfileMenuOpen) setIsProfileMenuOpen(false);
        navigate('/');
    };

    // Función para navegar y cerrar menús
    const handleNavigate = (path) => {
        navigate(path);
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
        if (isProfileMenuOpen) setIsProfileMenuOpen(false);
    };
    
    // --- LISTAS DE ENLACES PARA UN CÓDIGO MÁS LIMPIO ---
    
    // Enlaces para usuarios NO autenticados (Landing Page)
    const publicLinks = [
        { name: 'Inicio', to: 'hero' },
        { name: 'Características', to: 'features' },
        { name: 'Planes', to: '/plans', isRouter: true },
        { name: 'Contacto', to: '/contact', isRouter: true },
    ];

    // Enlaces para usuarios AUTENTICADOS (Dentro de la App)
    const privateLinks = [
        { name: 'Dashboard', to: '/dashboard' },
        { name: 'Configuración', to: '/restaurantconfig' },
        { name: 'Reportes', to: '/reports' },
    ];

    // Enlaces para el menú desplegable del perfil
    const profileMenuLinks = [
        { name: 'Mi Cuenta', to: '/settings', icon: Cog6ToothIcon },
        { name: 'Facturación', to: '/billing', icon: CreditCardIcon },
        { name: 'Centro de Ayuda', to: '/help-center', icon: QuestionMarkCircleIcon },
    ];

    // Evita el parpadeo de UI mientras se carga el estado de autenticación
    if (isLoading) {
        return <header className="sticky top-0 z-40 w-full h-16 bg-white dark:bg-gray-900"></header>;
    }

    return (
        <header className={`sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] ${
            darkMode ? 'bg-gray-900/75' : 'bg-white/75'
          } text-gray-900 dark:text-white`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    
                    {/* Logo (dinámico) */}
                    <RouterLink to={isAuthenticated ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center">
                        <img src="/logo-nextmanager.svg" alt="NextManager Logo" className="h-9" />
                    </RouterLink>

                    {/* Navegación Desktop */}
                    <nav className="hidden md:flex md:items-center md:space-x-1 lg:space-x-3">
                        {isAuthenticated 
                            ? privateLinks.map(link => (
                                <RouterLink key={link.name} to={link.to} className="block hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer px-3 py-2 rounded-md text-sm font-medium">
                                    {link.name}
                                </RouterLink>
                            ))
                            : publicLinks.map(link => (
                                link.isRouter ? (
                                    <RouterLink key={link.name} to={link.to} className="block hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer px-3 py-2 rounded-md text-sm font-medium">
                                        {link.name}
                                    </RouterLink>
                                ) : (
                                    <ScrollLink key={link.name} to={link.to} smooth={true} duration={500} offset={-80} className="block hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer px-3 py-2 rounded-md text-sm font-medium">
                                        {link.name}
                                    </ScrollLink>
                                )
                            ))
                        }
                    </nav>

                    {/* Acciones Derecha (Desktop) */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button onClick={toggleTheme} aria-label="Toggle Dark Mode" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            {darkMode ? <SunIcon className="h-6 w-6 text-yellow-400" /> : <MoonIcon className="h-6 w-6 text-gray-700" />}
                        </button>

                        <div className="hidden md:flex items-center">
                            {isAuthenticated ? (
                                // --- NUEVO: MENÚ DESPLEGABLE DE PERFIL ---
                                <div className="relative" ref={profileMenuRef}>
                                    <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        <span className="sr-only">Abrir menú de usuario</span>
                                        <Avatar user={user} />
                                    </button>
                                    <AnimatePresence>
                                        {isProfileMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                transition={{ duration: 0.1, ease: 'easeOut' }}
                                                className="absolute right-0 mt-2 w-64 origin-top-right bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                            >
                                                <div className="py-1">
                                                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.profile.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.profile.email}</p>
                                                    </div>
                                                    <div className="py-1">
                                                        {profileMenuLinks.map(link => (
                                                            <RouterLink
                                                                key={link.name}
                                                                to={link.to}
                                                                onClick={() => setIsProfileMenuOpen(false)}
                                                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            >
                                                                <link.icon className="w-5 h-5 mr-3" />
                                                                {link.name}
                                                            </RouterLink>
                                                        ))}
                                                    </div>
                                                    <div className="py-1 border-t border-gray-200 dark:border-gray-700">
                                                        <button
                                                            onClick={handleLogout}
                                                            className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        >
                                                            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                                                            Cerrar Sesión
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="space-x-2">
                                    <button onClick={() => handleNavigate('/login')} className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Iniciar Sesión</button>
                                    <button onClick={() => handleNavigate('/register')} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Registrarse</button>
                                </div>
                            )}
                        </div>

                        {/* Botón Menú Móvil */}
                        <div className="md:hidden">
                            <button onClick={toggleMobileMenu} aria-controls="mobile-menu" aria-expanded={isMobileMenuOpen} className="p-2 rounded-md">
                                <span className="sr-only">Abrir menú principal</span>
                                {isMobileMenuOpen ? <XMarkIcon className="block h-6 w-6" /> : <Bars3Icon className="block h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Panel Menú Móvil (Animado) */}
            <motion.div
                id="mobile-menu"
                initial={false}
                animate={isMobileMenuOpen ? "open" : "closed"}
                variants={{
                    open: { opacity: 1, height: "auto" },
                    closed: { opacity: 0, height: 0 }
                }}
                style={{ overflow: 'hidden' }}
                className="md:hidden border-t border-gray-200 dark:border-gray-700"
            >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {isAuthenticated 
                        ? privateLinks.map(link => (
                            <RouterLink key={link.name} to={link.to} onClick={toggleMobileMenu} className="block hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer px-3 py-2 rounded-md text-base font-medium">
                                {link.name}
                            </RouterLink>
                        ))
                        : publicLinks.map(link => (
                            link.isRouter ? (
                                <RouterLink key={link.name} to={link.to} onClick={toggleMobileMenu} className="block hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer px-3 py-2 rounded-md text-base font-medium">
                                    {link.name}
                                </RouterLink>
                            ) : (
                                <ScrollLink key={link.name} to={link.to} smooth={true} duration={500} offset={-80} onClick={toggleMobileMenu} className="block hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer px-3 py-2 rounded-md text-base font-medium">
                                    {link.name}
                                </ScrollLink>
                            )
                        ))
                    }
                </div>
                
                {/* Opciones de Usuario Móvil */}
                <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                    {isAuthenticated ? (
                        <div className="px-2 space-y-3">
                            <div className="flex items-center px-3">
                                <Avatar user={user} />
                                <div className="ml-3">
                                    <p className="text-base font-medium text-gray-900 dark:text-white truncate">{user.profile.name}</p>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{user.profile.email}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                {profileMenuLinks.map(link => (
                                     <RouterLink
                                        key={link.name}
                                        to={link.to}
                                        onClick={toggleMobileMenu}
                                        className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <link.icon className="w-5 h-5 mr-3" />
                                        {link.name}
                                    </RouterLink>
                                ))}
                                <button onClick={handleLogout} className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="px-2 space-y-2">
                            <button onClick={() => handleNavigate('/login')} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800">Iniciar Sesión</button>
                            <button onClick={() => handleNavigate('/register')} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800">Registrarse</button>
                        </div>
                    )}
                </div>
            </motion.div>
        </header>
    );
}