// src/pages/PaymentGateway.js
import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext';
import { ShieldCheckIcon, SparklesIcon, ArrowRightIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import api from '../services/api'; // <-- NUEVO: Importamos nuestro cliente API

// Un componente para la lista de beneficios en el panel derecho
const BenefitListItem = ({ children }) => (
    <li className="flex items-start gap-3">
        <SparklesIcon className="w-5 h-5 flex-shrink-0 text-yellow-300 mt-0.5" />
        <span className="text-slate-300">{children}</span>
    </li>
);

/**
 * PaymentGateway - Rediseñado como una experiencia de checkout segura y de alta confianza.
 * * Estrategia de UX/UI:
 * 1.  Resumen de Orden Claro: El panel izquierdo presenta un desglose transparente del costo, similar
 * a las mejores prácticas de e-commerce, lo que elimina la ambigüedad y genera confianza.
 * 2.  Refuerzo de Valor y Seguridad: El panel derecho está dedicado a combatir la duda de último minuto.
 * Recuerda al usuario los beneficios clave que está adquiriendo y muestra insignias de seguridad explícitas.
 * 3.  Gestión de Expectativas Clara: Se muestra prominentemente el logo de Mercado Pago, informando al
 * usuario exactamente cómo y dónde se procesará su pago, eliminando sorpresas.
 * 4.  Diseño Consistente y Profesional: El layout de dos paneles y la estética cuidada mantienen la
 * coherencia de la marca, asegurando al usuario que está en un entorno seguro y profesional.
 */
function PaymentGateway() {
    const location = useLocation();
    const navigate = useNavigate();
    const { darkMode } = useThemeContext();
    const [isProcessing, setIsProcessing] = useState(false);

    // Si no hay estado de location, usamos un mock para poder renderizar y diseñar la página.
    const { selectedPlan } = location.state || {
        selectedPlan: {
            product: 'Paquete Completo',
            name: 'Anual',
            price: 7500.00,
            features: [
                'Facturación ilimitada',
                'Análisis y reportes avanzados',
                'Gestión de múltiples sucursales',
                'Soporte Premium 24/7'
            ]
        }
    };

    // --- MANEJADOR DE PAGO REAL ---
    const handlePayment = async () => {
        if (!selectedPlan?.id) { // Verificamos que tengamos un plan con ID
            toast.error('Error: No se ha seleccionado ningún plan válido.');
            navigate('/plans');
            return;
        }

        setIsProcessing(true);

        try {
            console.log('[PaymentGateway] Creando preferencia de pago para el plan:', selectedPlan.id);
            
            // 1. Llamamos a nuestro backend para crear la preferencia de pago
            const response = await api.post('/payments/create-preference', {
                planId: selectedPlan.id,
                // Aquí podrías enviar más datos si tu backend los necesita
            });

            if (response.data.success && response.data.checkoutUrl) {
                // 2. Si todo sale bien, redirigimos al usuario a la URL de checkout de Mercado Pago
                console.log('[PaymentGateway] Redirigiendo a Mercado Pago:', response.data.checkoutUrl);
                window.location.href = response.data.checkoutUrl;
            } else {
                throw new Error(response.data.message || 'No se pudo obtener la URL de pago.');
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al iniciar el proceso de pago. Inténtalo de nuevo.';
            toast.error(errorMessage);
            console.error('[PaymentGateway] Error:', error);
            setIsProcessing(false); // Detenemos el estado de carga si hay un error
        }
    };

    if (!selectedPlan) {
        // Redirección si se llega a esta página sin datos
        navigate('/plans');
        return null;
    }
    
    const priceFormatted = selectedPlan.price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
    const discountFormatted = (selectedPlan.price * 0.15).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
    const subtotalFormatted = (selectedPlan.price + selectedPlan.price * 0.15).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });


    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-slate-900' : 'bg-gray-50'}`}>
            <div className="grid lg:grid-cols-2 min-h-screen">
                
                {/* --- Panel Izquierdo: Resumen de Orden y Pago --- */}
                <div className="flex flex-col justify-center items-center p-6 sm:p-12 order-2 lg:order-1">
                    <motion.div
                        className="w-full max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <Link to="/plans" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">
                            &larr; Volver a Planes
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Confirmar y Pagar
                        </h1>
                        
                        {/* Resumen de la Orden */}
                        <div className="mt-8 space-y-4 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Resumen de tu Orden</h3>
                            <div className="space-y-3 text-sm border-t border-gray-200 dark:border-slate-700 pt-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Plan {selectedPlan.product} ({selectedPlan.name})</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{subtotalFormatted}</span>
                                </div>
                                <div className="flex justify-between text-green-600 dark:text-green-400">
                                    <span>Descuento Anual (15%)</span>
                                    <span>-{discountFormatted}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-slate-700 pt-3 text-gray-900 dark:text-white">
                                    <span>Total</span>
                                    <span>{priceFormatted}</span>
                                </div>
                            </div>
                        </div>

                        {/* Método de Pago */}
                        <div className="mt-8">
                             <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Pagar de forma segura con:</h3>
                             <div className="p-4 border border-gray-300 dark:border-slate-700 rounded-lg flex justify-center items-center bg-gray-50 dark:bg-slate-800">
                                <img src="https://logolook.net/wp-content/uploads/2021/07/Mercado-Pago-Logo.png" alt="Mercado Pago" className="h-8"/>
                             </div>
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        Continuar a Pago Seguro <ArrowRightIcon className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                            <p className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
                               <LockClosedIcon className="w-4 h-4 text-gray-400"/> Transacción 100% segura y encriptada.
                           </p>
                        </div>
                    </motion.div>
                </div>

                {/* --- Panel Derecho: Confianza y Valor --- */}
                <div className="hidden lg:block relative bg-slate-800 order-1 lg:order-2">
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-10"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')" }}
                    ></div>
                    <div className="relative h-full flex flex-col justify-center p-12 text-white">
                        <div className="w-full max-w-sm">
                            <ShieldCheckIcon className="w-12 h-12 text-green-400 mb-6"/>
                            <h2 className="text-3xl font-bold leading-tight">
                                Estás a punto de hacer una excelente inversión para tu negocio.
                            </h2>
                            <p className="mt-4 text-slate-300">
                                Al activar tu plan <strong>{selectedPlan.product}</strong>, desbloquearás:
                            </p>
                            <ul className="mt-6 space-y-3 text-sm">
                                {selectedPlan.features.map(feature => <BenefitListItem key={feature}>{feature}</BenefitListItem>)}
                            </ul>

                            <div className="mt-12 p-4 border border-slate-700 rounded-lg bg-slate-900/50">
                                <p className="text-sm italic text-slate-300">"Desde que usamos NextManager, la administración es un 80% más rápida. Nos enfocamos en el servicio, no en el papeleo."</p>
                                <p className="text-right mt-2 text-xs font-semibold text-white">- Dueño, SaborMX</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default PaymentGateway;
