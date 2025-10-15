import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth'; // Para obtener el ID del usuario
import { ShieldCheckIcon, SparklesIcon, ArrowRightIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import api from '../services/api';
import { toast } from 'react-toastify';

const BenefitListItem = ({ children }) => (
    <li className="flex items-start gap-3">
        <SparklesIcon className="w-5 h-5 flex-shrink-0 text-yellow-300 mt-0.5" />
        <span className="text-slate-300">{children}</span>
    </li>
);

function PaymentGateway() {
    const location = useLocation();
    const navigate = useNavigate();
    const { darkMode } = useThemeContext();
    const { user } = useAuth(); // Obtenemos el usuario autenticado
    const [isProcessing, setIsProcessing] = useState(false);

    // Los datos del plan ahora vienen exclusivamente de la página anterior
    const { selectedPlan } = location.state || {};

    // Redirección de seguridad si no hay un plan seleccionado
    if (!selectedPlan) {
        navigate('/plans');
        return null;
    }
    
    const handlePayment = async () => {
        if (!selectedPlan?.planId || !user?.profile?.id) {
            toast.error('Error: No se ha seleccionado un plan o usuario válido.');
            navigate('/plans');
            return;
        }

        setIsProcessing(true);

        try {
            const response = await api.post('/payments/create-preference', {
                planId: selectedPlan.planId,
                billingCycle: selectedPlan.period,
                userId: user.profile.id, // Enviamos el ID del usuario
                origin: 'webapp_onboarding'
            });

            if (response.data.success && response.data.init_point) {
                window.location.href = response.data.init_point;
            } else {
                throw new Error(response.data.message || 'No se pudo obtener la URL de pago.');
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al iniciar el proceso de pago. Inténtalo de nuevo.';
            toast.error(errorMessage);
            setIsProcessing(false);
        }
    };
    
    // Cálculos de precios (asumiendo que vienen en 'selectedPlan')
    const priceFormatted = (selectedPlan.price || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
    const isAnnual = selectedPlan.period === 'annually';
    // Mostramos descuento solo si es anual
    const subtotal = isAnnual ? (selectedPlan.price / 0.85) : selectedPlan.price; 
    const discount = isAnnual ? (subtotal - selectedPlan.price) : 0;
    
    const subtotalFormatted = subtotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
    const discountFormatted = discount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-slate-900' : 'bg-white'}`}>
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
                                {isAnnual && (
                                    <div className="flex justify-between text-green-600 dark:text-green-400">
                                        <span>Descuento Anual (Aprox. 15%)</span>
                                        <span>-{discountFormatted}</span>
                                    </div>
                                )}
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
                                    'Procesando...'
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
                                {Array.isArray(selectedPlan.features) && selectedPlan.features.map(feature => <BenefitListItem key={feature.text}>{feature.text}</BenefitListItem>)}
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default PaymentGateway;