// src/components/HomePageSections/Hero.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/solid'; // Icono para el CTA primario

/**
 * Hero Section - Optimizada para Máximo Impacto y Claridad
 * * Estrategia de UX/UI:
 * 1.  Mensaje Principal Único: Se elimina el carrusel de texto para presentar una Propuesta de Valor Única (PVU)
 * clara y contundente. El usuario capta el beneficio principal al instante.
 * 2.  Layout Asimétrico Moderno: Se utiliza un grid para separar el texto del área visual. Esto crea un
 * flujo de lectura natural (izquierda a derecha) y permite mostrar una imagen atractiva del producto en acción.
 * 3.  Jerarquía de CTAs: El botón principal ("Empieza Gratis") tiene mayor peso visual (color sólido) que el 
 * secundario ("Ver un Demo"), guiando al usuario hacia la acción de menor fricción.
 * 4.  Animaciones Sutiles: Las animaciones de entrada son escalonadas y suaves para dar una sensación
 * premium sin distraer.
 */
const Hero = () => {
  const navigate = useNavigate();

  const handlePrimaryAction = () => {
    // La acción de menor fricción. Lleva directamente al registro.
    navigate('/signup'); // Idealmente a una ruta de registro
  };

  const handleSecondaryAction = () => {
    // Acción secundaria. Lleva a una página para agendar una demostración.
    navigate('/demo'); // Idealmente a una ruta específica de demo
  };

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
    <section className="relative overflow-hidden bg-white dark:bg-gray-900">
      {/* Fondo de gradiente sutil y abstracto */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-black"></div>
      
      <div className="relative container mx-auto px-6 py-24 lg:py-32 min-h-screen flex items-center">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* --- Columna de Texto --- */}
          <div className="text-center lg:text-left">
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-gray-900 dark:text-white"
            >
              La gestión de tu restaurante,
              <span className="block text-blue-600 dark:text-blue-400">simplificada y potente.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0"
            >
              Automatiza tu facturación, analiza tus ventas y toma el control total. NextManager es la plataforma todo-en-uno que trabaja por ti.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={handlePrimaryAction}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300"
              >
                Empieza Gratis
                <ArrowRightIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleSecondaryAction}
                className="w-full sm:w-auto bg-transparent text-gray-700 dark:text-gray-200 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
              >
                Ver un Demo
              </button>
            </motion.div>
          </div>

          {/* --- Columna Visual --- */}
          <motion.div
            variants={itemVariants}
            className="hidden lg:block"
          >
            <div className="relative w-full h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border border-gray-200 dark:border-gray-700">
                {/* ÁREA PARA UN VISUAL DE ALTO IMPACTO:
                  - Idealmente, aquí va una captura de pantalla del dashboard de NextManager.
                  - O una animación/video corto mostrando la facilidad de uso.
                  - O una ilustración 3D que represente gestión, datos y eficiencia.
                  - Usaremos un placeholder con gradiente por ahora.
                */}
                <div className="w-full h-full rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                   <p className="text-gray-400 dark:text-gray-500 font-medium">[Visual Atractivo del Dashboard de NextManager]</p>
                </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
