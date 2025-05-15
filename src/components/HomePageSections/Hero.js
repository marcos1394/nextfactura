// src/components/HomePageSections/Hero.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- Importar useNavigate
import { motion } from 'framer-motion';

const typingPhrases = [
  "Automatiza tu facturación con Nextechsolutions", // Podrías usar nextmanager.com.mx aquí? Revisa tu marca
  "Solución integral para restaurantes",
  "Conexión perfecta con SoftRestaurant",
  "Simplifica tu gestión de facturas"
];

const Hero = () => {
  const [activePhrase, setActivePhrase] = useState(0);
  const navigate = useNavigate(); // <--- Hook para navegación

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhrase((prev) => (prev + 1) % typingPhrases.length);
    }, 3000); // Cambia cada 3 segundos
    return () => clearInterval(interval);
  }, []); // No necesita dependencia activePhrase aquí

  // --- Función para manejar clic en botones CTA ---
  const handleStartClick = () => {
    // Navega a una ruta protegida (ej. /dashboard)
    // Si el usuario no está logueado, Authenticator aparecerá
    navigate('/dashboard');
  };

  return (
    // Contenedor con el fondo degradado (o puedes moverlo al HomePage si prefieres)
    <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-gray-900 dark:from-gray-900 dark:to-black dark:text-white transition-all duration-700">
      <div className="container mx-auto px-4 py-16 min-h-[70vh] flex items-center"> {/* Ajusta altura si es necesario */}
        {/* Podrías volver a un grid si quieres imagen/video al lado, o mantenerlo centrado */}
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <motion.h1
            key={activePhrase} // key ayuda a framer-motion a detectar el cambio
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight" // Ajusta tamaño de fuente
          >
            {typingPhrases[activePhrase]}
          </motion.h1>

          <p className="text-lg sm:text-xl text-gray-800 dark:text-gray-200 max-w-xl mx-auto">
            Solución completa de facturación electrónica diseñada específicamente para restaurantes que utilizan SoftRestaurant. {/* Revisa si este texto sigue siendo relevante para NextManager */}
          </p>

          {/* --- Botones CTA Modificados --- */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={handleStartClick} // Llama a la función de navegación
              className="w-full sm:w-auto bg-white text-blue-600 dark:bg-gray-100 dark:text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 dark:hover:bg-opacity-80 transition-all duration-300 shadow-lg text-lg"
            >
              Comenzar Ahora
            </button>
            {/* El botón Demo podría ir a otra página o también a /dashboard */}
            <button
               onClick={handleStartClick} // O cambiar a navigate('/demo') si tienes esa ruta
              className="w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 dark:hover:text-gray-900 transition-all duration-300 text-lg"
            >
              Solicitar Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;