import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../../context/ThemeContext';
import api from '../../config/axios'; // Usamos nuestra instancia configurada
import { 
    Check, Minus, Plus, Sparkles, ShieldCheck, 
    Clock, XCircle, Star, ArrowRight, Zap, HelpCircle 
} from 'lucide-react';

// --- DATOS ESTÁTICOS ---
const faqData = [
    { question: '¿Puedo cambiar de plan más adelante?', answer: '¡Por supuesto! Puedes mejorar, bajar o cancelar tu plan en cualquier momento directamente desde tu panel de configuración.' },
    { question: '¿Hay cargos ocultos de instalación?', answer: 'No. El precio que ves es el precio final. Sin costos de instalación ni letras chiquitas.' },
    { question: '¿Cómo funciona la facturación?', answer: 'Aceptamos todas las tarjetas vía Mercado Pago. Si eliges anual, ahorras un 15% y se cobra una sola vez.' },
    { question: '¿Qué pasa si necesito más timbres?', answer: 'Puedes adquirir paquetes de timbres extra en cualquier momento sin necesidad de cambiar todo tu plan.' },
];

const comparisonFeatures = [
    { category: 'Esenciales', items: ['Facturación 4.0', 'Validación SAT', 'Envío por Correo', 'Cancelaciones'] },
    { category: 'Gestión', items: ['Panel de Dashboard', 'Reportes en Excel', 'Catálogo de Clientes', 'Catálogo de Productos'] },
    { category: 'Soporte', items: ['Chat en vivo', 'Soporte por Email', 'Guías de Video', 'Asesor Dedicado'] }
];

// --- SUBCOMPONENTES ---

