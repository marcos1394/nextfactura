// src/pages/PaymentGateway.js
import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheckIcon, SparklesIcon, ArrowRightIcon, LockClosedIcon, CheckCircleIcon, CreditCardIcon, AwardIcon, UsersIcon, ZapIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import api from '../services/api';
import { toast } from 'react-toastify';

const BenefitListItem = ({ children }) => (
    <li className="flex items-start gap-3">
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center mt-0.5">
            <SparklesIcon className="w-3 h-3 text-yellow-300" />
        </div>
        <span className="text-slate-300">{children}</span>
    </li>
);

const SecurityBadge = ({ icon: Icon, text }) => (
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
        <Icon className="w-4 h-4 text-green-500" />
        <span>{text}</span>
    </div>
);

const FeatureHighlight = ({ icon: Icon, title, description }) => (
    <motion.div
        className="flex items-start gap-3 p-4 rounded-lg bg-slate-700/50 border border-slate-600 backdrop-blur-sm"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
    >
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <div>
            <h4 className="font-semibold text-white text-sm mb-1">{title}</h4>
            <p className="text-xs text-slate-400">{description}</p>
        </div>
    </motion.div>
);

const PriceBreakdown = ({ label, amount, isDiscount = false, isTotal = false }) => (
    <div className={`flex justify-between items-center ${isTotal ? 'text-lg font-bold border-t border-gray-200 dark:border-slate-700 pt-3 text-gray-900 dark:text-white' : 'text-sm'}`}>
        <span className={isDiscount ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
            {label}
        </span>
        <span className={`font-medium ${isDiscount ? 'text-green-600 dark:text-green-400' : isTotal ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200'}`}>
            {isDiscount && '-'}{amount}
        </span>
    </div>
);

const Step = ({ number, label, isActive }) => (
    <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
            isActive 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
        }`}>
            {number}
        </div>
        <span className={`text-sm font-medium ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-slate-400'}`}>
            {label}
        </span>
    </div>
);

