// src/components/HomePageSections/CallToActionSection.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RocketLaunchIcon } from '@heroicons/react/24/solid'; // Icono temático para el CTA

/**
 * Call to Action (CTA) Section - Optimizada para Conversión
 * * Estrategia de UX/UI:
 * 1.  Enfoque Centralizado: A diferencia del Hero, esta sección utiliza un layout centrado para enfocar
 * toda la atención del usuario en un único mensaje y una acción clara.
 * 2.  Mensaje Directo y Orientado al Beneficio: El texto va al grano, reforzando el valor principal
 * y creando un sentido de urgencia o entusiasmo.
 * 3.  Consistencia Visual: El botón de CTA primario es idéntico en estilo al del Hero, reforzando
 * la acción principal de la marca y creando familiaridad.
 * 4.  Animaciones Coherentes: Se reutilizan las mismas variantes de animación ('container' e 'item')
 * para que la aparición de los elementos se sienta natural y parte del mismo flujo de la página.
 */
const CallToActionSection = () => {
  const navigate = useNavigate();

  const handlePrimaryAction = () => {
    // La acción principal debe ser consistente en toda la web.
    // Llevamos al usuario a la página de registro.
    navigate('/register');
  };

  // Reutilizamos las mismas definiciones de animación para mantener la consistencia
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Anima los hijos de forma escalonada
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      },
    },
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6 py-20 lg:py-24 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible" // La animación se activa cuando la sección entra en el viewport
          viewport={{ once: true, amount: 0.5 }} // Se anima una sola vez
          variants={containerVariants}
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter text-gray-900 dark:text-white"
          >
            ¿Listo para llevar tu negocio al <span className="text-blue-600 dark:text-blue-400">siguiente nivel</span>?
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Únete a la nueva generación de restaurantes inteligentes. Optimiza, crece y toma el control total con las herramientas que NextManager pone en tus manos.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10"
          >
            <button
              onClick={handlePrimaryAction}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300"
            >
              Comienza Ahora
              <RocketLaunchIcon className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default CallToActionSection;
