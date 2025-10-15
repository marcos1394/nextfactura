// src/pages/PlanSelection.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext';
import { CheckIcon, PlusIcon, MinusIcon, SparklesIcon, ShieldCheckIcon, ClockIcon, XCircleIcon, StarIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

// --- DATOS DE FAQ AMPLIADOS ---
const faqData = [
    { question: '¿Puedo cambiar de plan más adelante?', answer: '¡Por supuesto! Puedes mejorar, bajar o cancelar tu plan en cualquier momento directamente desde tu panel de configuración. Queremos que uses lo que mejor se adapte a ti.' },
    { question: '¿Qué sucede cuando termina mi periodo de facturación?', answer: 'Tu plan se renovará automáticamente al final de cada ciclo (mensual o anual). Recibirás una notificación por correo antes de cada renovación.' },
    { question: '¿Hay algún costo de instalación o cargos ocultos?', answer: 'No. Nuestros precios son 100% transparentes. El precio que ves es el precio que pagas, sin sorpresas ni cargos adicionales de configuración.' },
    { question: '¿Qué métodos de pago aceptan?', answer: 'Aceptamos todas las principales tarjetas de crédito y débito a través de Mercado Pago, nuestra pasarela de pago segura y confiable.' },
    { question: '¿Qué pasa si me quedo sin timbres?', answer: 'No te preocupes. Si te quedas sin timbres, puedes comprar paquetes adicionales en cualquier momento o actualizar a un plan superior. Tu servicio nunca se interrumpe.' },
    { question: '¿Los timbres tienen fecha de expiración?', answer: 'No. Tus timbres no caducan y se acumulan mensualmente. Puedes usarlos cuando los necesites sin presión de tiempo.' },
    { question: '¿Ofrecen soporte técnico?', answer: 'Sí. Todos nuestros planes incluyen soporte por email. Los planes superiores tienen soporte prioritario con tiempos de respuesta más rápidos.' },
    { question: '¿Puedo probar el servicio antes de pagar?', answer: 'Sí, ofrecemos un periodo de prueba gratuito de 14 días sin necesidad de tarjeta de crédito. Prueba todas las funcionalidades antes de decidir.' },
    { question: '¿Qué pasa si cancelo mi plan?', answer: 'Puedes cancelar en cualquier momento. Tendrás acceso completo hasta el final de tu periodo de facturación actual. Tus datos permanecen seguros por 90 días por si decides regresar.' },
    { question: '¿Hay descuentos para equipos grandes?', answer: 'Sí. Si necesitas más de 10 usuarios o volúmenes muy altos de facturación, contáctanos para planes empresariales personalizados con descuentos especiales.' }
];

// --- DATOS DE COMPARACIÓN ---
const comparisonFeatures = [
    { category: 'Facturación', items: ['Timbres fiscales', 'Facturación ilimitada', 'Catálogo de productos', 'Gestión de clientes'] },
    { category: 'Funcionalidades', items: ['Panel de control', 'Reportes básicos', 'Múltiples usuarios', 'API de integración'] },
    { category: 'Soporte', items: ['Soporte por email', 'Documentación completa', 'Soporte prioritario', 'Asesor dedicado'] }
];

// --- SUBCOMPONENTES DE UI ---
const BillingToggle = ({ billingCycle, setBillingCycle }) => (
    <div className="inline-flex items-center p-1 bg-gray-200 dark:bg-slate-800 rounded-full shadow-inner">
        <button 
            onClick={() => setBillingCycle('monthly')} 
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                billingCycle === 'monthly' 
                    ? 'bg-white dark:bg-slate-700 shadow-md scale-105' 
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-300'
            }`}
        >
            Mensual
        </button>
        <button 
            onClick={() => setBillingCycle('annually')} 
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 relative ${
                billingCycle === 'annually' 
                    ? 'bg-white dark:bg-slate-700 shadow-md scale-105' 
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-300'
            }`}
        >
            Anual
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg animate-pulse">
                -15%
            </span>
        </button>
    </div>
);

