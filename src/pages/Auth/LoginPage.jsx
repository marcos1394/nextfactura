import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../../context/ThemeContext'; // Ajusta la ruta si es necesario
import { useAuth } from '../../hooks/useAuth'; 
import { toast } from 'react-toastify';

// --- ICONOS MODERNOS (Lucide React) ---
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

// Componente para el botón de Google (Optimizado)
const GoogleLoginButton = ({ onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 group"
    >
        <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 9.81C34.553 5.822 29.423 3.5 24 3.5C11.75 3.5 1.5 13.75 1.5 26S11.75 48.5 24 48.5c12.25 0 22.5-10.25 22.5-22.5 0-1.575-.15-3.09-.426-4.564z" />
            <path fill="#FF3D00" d="M6.306 14.691c-2.227 4.543-3.414 9.71-3.414 15.309C2.892 35.29 4.078 40.457 6.306 45.001l7.618-5.81c-1.203-3.204-1.83-6.723-1.83-10.191s.627-6.987 1.83-10.191l-7.618-5.81z" />
            <path fill="#123a13ff" d="M24 48.5c5.423 0 10.553-1.822 14.804-5.19L31.196 37.5C29.146 39.047 26.716 40 24 40c-4.473 0-8.527-2.31-10.898-5.81l-7.618 5.81C10.553 44.678 16.577 48.5 24 48.5z" />
            <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.16-4.065 5.571l7.618 5.81C43.02 35.845 45.457 30.01 45.457 26c0-3.344-.789-6.517-2.214-9.309l-7.618 5.81c.54.99.827 2.08.827 3.243z" />
        </svg>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Continuar con Google</span>
    </button>
);

function LoginPage() {
    const { darkMode } = useThemeContext();
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Estados
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // <-- NUEVO: Toggle Password
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const from = location.state?.from?.pathname || '/dashboard';

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.warn('Por favor, completa todos los campos.');
            return;
        }
        
        setError(null);
        setIsLoading(true);

        try {
            await login(email, password);
            toast.success('¡Bienvenido de nuevo!');
            navigate(from, { replace: true });
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Credenciales inválidas. Verifica tu correo y contraseña.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = '/api/auth/google'; 
    };

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            <div className="grid lg:grid-cols-2 min-h-screen">
                
                {/* --- Panel Izquierdo: Formulario --- */}
                <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-white dark:bg-gray-900 shadow-2xl lg:shadow-none z-10">
                    <motion.div 
                        className="w-full max-w-md space-y-8"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {/* Header del Formulario */}
                        <div className="text-center lg:text-left">
                            <Link to="/" className="inline-block mb-6 hover:opacity-80 transition-opacity">
                                {/* Asegúrate de que este archivo exista en /public o cambia a texto */}
                                <img src="/logonextfactura.png" alt="NextManager" className="h-12 w-auto mx-auto lg:mx-0" />
                            </Link>
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                Bienvenido de Nuevo
                            </h1>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">
                                Gestiona tu restaurante con inteligencia.
                            </p>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={handleLogin} className="mt-8 space-y-6">
                            <div className="space-y-5">
                                {/* Input Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Correo Electrónico
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="admin@restaurante.com"
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Input Password con Toggle */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Contraseña
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer transition-colors focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Opciones Extra */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                                        Recuérdame
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                            </div>

                            {/* Botón Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                        Iniciando...
                                    </>
                                ) : (
                                    <>
                                        Iniciar Sesión
                                        <ArrowRight className="ml-2 h-5 w-5 opacity-70" />
                                    </>
                                )}
                            </button>
                        </form>
                        
                        {/* Mensaje de Error Animado */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-r-lg text-sm flex items-center"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <span className="font-medium mr-1">Error:</span> {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">O continúa con</span>
                            </div>
                        </div>

                        <GoogleLoginButton onClick={handleGoogleLogin} />

                        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                            ¿Aún no tienes cuenta?{' '}
                            <Link to="/register" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
                                Regístrate gratis
                            </Link>
                        </p>
                    </motion.div>
                </div>
                
                {/* --- Panel Derecho: Imagen Branding (Estilo Profesional) --- */}
                <motion.div 
                    className="hidden lg:block relative overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-105"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-90"></div>
                    
                    <div className="relative h-full flex flex-col justify-end p-16 text-white max-w-2xl">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h2 className="text-4xl font-extrabold mb-6 leading-tight">
                                "La herramienta definitiva para la gestión gastronómica moderna."
                            </h2>
                            <div className="flex items-center space-x-4">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <img key={i} className="w-10 h-10 rounded-full border-2 border-gray-900" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                    ))}
                                </div>
                                <div className="text-sm font-medium text-gray-300">
                                    <span className="text-white font-bold block">1,200+ Restaurantes</span>
                                    confían en NextManager
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}

export default LoginPage;