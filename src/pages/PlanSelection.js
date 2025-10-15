// src/pages/PlanSelection.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext';
import { CheckIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid';

// --- ESTRUCTURA DE DATOS REFACTORIZADA Y SIMPLIFICADA ---
// src/pages/PlanSelection.js



const faqData = [
    { question: '¿Puedo cambiar de plan más adelante?', answer: '¡Por supuesto! Puedes mejorar, bajar o cancelar tu plan en cualquier momento directamente desde tu panel de configuración. Queremos que uses lo que mejor se adapte a ti.' },
    { question: '¿Qué sucede cuando termina mi periodo de facturación?', answer: 'Tu plan se renovará automáticamente al final de cada ciclo (mensual o anual). Recibirás una notificación por correo antes de cada renovación.' },
    { question: '¿Hay algún costo de instalación o cargos ocultos?', answer: 'No. Nuestros precios son 100% transparentes. El precio que ves es el precio que pagas, sin sorpresas ni cargos adicionales de configuración.' },
    { question: '¿Qué métodos de pago aceptan?', answer: 'Aceptamos todas las principales tarjetas de crédito y débito a través de Mercado Pago, nuestra pasarela de pago segura y confiable.' },
];

// --- SUBCOMPONENTES DE UI ---

const BillingToggle = ({ billingCycle, setBillingCycle }) => (
    <div className="inline-flex items-center p-1 bg-gray-200 dark:bg-slate-800 rounded-full">
        <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${billingCycle === 'monthly' ? 'bg-white dark:bg-slate-700 shadow' : 'text-gray-600 dark:text-slate-400'}`}>
            Mensual
        </button>
        <button onClick={() => setBillingCycle('annually')} className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors relative ${billingCycle === 'annually' ? 'bg-white dark:bg-slate-700 shadow' : 'text-gray-600 dark:text-slate-400'}`}>
            Anual
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-green-500 rounded-full">AHORRA 15%</span>
        </button>
    </div>
);

const FaqItem = ({ faq, isOpen, onClick }) => (
    <div className="border-b border-gray-200 dark:border-slate-700 py-4">
        <button onClick={onClick} className="w-full flex justify-between items-center text-left">
            <span className="text-lg font-medium text-gray-800 dark:text-slate-200">{faq.question}</span>
            {isOpen ? <MinusIcon className="w-5 h-5 text-blue-500" /> : <PlusIcon className="w-5 h-5 text-gray-500" />}
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: '16px' }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    <p className="text-gray-600 dark:text-slate-400 pr-8">{faq.answer}</p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);


/**
 * PlanSelection - Rediseñada para máxima claridad, comparación y conversión.
 * * Estrategia de UX/UI:
 * 1.  Comparación Directa Lado a Lado: Se elimina el toggle "Individual/Combinado" y se presentan los
 * 3 planes principales en columnas. Esto permite al usuario comparar valor y características al instante.
 * 2.  Control de Precios Simplificado: Un único interruptor "Mensual/Anual" controla todos los precios,
 * reduciendo la carga cognitiva y destacando claramente la oferta de ahorro anual.
 * 3.  Valor Integrado: Las características de cada plan están listadas dentro de su tarjeta, conectando
 * directamente el precio con los beneficios que el usuario recibe.
 * 4.  Jerarquía Visual Clara: El plan recomendado ("Paquete Completo") se destaca visualmente con un
 * borde y una insignia, guiando suavemente al usuario hacia la opción de mayor valor.
 */
function PlanSelection() {
    const { darkMode } = useThemeContext();
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = useState('annually');
    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const [plans, setPlans] = useState([]); // Para guardar los planes de la API
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

   // src/pages/PlanSelection.js
   useEffect(() => {
    const fetchPlans = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/payments/plans');
            const data = await response.json();
            if (data.success) {
                setPlans(data.plans);
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
}, []); // El array vacío asegura que se ejecute solo una vez

const handlePlanSelect = (plan) => {
    // Aseguramos que 'features' sea un array, incluso si viene null o mal formateado
    const featuresArray = Array.isArray(plan.features) ? plan.features : [];

    const selectedOption = {
        id: billingCycle === 'annually' ? plan.mercadopagoId_annually : plan.mercadopagoId_monthly,
        product: plan.name,
        name: `Plan ${billingCycle === 'monthly' ? 'Mensual' : 'Anual'}`,
        price: billingCycle === 'annually' ? plan.price_annually : plan.price_monthly,
        period: billingCycle,
        features: featuresArray, // <-- Usamos el array seguro
    };
    navigate('/payment', { state: { selectedPlan: selectedOption } });
};
    return (
        <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-black'} py-16 sm:py-24 px-4 font-sans`}>
            <div className="container mx-auto max-w-7xl">
                {/* --- Encabezado y Toggle --- */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Precios transparentes, sin sorpresas.
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Elige el plan que se adapte al ritmo de tu negocio. Escala cuando lo necesites.
                    </p>
                    <div className="mt-8">
                        <BillingToggle billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
                    </div>
                </div>
                {isLoading && <p className="text-center">Cargando planes...</p>}
{error && <p className="text-center text-red-500">{error}</p>}
{!isLoading && !error && (
    <div className="grid lg:grid-cols-3 gap-8 items-start">
        {plans.map((plan) => (
            <motion.div
                key={plan.id}
                className={`w-full rounded-2xl p-8 border transition-all duration-300 ${
                    plan.isHighlighted
                        ? 'border-2 border-blue-500 shadow-2xl bg-white dark:bg-slate-800'
                        : 'border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/30'
                }`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: plan.isHighlighted ? 0 : 0.1 }}
            >
                {plan.isHighlighted && (
                    <div className="text-center mb-4">
                        <span className="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">{plan.tagline || 'MÁS POPULAR'}</span>
                    </div>
                )}
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">{plan.name}</h2>
                <p className="text-sm text-center text-gray-500 dark:text-slate-400 mt-2 h-10">{plan.description}</p>
                
                <div className="text-center my-8">
                    <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                        ${(plan[billingCycle === 'annually' ? 'price_annually' : 'price_monthly'] / (billingCycle === 'annually' ? 12 : 1)).toFixed(0)}
                    </span>
                    <span className="text-lg text-gray-500 dark:text-slate-400">/mes</span>
                    {billingCycle === 'annually' && <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Facturado anualmente por ${plan.price_annually}</p>}
                </div>

                <button
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                        plan.isHighlighted
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white ring-1 ring-blue-500 hover:bg-blue-50 dark:hover:bg-slate-600'
                    }`}
                >
                    Elegir Plan
                </button>

                <ul className="mt-8 space-y-4 text-sm">
    {/* Verificamos que plan.features sea un array antes de mapearlo */}
    {Array.isArray(plan.features) && plan.features.map((feature) => (
        <li key={feature.text} className="flex items-start">
            <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
            <span className="text-gray-700 dark:text-slate-300">{feature.text}</span>
        </li>
    ))}
</ul>
            </motion.div>
        ))}
    </div>
)}

                {/* --- Sección de FAQ --- */}
                <div className="mt-24 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Dudas Comunes Sobre los Planes</h2>
                    <div className="space-y-2">
                        {faqData.map((faq, index) => (
                            <FaqItem
                                key={index}
                                faq={faq}
                                isOpen={expandedFAQ === index}
                                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default PlanSelection;
