// src/components/HomePageSections/SocialProofSection.js
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { BuildingStorefrontIcon, StarIcon, DocumentCheckIcon } from '@heroicons/react/24/solid';
import CountUp from 'react-countup';
import useOnScreen from '../../hooks/useOnScreen'; // Asumiendo que mueves el hook a /src/hooks/useOnScreen.js

// --- Mock Logos (reemplazar con los logos reales de tus clientes o socios) ---
// Idealmente, serían archivos SVG para una calidad perfecta.
const clientLogos = [
  { name: 'GastroGroup', path: '/logos/gastrogroup.svg' },
  { name: 'SaborMX', path: '/logos/sabormx.svg' },
  { name: 'El Fogon', path: '/logos/elfogon.svg' },
  { name: 'Mariscos Bahía', path: '/logos/mariscosbahia.svg' },
  { name: 'Pizza Nostra', path: '/logos/pizzanostra.svg' },
];

const socialProofMetrics = [
  { icon: BuildingStorefrontIcon, number: 500, label: "Restaurantes Potenciados", suffix: "+" },
  { icon: DocumentCheckIcon, number: 1200000, label: "Facturas Procesadas", suffix: "+", separator: "," },
  { icon: StarIcon, number: 4.9, label: "Calificación Promedio", suffix: "/5", decimals: 1 },
];

/**
 * SocialProofSection - Optimizada para generar máxima confianza.
 * * Estrategia de UX/UI:
 * 1.  Doble Capa de Confianza: Se combinan dos tipos de prueba social:
 * a) Logos de Clientes: La forma más directa y potente. Genera reconocimiento y credibilidad.
 * b) Métricas Cuantificables: Demuestran escala, experiencia y satisfacción del cliente de forma tangible.
 * 2.  Animación Condicional: El `CountUp` solo se activa cuando la sección es visible (`useOnScreen`),
 * enfocando la atención del usuario en el efecto y mejorando el rendimiento.
 * 3.  Diseño Limpio y Enfocado: Un fondo sutil (gris claro) hace que los logos y las métricas resalten,
 * evitando la distracción de un gradiente fuerte. El layout está ordenado y es fácil de escanear.
 */
const SocialProofSection = () => {
  const sectionRef = useRef(null);
  const isVisible = useOnScreen(sectionRef, { threshold: 0.3 });

  return (
    <section ref={sectionRef} className="bg-gray-50 dark:bg-gray-800/50 py-20">
      <div className="container mx-auto px-6">
        
        {/* --- Sección de Logos --- */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 tracking-widest">
            Con la confianza de los mejores restaurantes
          </h2>
          <div className="mt-8 flow-root">
            <div className="-m-2 flex flex-wrap justify-center gap-x-10 gap-y-6 lg:gap-x-16">
              {clientLogos.map((logo) => (
                <div key={logo.name} className="flex-shrink-0">
                   {/* Usa <img> para SVG o PNG. Ajusta la altura para un tamaño consistente */}
                  <img
                    className="h-8 md:h-10 object-contain"
                    src={logo.path}
                    alt={logo.name}
                    width="158"
                    height="48"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Sección de Métricas --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {socialProofMetrics.map(({ icon: Icon, number, label, suffix = "", decimals = 0, separator = "" }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 0.7, ease: 'easeOut' }}
              className="p-6"
            >
              <Icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                {isVisible ? (
                  <CountUp
                    start={0}
                    end={parseFloat(number)}
                    duration={2.75}
                    separator={separator}
                    decimals={decimals}
                    suffix={suffix}
                  />
                ) : (
                  <span>0{suffix}</span> // Muestra 0 antes de ser visible para evitar saltos de layout
                )}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// No olvides crear el Hook en /src/hooks/useOnScreen.js
// export default useOnScreen; (código del hook proporcionado anteriormente)

export default SocialProofSection;
