// src/pages/ForgotPasswordPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext';
import { EnvelopeIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

/**
 * ForgotPasswordPage - El primer paso del flujo de recuperación.
 * * Estrategia de UX/UI:
 * 1.  Claridad y Enfoque: La página tiene un único propósito: solicitar un enlace de recuperación.
 * El diseño minimalista elimina todas las distracciones.
 * 2.  Feedback Inmediato y Claro: En lugar de un 'toast' que desaparece, la UI cambia a un estado
 * de "éxito" permanente después del envío. Esto confirma al usuario que la acción se completó
 * y le indica claramente cuál es el siguiente paso (revisar su email).
 * 3.  Consistencia de Marca: Mantiene el layout de dos paneles para una experiencia cohesiva.
 */
function ForgotPasswordPage() {
    const { darkMode } = useThemeContext();
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    // --- MANEJADOR SIMULADO ---
    const handleRequestReset = (e) => {
        e.preventDefault();
        if (!email) {
            alert('Por favor, ingresa tu correo electrónico.');
            return;
        }
        console.log('Simulando solicitud de restablecimiento para:', email);
        setIsSubmitted(true);
    };

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
            <div className="grid lg:grid-cols-2 min-h-screen">

                {/* --- Panel Izquierdo: Formulario / Mensaje de éxito --- */}
                <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                    <motion.div
                        className="w-full max-w-md"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <Link to="/" className="mb-8 inline-block">
                            <img src="/logo-nextmanager.svg" alt="NextManager Logo" className="h-10" />
                        </Link>
                        
                        <AnimatePresence mode="wait">
                            {!isSubmitted ? (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        ¿Olvidaste tu contraseña?
                                    </h1>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                                        No te preocupes. Ingresa tu correo y te enviaremos un enlace para recuperarla.
                                    </p>

                                    <form onSubmit={handleRequestReset} className="mt-8 space-y-6">
                                        <div className="relative">
                                            <EnvelopeIcon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                                            <input
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Tu correo electrónico registrado"
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                                        >
                                            Enviar Enlace de Recuperación
                                        </button>
                                    </form>
                                    <div className="mt-6 text-center">
                                        <Link to="/login" className="font-medium text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center gap-2">
                                            <ArrowLeftIcon className="w-4 h-4" />
                                            Volver a Iniciar Sesión
                                        </Link>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-center bg-green-50 dark:bg-green-900/20 p-8 rounded-lg"
                                >
                                    <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        ¡Revisa tu correo!
                                    </h1>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                                        Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Por favor, sigue las instrucciones en el correo para continuar.
                                    </p>
                                    <Link to="/login" className="mt-8 inline-block w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">
                                        Volver a Iniciar Sesión
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* --- Panel Derecho: Branding --- */}
                <div className="hidden lg:block relative">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554042312-42bad586f4a3?q=80&w=1974&auto=format&fit=crop')" }}
                    >
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-50"></div>
                    </div>
                     <div className="relative h-full flex flex-col justify-center p-12">
                        <h2 className="text-3xl font-bold text-white leading-tight">
                           Recupera el acceso. Vuelve a tomar el control.
                        </h2>
                        <p className="mt-4 text-lg text-gray-300">
                            La seguridad de tu cuenta es nuestra prioridad. Estamos aquí para ayudarte.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ForgotPasswordPage;
