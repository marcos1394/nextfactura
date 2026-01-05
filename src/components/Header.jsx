import React, { useState, useEffect, useRef } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONOS MODERNOS (Lucide React) ---
import { 
    Sun, Moon, Menu, X, 
    LogOut, Settings, CreditCard, 
    HelpCircle, User, LayoutDashboard, 
    ChevronDown, Store 
} from 'lucide-react';

// --- HOOK: Click Outside (Interno para simplicidad) ---
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

// --- COMPONENTE: Avatar ---
const Avatar = ({ user }) => {
    // Protección contra datos nulos
    const name = user?.name || user?.profile?.name || 'Usuario';
    const avatarUrl = user?.avatarUrl || user?.profile?.avatarUrl;

    const getInitials = (n) => {
        const names = n.split(' ');
        return names[0][0] + (names.length > 1 ? names[names.length - 1][0] : '');
    };

    return (
        <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white dark:ring-gray-800 overflow-hidden">
            {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
                <span>{getInitials(name)}</span>
            )}
        </div>
    );
};

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const { darkMode, toggleTheme } = useThemeContext();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, logout, isLoading } = useAuth();

    const profileMenuRef = useRef(null);
    useOutsideClick(profileMenuRef, () => setIsProfileMenuOpen(false));

    // Efecto de Scroll para cambiar la apariencia del header
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    
    const handleLogout = async () => {
        await logout();
        setIsMobileMenuOpen(false);
        setIsProfileMenuOpen(false);
        navigate('/');
    };

    const handleNavigate = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
        setIsProfileMenuOpen(false);
    };

    // --- CONFIGURACIÓN DE NAVEGACIÓN ---
    
    // Enlaces Públicos (Landing Page)
    const publicLinks = [
        { name: 'Inicio', to: 'hero', type: 'scroll' },
        { name: 'Beneficios', to: 'features', type: 'scroll' },
        { name: 'Planes', to: '/plans', type: 'router' },
        { name: 'Contacto', to: '/contact', type: 'router' },
    ];

    // Enlaces Privados (App)
    const privateLinks = [
        { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
        { name: 'Restaurante', to: '/restaurant-config', icon: Store },
    ];

    // Menú Desplegable
    const profileMenuLinks = [
        { name: 'Mi Perfil', to: '/my-account', icon: User },
        { name: 'Planes y Pagos', to: '/plans', icon: CreditCard },
        { name: 'Configuración', to: '/settings', icon: Settings },
        { name: 'Ayuda', to: '/help-center', icon: HelpCircle },
    ];

    // Renderizado condicional del Link (Scroll vs Router)
    const renderPublicLink = (link) => {
        const isHomePage = location.pathname === '/';
        
        // Si es tipo 'scroll' pero NO estamos en home, forzamos redirección a Home
        if (link.type === 'scroll' && !isHomePage) {
             return (
                <RouterLink 
                    key={link.name} 
                    to={`/#${link.to}`} 
                    className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    {link.name}
                </RouterLink>
            );
        }

        if (link.type === 'scroll') {
            return (
                <ScrollLink 
                    key={link.name} 
                    to={link.to} 
                    smooth={true} 
                    duration={500} 
                    offset={-80} 
                    className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    {link.name}
                </ScrollLink>
            );
        }

        return (
            <RouterLink 
                key={link.name} 
                to={link.to} 
                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
                {link.name}
            </RouterLink>
        );
    };

    if (isLoading) return <header className="h-16 w-full bg-white dark:bg-gray-900" />;

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled 
                    ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-700/50' 
                    : 'bg-transparent'
            }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    {/* LOGO */}
                    <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}>
                        <img src="/logonextfactura.png" alt="NextManager" className="h-8 w-auto" />
                        <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white hidden sm:block">
                            NextManager
                        </span>
                    </div>

                    {/* DESKTOP NAV */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {isAuthenticated 
                            ? privateLinks.map(link => (
                                <RouterLink 
                                    key={link.name} 
                                    to={link.to} 
                                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                                        location.pathname === link.to 
                                            ? 'text-blue-600 dark:text-blue-400' 
                                            : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                                    }`}
                                >
                                    {link.icon && <link.icon className="w-4 h-4" />}
                                    {link.name}
                                </RouterLink>
                            ))
                            : publicLinks.map(link => renderPublicLink(link))
                        }
                    </nav>

                    {/* RIGHT ACTIONS */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <button 
                            onClick={toggleTheme} 
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Cambiar tema"
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* User Menu / Login Buttons */}
                        <div className="hidden md:block">
                            {isAuthenticated ? (
                                <div className="relative" ref={profileMenuRef}>
                                    <button 
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} 
                                        className="flex items-center gap-2 focus:outline-none group"
                                    >
                                        <Avatar user={user} />
                                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Desktop */}
                                    <AnimatePresence>
                                        {isProfileMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden"
                                            >
                                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                        {user?.name || user?.profile?.name || 'Usuario'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        {user?.email || user?.profile?.email}
                                                    </p>
                                                </div>
                                                <div className="py-1">
                                                    {profileMenuLinks.map(link => (
                                                        <button
                                                            key={link.name}
                                                            onClick={() => handleNavigate(link.to)}
                                                            className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                        >
                                                            <link.icon className="w-4 h-4 mr-3 text-gray-400" />
                                                            {link.name}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="py-1 border-t border-gray-100 dark:border-gray-700">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                                    >
                                                        <LogOut className="w-4 h-4 mr-3" />
                                                        Cerrar Sesión
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                        Entrar
                                    </button>
                                    <button onClick={() => navigate('/register')} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">
                                        Crear Cuenta
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button 
                                onClick={toggleMobileMenu} 
                                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-1">
                            {/* Mobile Links */}
                            {isAuthenticated 
                                ? privateLinks.map(link => (
                                    <button
                                        key={link.name}
                                        onClick={() => handleNavigate(link.to)}
                                        className="flex items-center w-full px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        {link.icon && <link.icon className="w-5 h-5 mr-3 text-gray-400" />}
                                        {link.name}
                                    </button>
                                ))
                                : publicLinks.map(link => (
                                    <button
                                        key={link.name}
                                        onClick={() => {
                                            if (link.type === 'router') handleNavigate(link.to);
                                            else {
                                                // Manejo simple para scroll en móvil
                                                navigate('/'); 
                                                setTimeout(() => {
                                                    const el = document.getElementById(link.to);
                                                    if(el) el.scrollIntoView({ behavior: 'smooth' });
                                                }, 100);
                                                setIsMobileMenuOpen(false);
                                            }
                                        }}
                                        className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        {link.name}
                                    </button>
                                ))
                            }

                            {/* Mobile User Actions */}
                            {isAuthenticated ? (
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center px-3 mb-4">
                                        <Avatar user={user} />
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'Usuario'}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                                        </div>
                                    </div>
                                    {profileMenuLinks.map(link => (
                                        <button
                                            key={link.name}
                                            onClick={() => handleNavigate(link.to)}
                                            className="flex items-center w-full px-3 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                        >
                                            <link.icon className="w-5 h-5 mr-3" />
                                            {link.name}
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-3 py-3 mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg"
                                    >
                                        <LogOut className="w-5 h-5 mr-3" />
                                        Cerrar Sesión
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-3">
                                    <button onClick={() => handleNavigate('/login')} className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-xl">
                                        Entrar
                                    </button>
                                    <button onClick={() => handleNavigate('/register')} className="px-4 py-3 text-center text-sm font-medium text-white bg-blue-600 rounded-xl">
                                        Crear Cuenta
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}