const FaqItem = ({ faq, isOpen, onClick }) => (
    <motion.div 
        className="border border-gray-200 dark:border-slate-700 rounded-xl p-6 bg-white dark:bg-slate-800/50 hover:shadow-md transition-shadow"
        initial={false}
    >
        <button 
            onClick={onClick} 
            className="w-full flex justify-between items-center text-left group"
        >
            <span className="text-lg font-semibold text-gray-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors pr-4">
                {faq.question}
            </span>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                isOpen 
                    ? 'bg-blue-100 dark:bg-blue-900/30' 
                    : 'bg-gray-100 dark:bg-slate-700 group-hover:bg-gray-200 dark:group-hover:bg-slate-600'
            }`}>
                {isOpen ? (
                    <MinusIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                ) : (
                    <PlusIcon className="w-5 h-5 text-gray-600 dark:text-slate-400" />
                )}
            </div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                >
                    <p className="text-gray-600 dark:text-slate-400 mt-4 leading-relaxed">
                        {faq.answer}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

const TrustBadge = ({ icon: Icon, title, description }) => (
    <div className="flex items-start space-x-3 p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h4>
            <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">{description}</p>
        </div>
    </div>
);

const ComparisonTable = ({ plans, billingCycle }) => {
    const [showComparison, setShowComparison] = useState(false);

    if (!showComparison) {
        return (
            <div className="text-center py-12">
                <button
                    onClick={() => setShowComparison(true)}
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 font-semibold hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm hover:shadow-md"
                >
                    <span>Ver tabla comparativa detallada</span>
                    <PlusIcon className="w-5 h-5 ml-2" />
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 mb-16"
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Comparación Detallada</h3>
                <button
                    onClick={() => setShowComparison(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300"
                >
                    <XCircleIcon className="w-6 h-6" />
                </button>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700">
                <table className="w-full bg-white dark:bg-slate-800">
                    <thead className="bg-gray-50 dark:bg-slate-900/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                Característica
                            </th>
                            {plans.map(plan => (
                                <th key={plan.id} className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                    {plan.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                        <tr className="bg-blue-50/50 dark:bg-blue-900/10">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                Timbres Fiscales
                            </td>
                            {plans.map(plan => (
                                <td key={plan.id} className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                    {plan.timbres > 0 ? plan.timbres.toLocaleString('es-MX') : 'N/A'}
                                </td>
                            ))}
                        </tr>
                        {comparisonFeatures.map((category, categoryIndex) => (
                            <React.Fragment key={categoryIndex}>
                                <tr className="bg-gray-100 dark:bg-slate-900/30">
                                    <td colSpan={plans.length + 1} className="px-6 py-3 text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                                        {category.category}
                                    </td>
                                </tr>
                                {category.items.map((item, itemIndex) => (
                                    <tr key={itemIndex} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-slate-300">
                                            {item}
                                        </td>
                                        {plans.map(plan => (
                                            <td key={plan.id} className="px-6 py-4 text-center">
                                                <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
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
    );
};

const Testimonial = ({ name, role, text, rating }) => (
    <motion.div
        className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
        whileHover={{ y: -5 }}
    >
        <div className="flex gap-1 mb-3">
            {[...Array(rating)].map((_, i) => (
                <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
            ))}
        </div>
        <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed mb-4">
            "{text}"
        </p>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {name.charAt(0)}
            </div>
            <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{name}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">{role}</p>
            </div>
        </div>
    </motion.div>
);

// --- COMPONENTE PRINCIPAL ---
function PlanSelection() {
    const { darkMode } = useThemeContext();
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = useState('annually');
    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch de planes desde la API
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/payments/plans');
                const data = await response.json();
                if (data.success) {
                    // Filtrar planes únicos basándose en el nombre
                    // Tomamos solo los planes con price_annually diferente de price_monthly
                    const uniquePlans = data.plans.reduce((acc, plan) => {
                        const existing = acc.find(p => p.name === plan.name);
                        if (!existing) {
                            acc.push(plan);
                        } else if (plan.price_annually !== plan.price_monthly && existing.price_annually === existing.price_monthly) {
                            // Reemplazar con el plan que tiene precios diferentes (anual)
                            const index = acc.findIndex(p => p.name === plan.name);
                            acc[index] = plan;
                        }
                        return acc;
                    }, []);
                    
                    setPlans(uniquePlans);
                } else {
                    throw new Error('No se pudieron cargar los planes.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handlePlanSelect = (plan) => {
    const featuresArray = Array.isArray(plan.features) ? plan.features : [];
    
    // Mantenemos tu cálculo de precio anual
    const annualPrice = plan.price_monthly * 12 * 0.85;

    const selectedOption = {
        // --- CORRECCIÓN CLAVE ---
        // Usamos el ID del plan que viene de la base de datos.
        // La página de pago espera recibir este ID.
        id: plan.id, 
        // --- FIN DE LA CORRECCIÓN ---
        
        product: plan.name,
        name: `Plan ${billingCycle === 'monthly' ? 'Mensual' : 'Anual'}`,
        price: billingCycle === 'annually' ? annualPrice : plan.price_monthly,
        period: billingCycle,
        features: featuresArray,
    };
    navigate('/payment', { state: { selectedPlan: selectedOption } });
};

    const testimonials = [
        {
            name: "María González",
            role: "CEO, Consultoría MG",
            text: "NextFactura simplificó completamente nuestro proceso de facturación. Ahora emitimos facturas en segundos.",
            rating: 5
        },
        {
            name: "Carlos Ramírez",
            role: "Contador, Despacho CR",
            text: "La mejor inversión que hemos hecho. El soporte es excelente y la plataforma muy intuitiva.",
            rating: 5
        },
        {
            name: "Ana Martínez",
            role: "Freelancer",
            text: "Como freelancer, necesitaba algo simple y eficiente. NextFactura superó mis expectativas.",
            rating: 5
        }
    ];

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gradient-to-b from-gray-50 to-white text-black'} py-12 sm:py-20 px-4 font-sans`}>
            <div className="container mx-auto max-w-7xl">
                {/* --- Hero Section --- */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4">
                            <SparklesIcon className="w-4 h-4 mr-2" />
                            Prueba gratis por 14 días
                        </span>
                        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mt-4">
                            Precios transparentes,<br />sin sorpresas.
                        </h1>
                        <p className="mt-6 text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            Elige el plan que se adapte al ritmo de tu negocio.<br />
                            <span className="font-semibold text-gray-700 dark:text-slate-300">Escala cuando lo necesites, cancela cuando quieras.</span>
                        </p>
                    </motion.div>
                    
                    <div className="mt-10">
                        <BillingToggle billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-3">
                            Ahorra hasta <span className="font-bold text-green-600 dark:text-green-400">$1,000 MXN</span> con facturación anual
                        </p>
                    </div>
                </div>

                {/* --- Trust Badges --- */}
                <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-16">
                    <TrustBadge
                        icon={ShieldCheckIcon}
                        title="100% Seguro"
                        description="Certificado por el SAT y cumplimiento fiscal garantizado"
                    />
                    <TrustBadge
                        icon={ClockIcon}
                        title="Sin Compromisos"
                        description="Cancela cuando quieras, sin penalizaciones"
                    />
                    <TrustBadge
                        icon={SparklesIcon}
                        title="Soporte Incluido"
                        description="Equipo técnico disponible para ayudarte"
                    />
                </div>

                {/* --- Renderizado Condicional --- */}
                {isLoading && <p className="text-center">Cargando planes...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                
                {!isLoading && !error && (
                    <>
                        <div className="grid lg:grid-cols-3 gap-8 items-start mb-8">
                            {plans.map((plan, index) => (
                                <motion.div
                                    key={plan.id}
                                    className={`relative w-full rounded-2xl p-8 transition-all duration-300 ${
                                        plan.isHighlighted
                                            ? 'border-2 border-blue-500 shadow-2xl bg-white dark:bg-slate-800 scale-105 lg:scale-110 z-10'
                                            : 'border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:shadow-lg'
                                    }`}
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -5 }}
                                >
                                    {plan.isHighlighted && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <span className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                                                <SparklesIcon className="w-3 h-3 mr-1" />
                                                {plan.tagline || 'MÁS POPULAR'}
                                            </span>
                                        </div>
                                    )}
                                    
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h2>
                                        <p className="text-sm text-gray-600 dark:text-slate-400 mt-2 h-12 flex items-center justify-center">
                                            {plan.description}
                                        </p>
                                    </div>
                                    
                                    <div className="text-center my-8 py-6 border-y border-gray-200 dark:border-slate-700">
                                        <div className="flex items-baseline justify-center">
                                            <span className="text-2xl font-semibold text-gray-500 dark:text-slate-400">$</span>
                                            <span className="text-5xl font-extrabold text-gray-900 dark:text-white mx-1">
                                                {(billingCycle === 'annually' 
                                                    ? (plan.price_monthly * 12 * 0.85) / 12 
                                                    : plan.price_monthly
                                                ).toFixed(0)}
                                            </span>
                                            <span className="text-xl text-gray-500 dark:text-slate-400">/mes</span>
                                        </div>
                                        {billingCycle === 'annually' && (
                                            <div className="mt-3">
                                                <p className="text-sm text-gray-600 dark:text-slate-400">
                                                    <span className="line-through">${(plan.price_monthly * 12).toLocaleString('es-MX')}</span>
                                                    {' '}
                                                    <span className="font-bold text-green-600 dark:text-green-400">
                                                        ${(plan.price_monthly * 12 * 0.85).toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                                                    </span>
                                                    {' '}al año
                                                </p>
                                                <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                                                    Ahorras ${((plan.price_monthly * 12) - (plan.price_monthly * 12 * 0.85)).toLocaleString('es-MX', { maximumFractionDigits: 0 })} MXN
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handlePlanSelect(plan)}
                                        className={`w-full py-4 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-md ${
                                            plan.isHighlighted
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl'
                                                : 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white ring-2 ring-blue-500 hover:bg-blue-50 dark:hover:bg-slate-600'
                                        }`}
                                    >
                                        Comenzar ahora
                                    </button>

                                    <ul className="mt-8 space-y-4 text-sm">
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 mt-0.5">
                                                <CheckIcon className="w-3 h-3 text-green-600 dark:text-green-400" />
                                            </div>
                                            <span className="text-gray-700 dark:text-slate-300">
                                                <strong className="font-semibold">{plan.timbres > 0 ? plan.timbres.toLocaleString('es-MX') : 'No incluye'}</strong> Timbres Fiscales mensuales
                                            </span>
                                        </li>
                                        {Array.isArray(plan.features) && plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start">
                                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-0.5">
                                                    <CheckIcon className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <span className="text-gray-700 dark:text-slate-300">{feature.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>

                        {/* --- Tabla Comparativa --- */}
                        <ComparisonTable plans={plans} billingCycle={billingCycle} />
                    </>
                )}

                {/* --- Sección de Testimonios --- */}
                <div className="my-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                            Miles de empresas confían en NextFactura
                        </h2>
                        <p className="text-gray-600 dark:text-slate-400">
                            Descubre por qué somos la opción #1 en facturación electrónica
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <Testimonial key={index} {...testimonial} />
                        ))}
                    </div>
                </div>

                {/* --- Sección de Garantía --- */}
                <div className="my-16 p-8 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 border border-blue-200 dark:border-slate-700 text-center">
                    <ShieldCheckIcon className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Garantía de Satisfacción de 30 Días
                    </h3>
                    <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Prueba NextFactura sin riesgos. Si no estás completamente satisfecho en los primeros 30 días, 
                        te devolvemos tu dinero sin preguntas. Así de simple.
                    </p>
                </div>

                {/* --- FAQ --- */}
                <div className="mt-24 max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                            Preguntas Frecuentes
                        </h2>
                        <p className="text-gray-600 dark:text-slate-400">
                            Todo lo que necesitas saber sobre nuestros planes y precios
                        </p>
                    </div>
                    
                    <div className="grid gap-4">
                        {faqData.map((faq, index) => (
                            <FaqItem
                                key={index}
                                faq={faq}
                                isOpen={expandedFAQ === index}
                                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                            />
                        ))}
                    </div>

                    {/* --- CTA Final --- */}
                    <div className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <h3 className="text-2xl font-bold mb-3">¿Aún tienes dudas?</h3>
                        <p className="mb-6 text-blue-100">
                            Nuestro equipo está listo para ayudarte a elegir el plan perfecto para tu negocio
                        </p>
                        <button className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                            Contactar a Ventas
                            <ArrowRightIcon className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlanSelection;