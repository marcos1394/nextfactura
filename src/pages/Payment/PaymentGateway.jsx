import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { toast } from 'react-toastify';

// --- ICONOS LUCIDE ---
import { 
    ShieldCheck, Sparkles, ArrowRight, Lock, CheckCircle2, 
    CreditCard, Users, TrendingUp, Zap, Trophy, ArrowLeft, Loader2 
} from 'lucide-react';

// --- SUBCOMPONENTES ---

const BenefitListItem = ({ children }) => (
    <li className="flex items-start gap-3">
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center mt-0.5">
            <Sparkles className="w-3 h-3 text-yellow-300" />
        </div>
        <span className="text-slate-300 text-sm leading-relaxed">{children}</span>
    </li>
);

const SecurityBadge = ({ icon: Icon, text }) => (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded text-xs font-medium text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
        <Icon className="w-3.5 h-3.5" />
        <span>{text}</span>
    </div>
);

const FeatureHighlight = ({ icon: Icon, title, description }) => (
    <motion.div
        className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm hover:bg-slate-800 transition-colors"
        whileHover={{ y: -2 }}
    >
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <div>
            <h4 className="font-semibold text-white text-sm mb-1">{title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
        </div>
    </motion.div>
);

const PriceBreakdown = ({ label, amount, isDiscount = false, isTotal = false }) => (
    <div className={`flex justify-between items-center ${isTotal ? 'text-lg font-bold border-t border-gray-200 dark:border-slate-700 pt-4 mt-4' : 'text-sm py-1'}`}>
        <span className={isDiscount ? 'text-green-600 dark:text-green-400' : isTotal ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
            {label}
        </span>
        <span className={`font-medium ${isDiscount ? 'text-green-600 dark:text-green-400' : isTotal ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}`}>
            {isDiscount && '-'}{amount}
        </span>
    </div>
);

const Step = ({ number, label, isActive }) => (
    <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
            isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500'
        }`}>
            {number}
        </div>
        <span className={`text-xs font-semibold uppercase tracking-wide ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500'}`}>
            {label}
        </span>
    </div>
);

// --- COMPONENTE PRINCIPAL ---

function PaymentGateway() {
    const location = useLocation();
    const navigate = useNavigate();
    const { darkMode } = useThemeContext();
    const { user, isLoading: isAuthLoading } = useAuth(); // Obtenemos el usuario del contexto
    
    const [isProcessing, setIsProcessing] = useState(false);

    // Recuperamos el plan seleccionado
    const { selectedPlan } = location.state || {};

    // 1. CARGA DE SESIÓN
    if (isAuthLoading) {
        return (
            <div className={`min-h-screen flex flex-col justify-center items-center ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                <p className="text-sm text-gray-500 font-medium">Verificando sesión...</p>
            </div>
        );
    }

    // 2. SEGURIDAD: SI NO HAY PLAN, VOLVER
    if (!selectedPlan) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <p className="mb-4">No se ha seleccionado ningún plan.</p>
                <button onClick={() => navigate('/plans')} className="text-blue-600 hover:underline">Volver a planes</button>
            </div>
        );
    }

    // --- LÓGICA DE PAGO (CORREGIDA) ---
    const handlePayment = async () => {
        // Validaciones defensivas
        if (!selectedPlan?.planId) {
            toast.error('Error: ID de plan no válido.');
            return;
        }
        
        // Obtenemos el ID del usuario
        const userId = user?.id || user?.profile?.id;
        
        if (!userId) {
            toast.error('Error: Sesión de usuario no válida.');
            navigate('/login');
            return;
        }

        setIsProcessing(true);

        try {
            // 1. PREPARACIÓN DE DATOS DEL PAGADOR
            // MercadoPago pide Nombre y Apellido por separado en el backend
            const fullName = user.name || user.profile?.name || 'Cliente NextManager';
            const nameParts = fullName.trim().split(' ');
            
            // Tomamos el primer string como nombre, el resto como apellido
            const firstName = nameParts[0]; 
            const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ' '; // MercadoPago a veces rechaza apellidos vacíos

            const payerInfo = {
                name: firstName,
                surname: lastName,
                email: user.email || user.profile?.email,
                // Opcional: phone: { area_code: ..., number: ... } si lo tienes
            };

            // 2. LLAMADA AL BACKEND
            const response = await api.post('/payments/create-preference', {
                planId: selectedPlan.planId,
                billingCycle: selectedPlan.period,
                userId: userId,
                payerInfo: payerInfo, // <--- DATOS REQUERIDOS AGREGADOS
                origin: 'webapp'
            });

            if (response.data.success && response.data.init_point) {
                // Redirigimos a MercadoPago
                window.location.href = response.data.init_point;
            } else {
                throw new Error(response.data.message || 'No se pudo generar el enlace de pago.');
            }

        } catch (error) {
            console.error('[Payment] Error:', error);
            const msg = error.response?.data?.message || error.message || 'Error de conexión.';
            toast.error(msg);
            setIsProcessing(false);
        }
    };

    // Cálculos de visualización
    const isAnnual = selectedPlan.period === 'annually';
    const originalPrice = isAnnual ? (selectedPlan.price / 0.85) : selectedPlan.price;
    const discountAmount = isAnnual ? (originalPrice - selectedPlan.price) : 0;

    const formatCurrency = (val) => val.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-slate-900' : 'bg-gray-50'}`}>
            <div className="grid lg:grid-cols-2 min-h-screen">
                
                {/* --- IZQUIERDA: CHECKOUT --- */}
                <div className="flex flex-col justify-center items-center p-6 sm:p-12 order-2 lg:order-1 relative z-10">
                    <motion.div 
                        className="w-full max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Stepper */}
                        <div className="flex items-center gap-3 mb-8 opacity-70 hover:opacity-100 transition-opacity">
                            <Step number="1" label="Plan" isActive={false} />
                            <div className="w-8 h-[1px] bg-gray-300 dark:bg-slate-700"></div>
                            <Step number="2" label="Pago" isActive={true} />
                        </div>

                        <Link to="/plans" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                            Cambiar plan
                        </Link>

                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Resumen de Orden</h1>
                        <p className="text-gray-500 dark:text-slate-400 mb-8">Revisa los detalles antes de continuar.</p>

                        {/* Card de Resumen */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-700 p-6 mb-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Plan {selectedPlan.product}</h3>
                                    <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                                            {isAnnual ? 'Facturación Anual' : 'Facturación Mensual'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                    <Sparkles className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            {/* Desglose */}
                            <div className="space-y-1">
                                <PriceBreakdown 
                                    label="Subtotal" 
                                    amount={formatCurrency(originalPrice)} 
                                />
                                {isAnnual && (
                                    <PriceBreakdown 
                                        label="Descuento Anual (15%)" 
                                        amount={formatCurrency(discountAmount)} 
                                        isDiscount 
                                    />
                                )}
                                <PriceBreakdown 
                                    label="Total a pagar" 
                                    amount={formatCurrency(selectedPlan.price)} 
                                    isTotal 
                                />
                            </div>

                            {isAnnual && (
                                <div className="mt-4 flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-800/30">
                                    <Trophy className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                    <p className="text-xs font-medium text-green-700 dark:text-green-300">
                                        ¡Excelente elección! Estás ahorrando {formatCurrency(discountAmount)}.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Botón de Pago */}
                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full group relative overflow-hidden rounded-xl bg-blue-600 p-4 text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-2 font-bold">
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4 opacity-70" />
                                        Pagar {formatCurrency(selectedPlan.price)}
                                        <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </div>
                        </button>

                        {/* Badges de Seguridad */}
                        <div className="mt-6 flex flex-wrap justify-center gap-3 opacity-80">
                            <SecurityBadge icon={ShieldCheck} text="SSL Seguro" />
                            <SecurityBadge icon={CheckCircle2} text="Garantía 30 días" />
                            <SecurityBadge icon={CreditCard} text="Mercado Pago" />
                        </div>

                    </motion.div>
                </div>

                {/* --- DERECHA: BENEFICIOS (Visual) --- */}
                <div className="hidden lg:flex relative bg-slate-900 order-1 lg:order-2 overflow-hidden flex-col justify-center p-16">
                    {/* Fondo decorativo */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/95 to-blue-900/90"></div>
                    
                    <motion.div 
                        className="relative z-10 max-w-lg"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <div className="inline-block px-3 py-1 mb-6 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                            Acceso Inmediato
                        </div>
                        
                        <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
                            Todo lo que necesitas para <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">crecer sin límites</span>.
                        </h2>
                        
                        <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                            Al completar tu pago, tendrás acceso instantáneo a todas las herramientas premium de NextManager.
                        </p>

                        <div className="space-y-4 mb-12">
                            <FeatureHighlight 
                                icon={TrendingUp} 
                                title="Escalabilidad Total" 
                                description="Tu sistema crece contigo. Sin límites de transacciones." 
                            />
                            <FeatureHighlight 
                                icon={Users} 
                                title="Multiusuario y Roles" 
                                description="Delega con confianza asignando permisos específicos." 
                            />
                            <FeatureHighlight 
                                icon={Zap} 
                                title="Facturación Instantánea" 
                                description="Emite CFDI 4.0 en segundos, cumpliendo con el SAT." 
                            />
                        </div>

                        <div className="pt-8 border-t border-slate-700/50 flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-slate-400">
                                <strong className="text-white">500+ empresas</strong> confían en nosotros.
                            </p>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}

export default PaymentGateway;