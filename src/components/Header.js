// src/components/Header.js

import React, { useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth'; // <-- 1. IMPORTAMOS NUESTRO HOOK
import { motion } from 'framer-motion';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { darkMode, toggleTheme } = useThemeContext();
    const navigate = useNavigate();

    // --- 2. USAMOS NUESTRO AuthContext COMO ÚNICA FUENTE DE VERDAD ---
    const { isAuthenticated, user, logout, isLoading } = useAuth();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleAuthRedirect = (path) => {
        navigate(path);
        if (isMenuOpen) toggleMenu();
    };
    
    // --- 3. ACTUALIZAMOS LA FUNCIÓN DE CERRAR SESIÓN ---
    const handleSignOut = async () => {
        await logout(); // Llama a la función de logout de nuestro contexto
        if (isMenuOpen) toggleMenu();
        navigate('/'); // Redirige a la página de inicio
    };

    // --- RENDERIZADO PRINCIPAL ---
    
    // Mostramos un header vacío mientras se verifica la sesión para evitar parpadeos
    if (isLoading) {
        return <header className="sticky top-0 z-40 w-full h-16 bg-white dark:bg-gray-900"></header>;
    }

    // Menús (los mantenemos separados por claridad)
    const publicLinks = (
        <>
            <ScrollLink to="hero" smooth={true} duration={500} offset={-80} onClick={isMenuOpen ? toggleMenu : undefined} className="block hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer px-3 py-2 rounded-md text-base font-medium">
                Inicio
            </ScrollLink>
            {/* ... otros enlaces públicos ... */}
        </>
    );

    const privateLinks = (
        <>
            <RouterLink to="/dashboard" onClick={isMenuOpen ? toggleMenu : undefined} className="block hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer px-3 py-2 rounded-md text-base font-medium">
                Dashboard
            </RouterLink>
            <RouterLink to="/restaurantconfig" onClick={isMenuOpen ? toggleMenu : undefined} className="block hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer px-3 py-2 rounded-md text-base font-medium">
                Configuración
            </RouterLink>
        </>
    );

    return (
        <header className={`sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] ${
            darkMode ? 'bg-gray-900/75' : 'bg-white/75'
          } text-gray-900 dark:text-white`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    {/* Logo */}
                    <RouterLink to={isAuthenticated ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center">
                        <span className="text-2xl font-bold tracking-tight">NextManager</span>
                    </RouterLink>

                    {/* Navegación Desktop */}
                    <nav className="hidden md:flex md:items-center md:space-x-1 lg:space-x-3">
                        {/* --- 4. USAMOS isAuthenticated PARA LA LÓGICA --- */}
                        {isAuthenticated ? privateLinks : publicLinks}
                    </nav>

                    {/* Acciones Derecha */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button onClick={toggleTheme} aria-label="Toggle Dark Mode" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            {darkMode ? <SunIcon className="h-6 w-6 text-yellow-400" /> : <MoonIcon className="h-6 w-6 text-gray-700" />}
                        </button>

                        {/* Botones de Usuario / Login (Desktop) */}
                        <div className="hidden md:flex items-center">
                            {isAuthenticated ? (
                                <>
                                    {/* --- 5. USAMOS el objeto 'user' del contexto --- */}
                                    <span className="text-sm mr-4 hidden lg:inline">Hola, {user?.name || user?.email || 'Usuario'}</span>
                                    <button onClick={handleSignOut} className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                                        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <div className="space-x-2">
                                    <button onClick={() => handleAuthRedirect('/login')} className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Iniciar Sesión</button>
                                    <button onClick={() => handleAuthRedirect('/register')} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Registrarse</button>
                                </div>
                            )}
                        </div>

                        {/* Botón Menú Móvil */}
                        <div className="md:hidden">
                            <button onClick={toggleMenu} aria-controls="mobile-menu" aria-expanded={isMenuOpen} className="p-2 rounded-md">
                                <span className="sr-only">Abrir menú principal</span>
                                {isMenuOpen ? <XMarkIcon className="block h-6 w-6" /> : <Bars3Icon className="block h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Panel Menú Móvil (Animado) */}
            <motion.div
                id="mobile-menu"
                initial={false}
                animate={isMenuOpen ? "open" : "closed"}
                variants={{
                    open: { opacity: 1, height: "auto" },
                    closed: { opacity: 0, height: 0 }
                }}
                style={{ overflow: 'hidden' }}
                className="md:hidden"
            >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {isAuthenticated ? privateLinks : publicLinks}
                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                        {isAuthenticated ? (
                            <div className="px-2 space-y-3">
                                <div className="flex items-center px-1">
                                    <UserCircleIcon className="h-8 w-8 mr-2 text-gray-500"/>
                                    <span className="text-base font-medium">{user?.name || user?.email || 'Usuario'}</span>
                                </div>
                                <button onClick={handleSignOut} className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                                    Cerrar Sesión
                                </button>
                            </div>
                        ) : (
                            <div className="px-2 space-y-2">
                                <button onClick={() => handleAuthRedirect('/login')} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800">Iniciar Sesión</button>
                                <button onClick={() => handleAuthRedirect('/register')} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800">Registrarse</button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </header>
    );
}