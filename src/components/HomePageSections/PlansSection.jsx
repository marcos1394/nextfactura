import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plansData = [
  {
    name: 'Básico',
    id: 'plan_factura',
    tagline: 'Para empezar',
    description: 'Facturación simple y rápida para negocios pequeños.',
    price: { monthly: 450, annually: 4150 },
    features: [
      '200 facturas/mes',
      'Integración SoftRestaurant',
      'Portal de clientes básico',
      'Soporte por email',
    ],
    highlight: false,
  },
  {
    name: 'Pro',
    id: 'plan_completo', // ID que coincide con tu backend
    tagline: 'Más Popular',
    description: 'La suite completa para negocios en crecimiento.',
    price: { monthly: 800, annually: 7500 },
    features: [
      'Facturación ilimitada',
      'Dashboard en tiempo real',
      'Reportes avanzados',
      'Soporte prioritario 24/7',
      'Portal personalizado',
    ],
    highlight: true,
  },
  {
    name: 'Manager',
    id: 'plan_manager',
    tagline: 'Control total',
    description: 'Analítica avanzada para gerentes exigentes.',
    price: { monthly: 430, annually: 3950 },
    features: [
      'Análisis de tendencias',
      'Alertas de inventario',
      'Exportación a Excel/PDF',
      'Múltiples usuarios',
    ],
    highlight: false,
  },
];

const BillingToggle = ({ billingCycle, setBillingCycle }) => (
  <div className="relative inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full border border-gray-200 dark:border-gray-700">
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

const PlansSection = () => {
  const [billingCycle, setBillingCycle] = useState('annually');
  const navigate = useNavigate();

  const handleSelectPlan = () => {
    // Llevamos al usuario al registro genérico, 
    // la selección real ocurre dentro de la app o en la página /plans dedicada
    navigate('/register');
  };

  return (
    <section id="plans" className="py-24 sm:py-32 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
            Planes transparentes
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Sin costos ocultos. Comienza gratis y escala cuando lo necesites.
          </p>
          <BillingToggle billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
        </div>

        {/* Grid de Planes */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plansData.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`relative flex flex-col p-8 rounded-3xl ${
                plan.highlight 
                  ? 'bg-gray-900 dark:bg-gray-800 text-white shadow-2xl scale-105 z-10' 
                  : 'bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg">
                    <Sparkles className="w-3 h-3" /> Recomendado
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className={`text-sm mt-2 ${plan.highlight ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">
                  ${billingCycle === 'monthly' ? plan.price.monthly : Math.floor(plan.price.annually / 12)}
                </span>
                <span className={`text-sm font-semibold ${plan.highlight ? 'text-gray-400' : 'text-gray-500'}`}>/mes</span>
              </div>

              <button
                onClick={handleSelectPlan}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Comenzar Prueba Gratis
              </button>

              <ul className="mt-8 space-y-4 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <div className={`p-0.5 rounded-full ${plan.highlight ? 'bg-blue-500/20 text-blue-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className={plan.highlight ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PlansSection;