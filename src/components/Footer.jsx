import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';
import { 
    Facebook, 
    Twitter, 
    Linkedin, 
    Instagram, 
    Mail, 
    ArrowRight, 
    MapPin, 
    Phone 
} from 'lucide-react';

// --- SUBCOMPONENTES ---

const FooterTitle = ({ children }) => (
    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
        {children}
    </h3>
);

const FooterLink = ({ to, children }) => (
    <li>
        <Link 
            to={to} 
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 flex items-center group"
        >
            <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-200 opacity-0 group-hover:opacity-100 mr-0 group-hover:mr-1">
                •
            </span>
            {children}
        </Link>
    </li>
);

const SocialLink = ({ href, icon: Icon, label }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label={label}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-300"
    >
        <Icon className="w-5 h-5" />
    </a>
);

export default function Footer() {
    const { darkMode } = useThemeContext();
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                
                {/* --- SECCIÓN SUPERIOR --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
                    
                    {/* Columna 1: Branding y Newsletter (Ocupa 4 columnas en desktop) */}
                    <div className="col-span-1 lg:col-span-4 space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/logonextfactura.png" alt="NextManager" className="h-8 w-auto" />
                            <span className="text-xl font-bold text-gray-900 dark:text-white">NextManager</span>
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
                            La plataforma integral para la gestión inteligente de restaurantes. Facturación, inventarios y reportes en un solo lugar.
                        </p>
                        
                        {/* Newsletter Widget */}
                        <div className="pt-2">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Suscríbete a novedades</h4>
                            <div className="flex gap-2">
                                <input 
                                    type="email" 
                                    placeholder="Tu correo electrónico" 
                                    className="flex-1 min-w-0 px-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                                />
                                <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Columna 2: Producto */}
                    <div className="col-span-1 lg:col-span-2 lg:col-start-6">
                        <FooterTitle>Producto</FooterTitle>
                        <ul className="space-y-3">
                            {isAuthenticated ? (
                                <>
                                    <FooterLink to="/dashboard">Dashboard</FooterLink>
                                    <FooterLink to="/restaurant-config">Configuración</FooterLink>
                                    <FooterLink to="/reports">Reportes</FooterLink>
                                    <li>
                                        <button 
                                            onClick={handleLogout} 
                                            className="text-sm text-red-500 hover:text-red-600 transition-colors text-left flex items-center"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <FooterLink to="/#features">Características</FooterLink>
                                    <FooterLink to="/plans">Precios y Planes</FooterLink>
                                    <FooterLink to="/login">Iniciar Sesión</FooterLink>
                                    <FooterLink to="/register">Crear Cuenta</FooterLink>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Columna 3: Compañía */}
                    <div className="col-span-1 lg:col-span-2">
                        <FooterTitle>Compañía</FooterTitle>
                        <ul className="space-y-3">
                            <FooterLink to="/about">Sobre Nosotros</FooterLink>
                            <FooterLink to="/careers">Trabaja con nosotros</FooterLink>
                            <FooterLink to="/blog">Blog</FooterLink>
                            <FooterLink to="/contact">Contacto</FooterLink>
                        </ul>
                    </div>

                    {/* Columna 4: Legal y Ayuda */}
                    <div className="col-span-1 lg:col-span-2">
                        <FooterTitle>Soporte</FooterTitle>
                        <ul className="space-y-3">
                            <FooterLink to="/help-center">Centro de Ayuda</FooterLink>
                            <FooterLink to="/terms">Términos de Uso</FooterLink>
                            <FooterLink to="/privacy">Privacidad</FooterLink>
                            <FooterLink to="/cookies">Cookies</FooterLink>
                        </ul>
                    </div>
                </div>

                {/* --- SECCIÓN INFERIOR: Contacto y Copyright --- */}
                <div className="pt-8 border-t border-gray-200 dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    
                    {/* Info de contacto rápida */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>soporte@nextmanager.mx</span>
                        </div>
                        {/* Puedes descomentar esto si tienes teléfono
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>+52 (55) 1234-5678</span>
                        </div>
                        */}
                    </div>

                    {/* Redes Sociales */}
                    <div className="flex gap-4 md:justify-end">
                        <SocialLink href="https://facebook.com" icon={Facebook} label="Facebook" />
                        <SocialLink href="https://twitter.com" icon={Twitter} label="Twitter" />
                        <SocialLink href="https://instagram.com" icon={Instagram} label="Instagram" />
                        <SocialLink href="https://linkedin.com" icon={Linkedin} label="LinkedIn" />
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
                    &copy; {currentYear} NextManager S.A. de C.V. Todos los derechos reservados. Hecho con ❤️ en México.
                </div>
            </div>
        </footer>
    );
}