const BillingToggle = ({ billingCycle, setBillingCycle }) => (
    <div className="relative inline-flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
        {/* Fondo animado del toggle */}
        <motion.div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-gray-700 rounded-full shadow-sm"
            initial={false}
            animate={{ x: billingCycle === 'monthly' ? 0 : '100%' }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        
        <button
            onClick={() => setBillingCycle('monthly')}
            className={`relative z-10 w-32 py-2 text-sm font-semibold rounded-full transition-colors ${
                billingCycle === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
            }`}
        >
            Mensual
        </button>
        <button
            onClick={() => setBillingCycle('annually')}
            className={`relative z-10 w-32 py-2 text-sm font-semibold rounded-full transition-colors flex items-center justify-center gap-2 ${
                billingCycle === 'annually' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
            }`}
        >
            Anual
            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                -15%
            </span>
        </button>
    </div>
);

const TrustBadge = ({ icon: Icon, title, description }) => (
    <div className="flex flex-col items-center text-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
            <Icon className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-gray-900 dark:text-white">{title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    </div>
);

const PlanCard = ({ plan, billingCycle, onSelect }) => {
    const annualPrice = plan.price_monthly * 12 * 0.85;
    const monthlyDisplay = billingCycle === 'annually' ? annualPrice / 12 : plan.price_monthly;
    
    return (
        <motion.div
            layout
            className={`relative flex flex-col p-8 rounded-3xl transition-all ${
                plan.isHighlighted 
                    ? 'bg-white dark:bg-gray-800 border-2 border-blue-600 shadow-2xl z-10 scale-105' 
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg opacity-90 hover:opacity-100 hover:scale-[1.02]'
            }`}
        >
            {plan.isHighlighted && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
                        <Sparkles className="w-3 h-3" /> Recomendado
                    </span>
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 h-10">{plan.description}</p>
            </div>

            <div className="mb-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    ${monthlyDisplay.toFixed(0)}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">/mes</span>
            </div>

            {billingCycle === 'annually' && (
                <p className="text-xs text-green-600 font-semibold mb-6 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-center">
                    Facturado ${annualPrice.toFixed(0)} anualmente (Ahorras 15%)
                </p>
            )}

            <button
                onClick={() => onSelect(plan)}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                    plan.isHighlighted
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/30'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
                Seleccionar Plan
            </button>

            <div className="mt-8 space-y-4 flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Incluye:</p>
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                        {plan.timbres > 0 ? `${plan.timbres.toLocaleString()} Timbres` : 'Sin timbres'}
                    </span>
                </div>
                {plan.features?.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{feature.text}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const ComparisonTable = ({ plans }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mt-20 max-w-5xl mx-auto">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-blue-600 transition-colors py-4 font-medium"
            >
                {isOpen ? <Minus className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}
                {isOpen ? 'Ocultar comparativa detallada' : 'Ver comparativa detallada de planes'}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mt-4">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                                        <th className="p-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Característica</th>
                                        {plans.map(p => (
                                            <th key={p.id} className="p-4 text-center text-sm font-semibold text-gray-900 dark:text-white">{p.name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {comparisonFeatures.map((cat, i) => (
                                        <React.Fragment key={i}>
                                            <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                                                <td colSpan={plans.length + 1} className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider pl-4">
                                                    {cat.category}
                                                </td>
                                            </tr>
                                            {cat.items.map((item, j) => (
                                                <tr key={j} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{item}</td>
                                                    {plans.map(p => (
                                                        <td key={p.id} className="p-4 text-center">
                                                            {/* Aquí podrías personalizar la lógica real de features si la API la provee */}
                                                            <div className="flex justify-center">
                                                                <Check className="w-5 h-5 text-green-500" />
                                                            </div>
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
function PlanSelection() {
    const { darkMode } = useThemeContext();
    const navigate = useNavigate();
    
    const [billingCycle, setBillingCycle] = useState('annually');
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedFAQ, setExpandedFAQ] = useState(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setIsLoading(true);
                // Usamos la instancia 'api' (axios) en lugar de fetch
                const response = await api.get('/payments/plans');
                const data = response.data;

                if (data.success) {
                    // Lógica para filtrar duplicados (si el backend manda mensual y anual como items separados)
                    const uniquePlans = data.plans.reduce((acc, plan) => {
                        const existing = acc.find(p => p.name === plan.name);
                        if (!existing) {
                            acc.push(plan);
                        } else if (plan.price_annually !== plan.price_monthly) {
                            const index = acc.findIndex(p => p.name === plan.name);
                            acc[index] = plan;
                        }
                        return acc;
                    }, []);
                    setPlans(uniquePlans);
                } else {
                    throw new Error('Formato de respuesta inválido.');
                }
            } catch (err) {
                console.error("Error fetching plans:", err);
                setError(err.message || 'No se pudieron cargar los planes.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handlePlanSelect = (plan) => {
        const annualPrice = plan.price_monthly * 12 * 0.85;
        const selectedOption = {
            planId: plan.id,
            product: plan.name,
            name: `Plan ${billingCycle === 'monthly' ? 'Mensual' : 'Anual'}`,
            price: billingCycle === 'annually' ? annualPrice : plan.price_monthly,
            period: billingCycle,
            features: plan.features,
        };
        navigate('/payment', { state: { selectedPlan: selectedOption } });
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-4 py-20 max-w-7xl">
                
                {/* HERO SECTION */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                        Planes simples para <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            negocios ambiciosos
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
                        Comienza gratis por 14 días. Cancela cuando quieras.
                        Sin tarjetas de crédito requeridas para empezar.
                    </p>
                    
                    <BillingToggle billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
                </div>

                {/* ERROR STATE */}
                {error && (
                    <div className="text-center p-8 bg-red-50 rounded-xl mb-8">
                        <p className="text-red-600">{error}</p>
                        <button onClick={() => window.location.reload()} className="mt-4 text-sm font-bold text-red-700 underline">Reintentar</button>
                    </div>
                )}

                {/* LOADING STATE */}
                {isLoading && (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse"></div>
                        ))}
                    </div>
                )}

                {/* PLANS GRID */}
                {!isLoading && !error && (
                    <>
                        <div className="grid md:grid-cols-3 gap-8 items-start">
                            {plans.map(plan => (
                                <PlanCard 
                                    key={plan.id} 
                                    plan={plan} 
                                    billingCycle={billingCycle} 
                                    onSelect={handlePlanSelect} 
                                />
                            ))}
                        </div>

                        <ComparisonTable plans={plans} />
                    </>
                )}

                {/* TRUST SIGNALS */}
                <div className="mt-24 grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800">
                    <TrustBadge icon={ShieldCheck} title="Pagos Seguros" description="Procesados vía Mercado Pago con encriptación SSL." />
                    <TrustBadge icon={Clock} title="Soporte 24/7" description="Equipo técnico siempre disponible para emergencias." />
                    <TrustBadge icon={Star} title="Garantía de 30 días" description="Si no te gusta, te devolvemos tu dinero." />
                </div>

                {/* FAQ */}
                <div className="mt-24 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">Preguntas Frecuentes</h2>
                    <div className="space-y-4">
                        {faqData.map((faq, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <button
                                    onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="font-semibold text-gray-900 dark:text-white">{faq.question}</span>
                                    {expandedFAQ === i ? <Minus className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-gray-400" />}
                                </button>
                                <AnimatePresence>
                                    {expandedFAQ === i && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: 'auto' }}
                                            exit={{ height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FINAL CTA */}
                <div className="mt-24 bg-blue-600 rounded-3xl p-10 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">¿Necesitas un plan a la medida?</h2>
                        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                            Si tienes múltiples sucursales o requerimientos especiales de facturación masiva, contáctanos.
                        </p>
                        <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
                            <HelpCircle className="w-5 h-5" />
                            Contactar a Ventas
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default PlanSelection;