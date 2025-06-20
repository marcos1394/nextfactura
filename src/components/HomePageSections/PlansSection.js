// src/components/HomePageSections/PlansSection.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

// Estructura de datos SIMPLIFICADA y orientada a la comparación.
const plansData = [
  {
    name: 'NexFactura',
    id: 'plan_factura',
    description: 'Ideal para quienes solo necesitan facturación automática y eficiente.',
    price: { monthly: 450, annually: 4150 },
    features: [
      'Hasta 200 facturas/mes',
      'Integración con SoftRestaurant',
      'Portal de auto-facturación para clientes',
      'Generación de reportes simples',
      'Soporte por correo',
    ],
    highlight: false,
  },
  {
    name: 'NextManager',
    id: 'plan_manager',
    description: 'Perfecto para gerentes que buscan análisis y control total de sus ventas.',
    price: { monthly: 430, annually: 3950 },
    features: [
      'Dashboard de ventas en tiempo real',
      'Análisis de tendencias y productos',
      'Exportación de datos avanzada',
      'Alertas de rendimiento',
      'Soporte prioritario',
    ],
    highlight: false,
  },
  {
    name: 'Paquete Completo',
    id: 'plan_completo',
    description: 'La solución definitiva. Todo el poder de facturación y gestión en un solo lugar.',
    price: { monthly: 800, annually: 7500 }, // El precio mensual es una oferta combinada
    features: [
      'Todo lo de NexFactura y NextManager',
      'Facturación ilimitada',
      'Reportes ejecutivos y predictivos',
      'Sesión de capacitación inicial',
      'Soporte Premium 24/7',
    ],
    highlight: true,
  },
];

// Componente para el interruptor Mensual/Anual
const BillingToggle = ({ billingCycle, setBillingCycle }) => (
    <div className="flex justify-center items-center space-x-4">
        <span className={`font-medium ${billingCycle === 'monthly' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>Mensual</span>
        <div 
            className="relative w-14 h-8 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer p-1 flex items-center"
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annually' : 'monthly')}
        >
            <motion.div 
                className="w-6 h-6 bg-white rounded-full shadow-md"
                layout 
                transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                initial={false}
                animate={{ x: billingCycle === 'monthly' ? 0 : 24 }}
            />
        </div>
        <span className={`font-medium ${billingCycle === 'annually' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
            Anual <span className="text-sm text-green-600 font-semibold">(Ahorra ~15%)</span>
        </span>
    </div>
);


/**
 * PlansSection - Rediseñada para una toma de decisión fácil y rápida.
 * * Estrategia de UX/UI:
 * 1.  Comparación Directa: El layout de 3 columnas es el estándar de la industria porque funciona.
 * Permite al usuario comparar características y precios de un vistazo, reduciendo la carga cognitiva.
 * 2.  Control Único y Simple: Se reemplaza la selección anidada por un solo interruptor "Mensual/Anual".
 * Esta simplicidad hace la interfaz increíblemente intuitiva.
 * 3.  Guía Visual (Highlight): El plan más recomendado se destaca visualmente para guiar al usuario
 * hacia la mejor oferta de valor, simplificando aún más su decisión.
 * 4.  Precios Claros y Justificados: El precio se muestra de forma prominente, y las características con
 * íconos de check justifican ese valor de manera clara y escaneable.
 */
const PlansSection = () => {
  const [billingCycle, setBillingCycle] = useState('annually'); // Anual por defecto para mostrar el ahorro
  const navigate = useNavigate();

  const handleSelectPlan = (planId) => {
    // Redirige al flujo de registro, pasando el plan y el ciclo seleccionados
    navigate(`/signup?plan=${planId}&cycle=${billingCycle}`);
  };

  return (
    <section id="plans" className="bg-white dark:bg-gray-900 py-24 sm:py-32">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Planes transparentes para cada necesidad
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Sin costos ocultos. Elige el plan que impulsa tu crecimiento y empieza hoy mismo.
          </p>
        </div>

        <div className="mt-16 flex justify-center">
          <BillingToggle billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
        </div>

        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {plansData.map((plan) => (
            <motion.div
              key={plan.id}
              className={`rounded-3xl p-8 ring-1 ${plan.highlight ? 'bg-gray-50 dark:bg-gray-800/50 ring-2 ring-blue-600' : 'ring-gray-200 dark:ring-gray-700'}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-semibold leading-8 text-gray-900 dark:text-white">{plan.name}</h3>
              <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">{plan.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                  ${billingCycle === 'monthly' ? plan.price.monthly : Math.floor(plan.price.annually / 12)}
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">/mes</span>
              </p>
              <p className="text-xs text-gray-500">
                {billingCycle === 'annually' && `Facturado anualmente por $${plan.price.annually} MXN`}
              </p>
              <button
                onClick={() => handleSelectPlan(plan.id)}
                aria-label={`Seleccionar el plan ${plan.name}`}
                className={`mt-6 block w-full rounded-md px-3 py-3 text-center text-lg font-semibold leading-6 ${plan.highlight ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-500' : 'text-blue-600 ring-1 ring-inset ring-blue-200 hover:ring-blue-300 dark:text-blue-400 dark:ring-blue-700 dark:hover:ring-blue-600'}`}
              >
                Elegir Plan
              </button>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon className="h-6 w-5 flex-none text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    {feature}
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