function PaymentGateway() {
    const location = useLocation();
    const navigate = useNavigate();
    const { darkMode } = useThemeContext();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showFeatures, setShowFeatures] = useState(true);

    // Los datos del plan ahora vienen exclusivamente de la página anterior
    const { selectedPlan } = location.state || {};

    // Redirección de seguridad si no hay un plan seleccionado
    if (!selectedPlan) {
        navigate('/plans');
        return null;
    }
    
    const handlePayment = async () => {
        if (!selectedPlan?.id || !user?.profile?.id) {
            toast.error('Error: No se ha seleccionado un plan o usuario válido.');
            navigate('/plans');
            return;
        }

        setIsProcessing(true);

        try {
            const response = await api.post('/payments/create-preference', {
                planId: selectedPlan.id,
                billingCycle: selectedPlan.period,
                userId: user.profile.id,
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

    const highlightFeatures = [
        {
            icon: ArrowTrendingUpIcon,
            title: "Crece sin límites",
            description: "Escala tu negocio con herramientas empresariales"
        },
        {
            icon: UsersIcon,
            title: "Colaboración en equipo",
            description: "Trabaja junto a tu equipo sin fricciones"
        },
        {
            icon: ZapIcon,
            title: "Facturación instantánea",
            description: "Emite facturas en segundos, no en horas"
        }
    ];

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-slate-900' : 'bg-white'}`}>
            <div className="grid lg:grid-cols-2 min-h-screen">
                
                {/* --- Panel Izquierdo: Resumen de Orden y Pago --- */}
                <div className="flex flex-col justify-center items-center p-6 sm:p-12 order-2 lg:order-1 bg-gray-50 dark:bg-slate-900">
                    <motion.div
                        className="w-full max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        {/* Breadcrumb mejorado */}
                        <div className="flex items-center gap-2 mb-8">
                            <Step number="1" label="Elegir Plan" isActive={false} />
                            <div className="w-8 h-0.5 bg-gray-300 dark:bg-slate-700"></div>
                            <Step number="2" label="Confirmar Pago" isActive={true} />
                        </div>

                        <div className="mb-6">
                            <Link to="/plans" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 group">
                                <ArrowRightIcon className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                                Volver a Planes
                            </Link>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                            Confirma tu plan
                        </h1>
                        <p className="text-gray-600 dark:text-slate-400 mb-8">
                            Estás a un paso de transformar tu facturación
                        </p>
                        
                        {/* Resumen de la Orden Mejorado */}
                        <motion.div 
                            className="space-y-4 p-6 bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-200 dark:border-slate-700 shadow-lg"
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                        Plan {selectedPlan.product}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                                        {selectedPlan.name}
                                    </p>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold">
                                    {isAnnual ? 'AHORRO 15%' : 'MENSUAL'}
                                </div>
                            </div>

                            <div className="space-y-3 border-t border-gray-200 dark:border-slate-700 pt-4">
                                <PriceBreakdown 
                                    label={`Plan ${selectedPlan.product} (${selectedPlan.name})`} 
                                    amount={subtotalFormatted} 
                                />
                                {isAnnual && (
                                    <PriceBreakdown 
                                        label="Descuento Anual (Aprox. 15%)" 
                                        amount={discountFormatted}
                                        isDiscount={true}
                                    />
                                )}
                                <PriceBreakdown 
                                    label="Total a pagar" 
                                    amount={priceFormatted}
                                    isTotal={true}
                                />
                            </div>

                            {isAnnual && (
                                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <AwardIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                        <strong>¡Felicidades!</strong> Estás ahorrando {discountFormatted} MXN al año
                                    </p>
                                </div>
                            )}
                        </motion.div>

                        {/* Método de Pago Mejorado */}
                        <div className="mt-8">
                             <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                <CreditCardIcon className="w-4 h-4" />
                                Método de pago seguro
                            </h3>
                             <motion.div 
                                className="p-5 border-2 border-gray-300 dark:border-slate-600 rounded-xl flex flex-col items-center justify-center gap-3 bg-white dark:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                                whileHover={{ scale: 1.02 }}
                             >
                                 <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                                        <CreditCardIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-lg text-gray-900 dark:text-white leading-none">
                                            Mercado Pago
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                                            Pago seguro y confiable
                                        </div>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-gray-100 dark:bg-slate-700">
                                        <CreditCardIcon className="w-3 h-3" />
                                        <span>Tarjetas</span>
                                    </div>
                                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-gray-100 dark:bg-slate-700">
                                        <CheckCircleIcon className="w-3 h-3" />
                                        <span>Débito</span>
                                    </div>
                                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-gray-100 dark:bg-slate-700">
                                        <ShieldCheckIcon className="w-3 h-3" />
                                        <span>Seguro</span>
                                    </div>
                                 </div>
                             </motion.div>
                             <div className="mt-3 flex flex-wrap gap-3">
                                <SecurityBadge icon={ShieldCheckIcon} text="Encriptación SSL" />
                                <SecurityBadge icon={CheckCircleIcon} text="Pago Verificado" />
                                <SecurityBadge icon={LockClosedIcon} text="Datos Protegidos" />
                             </div>
                        </div>

                        {/* Botón de Pago Mejorado */}
                        <div className="mt-8">
                            <motion.button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed relative overflow-hidden group"
                                whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                                whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Procesando...</span>
                                    </>
                                ) : (
                                    <>
                                        <LockClosedIcon className="w-5 h-5" />
                                        <span>Continuar a Pago Seguro</span>
                                        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                            
                            <div className="mt-4 space-y-2">
                                <p className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                                    <LockClosedIcon className="w-4 h-4 text-gray-400"/> 
                                    Transacción 100% segura y encriptada
                                </p>
                                <p className="text-center text-xs text-gray-500 dark:text-slate-400">
                                    Al continuar, aceptas nuestros{' '}
                                    <a href="#" className="text-blue-600 hover:underline">términos y condiciones</a>
                                </p>
                            </div>
                        </div>

                        {/* Garantía */}
                        <motion.div 
                            className="mt-8 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="flex items-start gap-3">
                                <ShieldCheckIcon className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-sm text-green-800 dark:text-green-300 mb-1">
                                        Garantía de 30 días
                                    </h4>
                                    <p className="text-xs text-green-700 dark:text-green-400">
                                        Si no estás satisfecho, te devolvemos tu dinero. Sin preguntas.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* --- Panel Derecho: Valor y Beneficios Mejorado --- */}
                <div className="hidden lg:block relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 order-1 lg:order-2 overflow-hidden">
                    {/* Elementos decorativos de fondo */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
                    </div>
                    
                    {/* Imagen de fondo sutil */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-5"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')" }}
                    ></div>
                    
                    <div className="relative h-full flex flex-col justify-center p-12 text-white">
                        <motion.div 
                            className="w-full max-w-lg"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                        >
                            {/* Badge superior */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm mb-6">
                                <SparklesIcon className="w-4 h-4 text-blue-300" />
                                <span className="text-sm font-semibold text-blue-100">Plan {selectedPlan.product}</span>
                            </div>

                            <h2 className="text-4xl font-bold leading-tight mb-4">
                                Estás a punto de hacer una{' '}
                                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    excelente inversión
                                </span>
                                {' '}para tu negocio
                            </h2>
                            
                            <p className="text-xl text-slate-300 mb-8">
                                Al activar tu plan, desbloquearás un mundo de posibilidades para tu facturación.
                            </p>

                            {/* Características del plan */}
                            <div className="space-y-3 mb-8">
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                                    Lo que incluye tu plan:
                                </h3>
                                <ul className="space-y-3">
                                    {Array.isArray(selectedPlan.features) && selectedPlan.features.map((feature, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 + (index * 0.1) }}
                                        >
                                            <BenefitListItem>{feature.text}</BenefitListItem>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>

                            {/* Botón para mostrar/ocultar características destacadas */}
                            <button
                                onClick={() => setShowFeatures(!showFeatures)}
                                className="text-sm text-blue-400 hover:text-blue-300 font-medium mb-4 flex items-center gap-2"
                            >
                                {showFeatures ? 'Ocultar' : 'Ver'} características destacadas
                                <ArrowRightIcon className={`w-4 h-4 transition-transform ${showFeatures ? 'rotate-90' : ''}`} />
                            </button>

                            {/* Características destacadas animadas */}
                            <AnimatePresence>
                                {showFeatures && (
                                    <motion.div
                                        className="space-y-3"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {highlightFeatures.map((feature, index) => (
                                            <FeatureHighlight key={index} {...feature} />
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Estadística o social proof */}
                            <motion.div 
                                className="mt-12 pt-8 border-t border-slate-700"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                            >
                                <div className="grid grid-cols-3 gap-6">
                                    <div>
                                        <div className="text-3xl font-bold text-white mb-1">+5K</div>
                                        <div className="text-xs text-slate-400">Empresas activas</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-white mb-1">98%</div>
                                        <div className="text-xs text-slate-400">Satisfacción</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-white mb-1">24/7</div>
                                        <div className="text-xs text-slate-400">Soporte</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default PaymentGateway;