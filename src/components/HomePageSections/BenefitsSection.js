// src/components/HomePageSections/BenefitsSection.js
import React from 'react';
import { motion } from 'framer-motion';
import {
  ClockIcon, // Para Ahorro de tiempo
  ChartPieIcon, // Para decisiones con datos
  BoltIcon, // Para integración
  ShieldCheckIcon, // Para seguridad
  DevicePhoneMobileIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/solid';

// Los beneficios se re-enfocan en el RESULTADO para el cliente.
const mainBenefits = [
  {
    icon: ClockIcon,
    title: "Recupera tu Tiempo, Factura en Segundos",
    description: "Olvida los procesos manuales. NextManager se conecta con SoftRestaurant y automatiza la generación de facturas, liberando a tu equipo para que se enfoque en lo que realmente importa: tus clientes.",
    image: "/images/benefit-automation.png" // Reemplazar con una imagen real
  },
  {
    icon: ChartPieIcon,
    title: "Decisiones Inteligentes con Datos Claros",
    description: "Deja de adivinar. Nuestro dashboard te ofrece un panorama completo de tus ventas, tendencias y salud financiera. Identifica oportunidades y optimiza tus ganancias con reportes que entiendes.",
    image: "/images/benefit-dashboard.png" // Reemplazar con una imagen real
  },
  {
    icon: BoltIcon,
    title: "Integración Perfecta, Cero Fricción",
    description: "Diseñado por y para usuarios de SoftRestaurant. Nuestra integración es tan fluida que sentirás que es parte del mismo sistema. Sin configuraciones complejas ni dolores de cabeza.",
    image: "/images/benefit-integration.png" // Reemplazar con una imagen real
  }
];

const secondaryBenefits = [
    { icon: ShieldCheckIcon, title: "Seguridad Nivel Bancario" },
    { icon: DevicePhoneMobileIcon, title: "Gestión Desde Cualquier Lugar" },
    { icon: ArchiveBoxIcon, title: "Respaldo y Cumplimiento SAT" },
];

/**
 * BenefitsSection - Optimizada para comunicar valor real.
 * * Estrategia de UX/UI:
 * 1.  Beneficios sobre Características: El texto se reescribe para enfocarse en los resultados y
 * soluciones que el cliente obtiene (ej. "Ahorra tiempo" en lugar de "Facturación automática").
 * 2.  Jerarquía de Contenido: Se dividen los beneficios en 'principales' y 'secundarios'. Los principales
 * usan un layout de imagen + texto, capturando más atención y explicando el valor en profundidad.
 * 3.  Narrativa Visual: El layout alternado (imagen-derecha, imagen-izquierda) crea un ritmo visual
 * agradable y dinámico que mantiene al usuario enganchado mientras se desplaza.
 */
const BenefitsSection = () => {
  const cardVariants = {
    offscreen: { opacity: 0, y: 50 },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  return (
    <section id="benefits" className="bg-white dark:bg-gray-900 py-24 sm:py-32">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Todo lo que necesitas</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            No es solo un software, es tu centro de comando
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Hemos diseñado cada función pensando en los desafíos diarios de un restaurante. Esto es lo que NextManager hará por ti.
          </p>
        </div>

        {/* --- Beneficios Principales --- */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="space-y-20">
                {mainBenefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      className={`grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10 items-center ${index % 2 !== 0 ? 'lg:grid-flow-col-dense' : ''}`}
                      initial="offscreen"
                      whileInView="onscreen"
                      viewport={{ once: true, amount: 0.5 }}
                      variants={cardVariants}
                    >
                        <div className={`lg:col-start-1 ${index % 2 !== 0 ? 'lg:col-start-2' : ''}`}>
                            <div className="text-center lg:text-left">
                                <div className="inline-flex items-center gap-x-3">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                        <benefit.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{benefit.title}</h3>
                                </div>
                                <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                                    {benefit.description}
                                </p>
                            </div>
                        </div>
                        <div className={`mt-12 lg:mt-0 ${index % 2 !== 0 ? 'lg:col-start-1' : ''}`}>
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-xl h-80 flex items-center justify-center">
                                <img src={benefit.image} alt={benefit.title} className="object-cover rounded-2xl"/>
                                {/* <p className="text-gray-400">[Visual del Beneficio: {benefit.title}]</p> */}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* --- Otros Beneficios Importantes --- */}
        <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Y por supuesto, también obtienes:</h3>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {secondaryBenefits.map(benefit => (
                    <motion.div
                      key={benefit.title}
                      className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.5 }}
                    >
                        <benefit.icon className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{benefit.title}</p>
                    </motion.div>
                ))}
            </div>
        </div>

      </div>
    </section>
  );
};

export default BenefitsSection;
