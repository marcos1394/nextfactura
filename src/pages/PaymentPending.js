// src/pages/PaymentPendingPage.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext';
import { ClockIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

/**
 * PaymentPendingPage - Transforma la espera ansiosa en una pausa confiable.
 * * Estrategia de UX/UI:
 * 1.  Entorno de Marca Consistente: El uso del layout de dos paneles mantiene al usuario dentro de un
 * entorno familiar y seguro, crucial durante la espera de una confirmación financiera.
 * 2.  Comunicación Clara y Específica: El texto explica exactamente lo que está sucediendo
 * ("Confirmando con el procesador") y establece expectativas claras ("Esto suele tardar unos segundos").
 * 3.  Animación Relajante y Profesional: La animación de los círculos pulsantes es más sofisticada
 * que un simple icono parpadeante. Comunica un proceso activo sin generar estrés.
 * 4.  Panel de Reafirmación: El panel derecho está dedicado a mensajes que calman la ansiedad,
 * recordando al usuario la seguridad del proceso y agradeciéndole su paciencia.
 */
function PaymentPendingPage() {
    const { darkMode } = useThemeContext();

    // Variante para la animación de los círculos pulsantes
    const pulseVariant = {
        initial: { scale: 1, opacity: 0.5 },
        animate: {
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
            transition: {
                duration: 2.5,
                ease: "easeInOut",
                repeat: Infinity,
            }
        }
    };

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-slate-900' : 'bg-white'}`}>
            <div className="grid lg:grid-cols-2 min-h-screen">
                
                {/* --- Panel Izquierdo: Estado del Proceso --- */}
                <div className="flex flex-col justify-center items-center p-6 sm:p-12 order-2 lg:order-1">
                    <motion.div
                        className="w-full max-w-md text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        {/* Animación Central */}
                        <div className="relative flex justify-center items-center h-40 w-40 mx-auto mb-8">
                            <motion.div variants={pulseVariant} initial="initial" animate="animate" className="absolute w-full h-full rounded-full bg-yellow-500/30" />
                            <motion.div variants={pulseVariant} initial="initial" animate="animate" style={{ animationDelay: '0.5s' }} className="absolute w-2/3 h-2/3 rounded-full bg-yellow-500/40" />
                            <ClockIcon className="w-16 h-16 text-yellow-500 dark:text-yellow-400 z-10" />
                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                            Confirmando tu Pago...
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                            Estamos procesando tu transacción de forma segura.
                        </p>
                        <p className="mt-2 text-sm font-semibold text-red-600 dark:text-red-500">
                            Por favor, no cierres ni actualices esta página.
                        </p>
                        
                        {/* Barra de progreso indeterminada */}
                        <div className="relative w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full mt-10 overflow-hidden">
                            <motion.div 
                                className="absolute top-0 left-0 h-full w-1/3 bg-yellow-500 dark:bg-yellow-400 rounded-full"
                                initial={{ x: '-100%' }}
                                animate={{ x: '300%' }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            />
                        </div>
                    </motion.div>
                </div>

                {/* --- Panel Derecho: Mensajes de Confianza --- */}
                <div className="hidden lg:block relative bg-slate-800 order-1 lg:order-2">
                     <div 
                        className="absolute inset-0 bg-cover bg-center opacity-10"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop')" }}
                    ></div>
                    <div className="relative h-full flex flex-col justify-center p-12 text-white">
                        <div className="w-full max-w-sm">
                            <ShieldCheckIcon className="w-12 h-12 text-green-400 mb-6"/>
                            <h2 className="text-3xl font-bold leading-tight">
                                Tu transacción es segura.
                            </h2>
                            <p className="mt-4 text-slate-300">
                                Estamos realizando las últimas verificaciones con el procesador de pagos para garantizar la seguridad de tu información.
                            </p>
                            <ul className="mt-6 space-y-3 text-sm border-t border-slate-700 pt-6">
                               <li className="flex items-start gap-3">
                                   <span className="font-bold text-green-400">&bull;</span>
                                   <span className="text-slate-300">Esto suele tardar solo unos segundos.</span>
                               </li>
                               <li className="flex items-start gap-3">
                                   <span className="font-bold text-green-400">&bull;</span>
                                   <span className="text-slate-300">Serás redirigido automáticamente al finalizar.</span>
                               </li>
                               <li className="flex items-start gap-3">
                                   <span className="font-bold text-green-400">&bull;</span>
                                   <span className="text-slate-300">Gracias por tu paciencia.</span>
                               </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default PaymentPending;
