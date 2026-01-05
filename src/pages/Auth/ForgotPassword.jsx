import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../../context/ThemeContext'; // Ajusta ruta según tu estructura
import { Mail, ArrowLeft, CheckCircle2, Loader2, KeyRound } from 'lucide-react'; // Iconos modernos

/**
 * ForgotPasswordPage - Recuperación de cuenta
 * Diseño consistente con LoginPage para una experiencia de usuario fluida.
 */
function ForgotPasswordPage() {
    const { darkMode } = useThemeContext();
    
    // Estados
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // --- MANEJADOR DE ENVÍO ---
    const handleRequestReset = async (e) => {
        e.preventDefault();
        
        if (!email) return;

        setIsLoading(true);

        // Simulamos una llamada a la API (reemplazar con tu lógica real)
        setTimeout(() => {
            console.log('Solicitud enviada para:', email);
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            <div className="grid lg:grid-cols-2 min-h-screen">

                {/* --- Panel Izquierdo: Interacción --- */}
                <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-white dark:bg-gray-900 shadow-2xl lg:shadow-none z-10">
                    <motion.div 
                        className="w-full max-w-md"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {/* Header con Logo */}
                        <div className="text-center lg:text-left mb-8">
                            <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
                                <img src="/logo192.png" alt="NextManager" className="h-10 w-auto mx-auto lg:mx-0" />
                            </Link>
                        </div>
                        
                        {/* Contenido Dinámico (Formulario vs Éxito) */}
                        <AnimatePresence mode="wait">
                            {!isSubmitted ? (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="mb-8">
                                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                                            <KeyRound className="w-6 h-6" />
                                        </span>
                                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                            Recuperar Contraseña
                                        </h1>
                                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                                            No te preocupes. Ingresa tu correo y te enviaremos las instrucciones.
                                        </p>
                                    </div>

                                    <form onSubmit={handleRequestReset} className="space-y-6">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Correo Electrónico
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                                </div>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="ejemplo@restaurante.com"
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full flex justify-center items-center py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                                    Enviando...
                                                </>
                                            ) : (
                                                'Enviar Enlace de Recuperación'
                                            )}
                                        </button>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="text-center bg-green-50 dark:bg-green-900/20 p-8 rounded-2xl border border-green-100 dark:border-green-800"
                                >
                                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
                                        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        ¡Correo Enviado!
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                                        Hemos enviado las instrucciones de recuperación a <span className="font-semibold text-gray-900 dark:text-white">{email}</span>.
                                        <br/>Revisa tu bandeja de entrada (y spam).
                                    </p>
                                    
                                    <div className="space-y-3">
                                        <button 
                                            onClick={() => window.location.href = `mailto:${email}`}
                                            className="w-full py-3 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Abrir Correo
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Footer Link */}
                        <div className="mt-8 text-center">
                            <Link 
                                to="/login" 
                                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver al Inicio de Sesión
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* --- Panel Derecho: Branding --- */}
                <motion.div 
                    className="hidden lg:block relative overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1614064641938-3bcee5297404?q=80&w=2070&auto=format&fit=crop')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 via-gray-900/60 to-blue-900/30"></div>
                    
                    <div className="relative h-full flex flex-col justify-center p-16 max-w-2xl">
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
                                La seguridad es la base de la confianza.
                            </h2>
                            <p className="text-lg text-gray-300 border-l-4 border-blue-500 pl-6">
                                Protegemos tus datos y los de tus clientes con estándares de encriptación de nivel bancario.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}

export default ForgotPasswordPage;