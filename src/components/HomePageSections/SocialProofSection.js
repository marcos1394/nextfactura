// src/components/HomePageSections/SocialProofSection.js
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { UsersIcon, StarIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import CountUp from 'react-countup';

const socialProofData = [
  { icon: UsersIcon, number: "5000", label: "Restaurantes Atendidos", suffix: "+" },
  { icon: StarIcon, number: "4.8", label: "Calificación de Usuarios", suffix: "/5", decimals: 1 },
  { icon: DocumentTextIcon, number: "1000000", label: "Facturas Generadas", suffix: "+", separator: "," }
];

// Hook para detectar si un elemento está visible (puedes moverlo a /hooks si lo usas más)
const useOnScreen = (ref, threshold = 0.5) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold }
    );
    const currentRef = ref.current; // Captura el valor actual
    if (currentRef) {
        observer.observe(currentRef);
    }
    return () => {
        if (currentRef) {
            observer.unobserve(currentRef);
        }
    };
  }, [ref, threshold]); // Asegúrate de que ref y threshold estén en las dependencias

  return isIntersecting;
};


const SocialProofSection = () => {
  const sectionRef = useRef(null);
  const isVisible = useOnScreen(sectionRef); // Detecta si la sección es visible

  return (
    <div ref={sectionRef} className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-gray-800 dark:to-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-white">
          {socialProofData.map(({ icon: Icon, number, label, suffix = "", decimals = 0, separator = "" }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}} // Anima solo si es visible
              transition={{ delay: index * 0.2 + 0.2, duration: 0.6 }} // Pequeño delay base
              className="p-6 bg-white/10 dark:bg-gray-700/30 rounded-xl shadow-lg backdrop-blur-sm"
            >
              <Icon className="w-16 h-16 text-white mx-auto mb-4 opacity-90" />
              <h3 className="text-4xl font-bold mb-2">
                {/* CountUp se activa cuando isVisible es true */}
                {isVisible && (
                  <CountUp
                    start={0}
                    end={parseFloat(number)}
                    duration={2.5}
                    separator={separator}
                    decimals={decimals}
                    suffix={suffix}
                  />
                )}
                {!isVisible && <span>{number}{suffix}</span> /* Muestra número estático si no es visible */}
              </h3>
              <p className="opacity-80">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialProofSection;