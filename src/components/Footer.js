import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Para saber si el usuario está logueado
import { useThemeContext } from '../context/ThemeContext'; // Para el modo oscuro

// Componente pequeño para los títulos de sección
const FooterTitle = ({ children }) => (
    <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
        {children}
    </h3>
);

// Componente pequeño para los enlaces
const FooterLink = ({ to, children }) => (
    <li>
        <Link to={to} className="text-base text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors">
            {children}
        </Link>
    </li>
);

export default function Footer() {
    const { darkMode } = useThemeContext();
    const { isAuthenticated, logout } = useAuth(); // Obtenemos el estado de autenticación y la función de logout
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirigimos al inicio después de cerrar sesión
    };

    return (
        <footer id="contact" className={`bg-gray-800 dark:bg-gray-900 text-gray-300 dark:text-gray-400 ${darkMode ? 'dark' : ''}`}>
            <div className="container mx-auto max-w-7xl px-6 py-16">
                
                {/* --- SECCIÓN SUPERIOR CON ENLACES --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    
                    {/* Columna 1: Logo y Marca */}
                    <div className="col-span-2 lg:col-span-2 pr-8">
                        <Link to="/" className="inline-block mb-4">
                            <img src="/logo-nextmanager-white.svg" alt="NextManager Logo" className="h-10" />
                        </Link>
                        <p className="text-sm text-gray-400 max-w-xs">
                            Simplificando la administración y facturación de tu restaurante.
                        </p>
                    </div>

                    {/* Columna 2: Producto (Enlaces Dinámicos) */}
                    <div>
                        <FooterTitle>Producto</FooterTitle>
                        <ul className="mt-4 space-y-3">
                            {isAuthenticated ? (
                                <>
                                    <FooterLink to="/dashboard">Dashboard</FooterLink>
                                    <FooterLink to="/restaurant-config">Mi Restaurante</FooterLink>
                                    <FooterLink to="/reports">Reportes</FooterLink>
                                    <li>
                                        <button 
                                            onClick={handleLogout} 
                                            className="text-base text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors text-left"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <FooterLink to="/#features">Funcionalidades</FooterLink>
                                    <FooterLink to="/plans">Precios</FooterLink>
                                    <FooterLink to="/login">Iniciar Sesión</FooterLink>
                                    <FooterLink to="/register">Crear Cuenta</FooterLink>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Columna 3: Compañía */}
                    <div>
                        <FooterTitle>Compañía</FooterTitle>
                        <ul className="mt-4 space-y-3">
                            <FooterLink to="/about">Sobre Nosotros</FooterLink>
                            <FooterLink to="/contact">Contacto</FooterLink>
                            <FooterLink to="/help-center">Centro de Ayuda</FooterLink>
                        </ul>
                    </div>

                    {/* Columna 4: Legal */}
                    <div>
                        <FooterTitle>Legal</FooterTitle>
                        <ul className="mt-4 space-y-3">
                            <FooterLink to="/terms">Términos y Condiciones</FooterLink>
                            <FooterLink to="/privacy">Política de Privacidad</FooterLink>
                        </ul>
                    </div>
                </div>

                {/* --- SECCIÓN INFERIOR CON COPYRIGHT Y REDES --- */}
                <div className="mt-16 pt-8 border-t border-gray-700 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-center md:text-left">
                        &copy; {currentYear} NextManager. Todos los derechos reservados.
                    </p>
                    {/* Reemplaza con tus enlaces reales de redes sociales */}
                    <div className="flex space-x-5 mt-4 md:mt-0">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                            <span className="sr-only">Facebook</span>
                            {/* Aquí puedes poner tu SVG de Facebook */}
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                            <span className="sr-only">Twitter</span>
                            {/* SVG de Twitter */}
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                            <span className="sr-only">LinkedIn</span>
                            {/* SVG de LinkedIn */}
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}