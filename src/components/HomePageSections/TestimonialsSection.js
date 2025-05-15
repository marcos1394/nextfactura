// src/components/HomePageSections/TestimonialsSection.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const testimonialsData = [
  { name: "Carlos Mendoza", role: "Dueño de Restaurante", quote: "NextFactura transformó completamente nuestra gestión administrativa. Facturo en segundos.", avatar: "/images/ejemplo1.jpg" }, // Usa rutas relativas a /public o importa imágenes
  { name: "María Rodríguez", role: "Gerente Financiera", quote: "La integración con SoftRestaurant es perfecta. Reportes precisos y eficientes.", avatar: "/images/ejemplo3.jpg" },
  { name: "Juan González", role: "Consultor Tecnológico", quote: "Entiende las necesidades de los restaurantes. Seguridad y actualizaciones excepcionales.", avatar: "/images/ejemplo2.jpg" }
];
// Asegúrate de que las imágenes en /public/images/ existan o importa las imágenes directamente:
// import avatar1 from '../../assets/images/ejemplo1.jpg'; // Ejemplo de importación

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Carrusel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonialsData.length);
    }, 5000); // Cambia cada 5 segundos
    return () => clearInterval(interval);
  }, []); // Solo se ejecuta al montar

  return (
    <div id="testimonials" className="bg-gray-100 dark:bg-gray-800 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Lo Que Dicen Nuestros Clientes</h2>
        <div className="max-w-2xl mx-auto relative overflow-hidden min-h-[250px]"> {/* Añadir altura mínima */}
          {/* Usamos AnimatePresence para manejar la salida */}
          <motion.div
            key={activeTestimonial} // Cambiar la key fuerza la re-renderización con animación
            initial={{ opacity: 0, x: 100 }} // Entra desde la derecha
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }} // Sale hacia la izquierda
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg text-center absolute top-0 left-0 w-full" // Posición absoluta para superponer
          >
            <p className="italic text-lg md:text-xl mb-6 text-gray-700 dark:text-gray-300">"{testimonialsData[activeTestimonial].quote}"</p>
            <div className="flex items-center justify-center space-x-4">
              <img
                // src={avatar1} // Ejemplo si importas la imagen
                src={testimonialsData[activeTestimonial].avatar} // O usas la ruta pública
                alt={testimonialsData[activeTestimonial].name}
                className="w-14 h-14 rounded-full shadow-md object-cover" // Ajusta tamaño/estilo
              />
              <div>
                <h4 className="font-semibold text-blue-600 dark:text-blue-400">{testimonialsData[activeTestimonial].name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{testimonialsData[activeTestimonial].role}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navegación con Puntos */}
        <div className="flex justify-center mt-6 space-x-3">
          {testimonialsData.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTestimonial(index)}
              aria-label={`Ver testimonio ${index + 1}`}
              className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                activeTestimonial === index
                  ? 'bg-blue-600 scale-125'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;