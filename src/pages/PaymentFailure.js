// src/pages/PaymentFailurePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext';
import { XCircleIcon, ArrowPathIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';

/**
 * PaymentFailurePage - Convierte un momento de fricción en una oportunidad para ayudar.
 * * Estrategia de UX/UI:
 * 1.  Tono Empático y Tranquilizador: El lenguaje evita culpar al usuario ("Hubo un inconveniente"
 * en lugar de "Tu pago falló"). Se enfoca en la solución, no en el problema.
 * 2.  Guía Accionable y Específica: En lugar de un mensaje genérico, se ofrecen sugerencias concretas
 * que el usuario puede verificar. Esto le da control y un camino claro a seguir.
 * 3.  Múltiples Vías de Solución: Ofrece una acción primaria clara ("Revisar Información de Pago"),
 * pero también una secundaria ("Contactar a Soporte") como una red de seguridad, asegurando que el
 * usuario nunca se sienta atrapado.
 * 4.  Diseño Consistente y Profesional: El uso del layout de dos paneles mantiene la seriedad y
 * confianza, crucial cuando se discuten problemas de pago.
 */
function PaymentFailurePage() {
    const { darkMode } = useThemeContext();
    const navigate = useNavigate();

    // Navega de vuelta a la página de planes/pago.
    const handleRetryPayment = () => {
        navigate('/plans');
    };

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
            <div className="grid lg:grid-cols-2 min-h-screen">
                
                {/* --- Panel Izquierdo: Mensaje de Fallo y Ayuda --- */}
                <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                    <motion.div
                        className="w-full max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="text-center">
                            <XCircleIcon className="w-24 h-24 text-red-500 dark:text-red-600 mx-auto mb-6" />
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                Hubo un inconveniente
                            </h1>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                                No pudimos procesar tu pago en este momento. ¡No te preocupes! Vamos a solucionarlo.
                            </p>
                        </div>
                        
                        <div className="mt-8 text-left space-y-4 p-6 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700">
                           <h3 className="font-semibold text-gray-900 dark:text-white">Algunas cosas que puedes verificar:</h3>
                           <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-2">
                               <li>Que el <span className="font-medium">número de tarjeta, fecha de vencimiento y CVV</span> sean correctos.</li>
                               <li>Que la tarjeta tenga <span className="font-medium">fondos suficientes</span> y esté habilitada para compras en línea.</li>
                               <li>Algunos bancos requieren <span className="font-medium">autorización adicional</span> para transacciones nuevas.</li>
                           </ul>
                        </div>

                        <div className="mt-10 space-y-4">
                            <button
                                onClick={handleRetryPayment}
                                className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <ArrowPathIcon className="w-5 h-5" /> Revisar y Reintentar Pago
                            </button>
                             <button
                                onClick={() => navigate('/contact')}
                                className="w-full py-3 px-4 bg-transparent text-gray-600 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors"
                            >
                                <QuestionMarkCircleIcon className="w-5 h-5" /> Contactar a Soporte
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* --- Panel Derecho: Branding de Soporte --- */}
                <div className="hidden lg:block relative">
                    <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560411037-3c54b2a09a4a?q=80&w=1974&auto=format&fit=crop')" }}
                    >
                         <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>
                    </div>
                    <div className="relative h-full flex flex-col justify-end p-12">
                        <h2 className="text-4xl font-bold text-white leading-tight">
                            Estamos aquí para ayudarte.
                        </h2>
                        <p className="mt-4 text-xl text-gray-200">
                           Un pequeño bache no nos detendrá. Nuestro equipo de soporte está listo para asistirte.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentFailurePage;
