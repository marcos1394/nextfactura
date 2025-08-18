// src/pages/LoginPage.js

import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth'; // <-- NUEVO: Importamos nuestro hook de autenticación
import { toast } from 'react-toastify'; // <-- NUEVO: Para notificaciones

import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/solid';

// Componente para el botón de Google
const GoogleLoginButton = ({ onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
    >
        <svg className="w-6 h-6" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 9.81C34.553 5.822 29.423 3.5 24 3.5C11.75 3.5 1.5 13.75 1.5 26S11.75 48.5 24 48.5c12.25 0 22.5-10.25 22.5-22.5 0-1.575-.15-3.09-.426-4.564z" />
            <path fill="#FF3D00" d="M6.306 14.691c-2.227 4.543-3.414 9.71-3.414 15.309C2.892 35.29 4.078 40.457 6.306 45.001l7.618-5.81c-1.203-3.204-1.83-6.723-1.83-10.191s.627-6.987 1.83-10.191l-7.618-5.81z" />
            <path fill="#4CAF50" d="M24 48.5c5.423 0 10.553-1.822 14.804-5.19L31.196 37.5C29.146 39.047 26.716 40 24 40c-4.473 0-8.527-2.31-10.898-5.81l-7.618 5.81C10.553 44.678 16.577 48.5 24 48.5z" />
            <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.16-4.065 5.571l7.618 5.81C43.02 35.845 45.457 30.01 45.457 26c0-3.344-.789-6.517-2.214-9.309l-7.618 5.81c.54.99.827 2.08.827 3.243z" />
        </svg>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Continuar con Google</span>
    </button>
);

function LoginPage() {
    const { darkMode } = useThemeContext();
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth(); // <-- NUEVO: Obtenemos la función de login de nuestro contexto

    // --- NUEVOS ESTADOS para manejar la interacción con la API ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Determina a dónde redirigir al usuario después de un login exitoso
    const from = location.state?.from?.pathname || '/dashboard';

    // --- MANEJADOR DE LOGIN REAL ---
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.warn('Por favor, completa todos los campos.');
            return;
        }
        
        setError(null);
        setIsLoading(true);

        try {
            // Llamamos a la función login de nuestro AuthContext
            await login(email, password);
            toast.success('¡Bienvenido de nuevo!');
            navigate(from, { replace: true }); // Redirigimos a la página original o al dashboard

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Credenciales inválidas o error de conexión.';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Error en el login:', err);

        } finally {
            setIsLoading(false);
        }
    };

    // --- MANEJADOR DE LOGIN CON GOOGLE REAL ---
    const handleGoogleLogin = () => {
        // Esta es la URL de tu backend que inicia el flujo de OAuth con Google
        window.location.href = '/api/auth/google'; 
    };

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
            <div className="grid lg:grid-cols-2 min-h-screen">
                
                {/* --- Panel Izquierdo: Formulario --- */}
                <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                    <motion.div 
                        className="w-full max-w-md"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <Link to="/" className="mb-8 inline-block">
                            <img src="/logo-nextmanager.svg" alt="NextManager Logo" className="h-10" />
                        </Link>

                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Bienvenido de Nuevo
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Ingresa tus credenciales para acceder a tu centro de comando.
                        </p>

                        <form onSubmit={handleLogin} className="mt-8 space-y-6">
                            <div className="relative">
                                <EnvelopeIcon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="correo@ejemplo.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <LockClosedIcon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Contraseña"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    required
                                />
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded" />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Recuérdame</label>
                                </div>
                                <div className="text-sm">
                                    <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                            </div>

                            {/* --- Botón de Login dinámico --- */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                            </button>
                        </form>
                        
                        {/* --- Div para mostrar el mensaje de error --- */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-6 relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">O</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <GoogleLoginButton onClick={handleGoogleLogin} />
                        </div>

                        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                            ¿No tienes una cuenta?{' '}
                            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                Regístrate ahora
                            </Link>
                        </p>
                    </motion.div>
                </div>
                
                {/* --- Panel Derecho: Branding --- */}
                <motion.div 
                    className="hidden lg:block relative"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                >
                    <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop')" }}
                    >
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>
                    </div>
                    <div className="relative h-full flex flex-col justify-end p-12">
                        <h2 className="text-3xl font-bold text-white leading-tight">
                           "NextManager transformó nuestra operación. Ahora tenemos más tiempo para nuestros clientes."
                        </h2>
                        <p className="mt-4 text-lg text-gray-300">
                            - Carlos Mendoza, Dueño de Restaurante
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default LoginPage;