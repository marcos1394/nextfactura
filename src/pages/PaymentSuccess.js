// src/pages/PaymentSuccessPage.js
import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext';
import { CheckBadgeIcon, RocketLaunchIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

/**
 * PaymentSuccessPage - Refinada para máximo impacto y claridad post-compra.
 * * Estrategia de UX/UI:
 * 1.  Enfoque Absoluto en el Éxito: Se elimina el ruido (secciones de soporte, FAQ) para centrar toda
 * la atención en el mensaje de éxito. La celebración del logro del usuario es el único objetivo.
 * 2.  Acción Singular y Prioritaria: En lugar de múltiples opciones, se presenta un único y claro
 * Call-To-Action ("Comenzar Configuración"). Esto elimina la parálisis por análisis y guía al
 * usuario hacia el siguiente paso más lógico y productivo.
 * 3.  Control del Usuario: Se elimina la redirección automática. El usuario decide cuándo avanzar,
 * creando una experiencia menos apresurada y más respetuosa.
 * 4.  Diseño Inmersivo y de Refuerzo: El layout de dos paneles se utiliza para separar la confirmación
 * de la bienvenida. El panel derecho refuerza el valor de la decisión tomada, construyendo una
 * conexión emocional y combatiendo cualquier posible remordimiento de comprador.
 */
function PaymentSuccessPage() {
    const { darkMode } = useThemeContext();
    const navigate = useNavigate();
    const location = useLocation();

    // Obtenemos los datos del plan desde el estado de la navegación, con un fallback para diseño.
    const { planName = 'Plan Pro Anual' } = location.state || {};
    
    // --- Lógica de la UI simplificada. Sin redirecciones automáticas ---

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-slate-900' : 'bg-white'}`}>
            <div className="grid lg:grid-cols-2 min-h-screen">
                
                {/* --- Panel Izquierdo: Confirmación y Acción --- */}
                <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                    <motion.div
                        className="w-full max-w-md text-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                        >
                            <CheckBadgeIcon className="w-28 h-28 text-green-500 mx-auto mb-6" />
                        </motion.div>
                        
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                            ¡Bienvenido a NextManager!
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                            Felicidades. Tu <strong className="text-gray-800 dark:text-white">{planName}</strong> ha sido activado.
                            Estás listo para llevar tu negocio al siguiente nivel.
                        </p>

                        <div className="mt-10">
                            <button
                                onClick={() => navigate('/restaurant-config')}
                                className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <RocketLaunchIcon className="w-6 h-6" />
                                Comenzar Configuración
                            </button>
                        </div>

                        <div className="mt-6 text-sm">
                            <Link to="/dashboard" className="text-gray-500 dark:text-gray-400 hover:underline">
                                O saltar e ir a mi dashboard
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* --- Panel Derecho: Mensaje de Bienvenida y Valor --- */}
                <div className="hidden lg:block relative bg-slate-800">
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-10"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600880292210-f75bb6fe84f2?q=80&w=1974&auto=format&fit=crop')" }}
                    ></div>
                    <div className="relative h-full flex flex-col justify-center p-12 text-white">
                        <div className="w-full max-w-md">
                             <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                            >
                                <h2 className="text-4xl font-bold leading-tight">
                                   Tu viaje hacia la eficiencia empieza ahora.
                                </h2>
                                <p className="mt-4 text-xl text-slate-300">
                                    Has tomado una decisión inteligente. Con las herramientas que acabas de desbloquear, podrás ahorrar tiempo, optimizar tus finanzas y enfocarte en lo que más importa: tus clientes.
                                </p>
                                <div className="mt-8 border-t border-slate-700 pt-8">
                                    <p className="font-semibold">¿Necesitas ayuda para empezar?</p>
                                    <Link to="/help-center" className="flex items-center gap-2 mt-2 text-blue-400 hover:text-blue-300 transition-colors">
                                        <span>Visita nuestro Centro de Ayuda</span>
                                        <ArrowRightIcon className="w-4 h-4"/>
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default PaymentSuccessPage;
