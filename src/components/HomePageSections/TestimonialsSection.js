// src/components/HomePageSections/TestimonialsSection.js
import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';

// Datos de testimonios mejorados con 'rating' y avatares de placeholder de alta calidad
const testimonialsData = [
  { 
    name: "Carlos Mendoza", 
    role: "Dueño, 'El Sazón Porteño'", 
    quote: "NextManager no solo automatizó mi facturación, me dio una visión clara de mi negocio que antes no tenía. La integración con SoftRestaurant es simplemente perfecta. Es una herramienta indispensable.", 
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop", // Usar imágenes de placeholder de alta calidad
    rating: 5 
  },
  { 
    name: "Laura Jiménez", 
    role: "Gerente de Operaciones, Grupo GQB", 
    quote: "Gestionamos 5 sucursales y la consolidación de reportes era una pesadilla. Con NextManager, tengo toda la información al instante y en un solo lugar. El ahorro en tiempo y errores es incalculable.", 
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop",
    rating: 5 
  },
  { 
    name: "Javier Ríos", 
    role: "Chef y Propietario, 'Cocina de Autor'", 
    quote: "Soy chef, no contador. La simplicidad de NextFactura para generar los comprobantes fiscales directamente desde la venta me ha quitado un peso enorme de encima. Funciona y punto.", 
    avatar: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=300&auto=format&fit=crop",
    rating: 4 
  }
];

// Componente de Tarjeta de Estrellas para reutilización
const StarRating = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
      />
    ))}
  </div>
);

/**
 * TestimonialsSection - Optimizada para generar confianza a través de la validación social.
 * * Estrategia de UX/UI:
 * 1.  Grid Estático en lugar de Carrusel: Se elimina el carrusel automático para respetar el ritmo del
 * usuario y permitirle escanear y leer todos los testimonios. Esto aumenta la confianza y la retención.
 * 2.  Diseño de Tarjeta Enriquecido: Cada testimonio se presenta en una tarjeta que incluye elementos de
 * alta confianza: foto de la persona, nombre, rol, la cita, y una calificación por estrellas para validación instantánea.
 * 3.  Animación de Entrada Individual: Cada tarjeta se anima al entrar en la vista (`whileInView`), creando
 * una presentación elegante y dinámica que guía la atención del usuario sin ser molesta.
 */
const TestimonialsSection = () => {
  const cardVariants = {
    offscreen: {
      opacity: 0,
      y: 50,
    },
    onscreen: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 0.8,
        delay: i * 0.15, // Delay escalonado para cada tarjeta
      },
    }),
  };

  return (
    <section id="testimonials" className="bg-gray-50 dark:bg-gray-800/50 py-24 sm:py-32">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            No confíes en nuestra palabra, confía en nuestros clientes
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Descubre por qué los dueños y gerentes de restaurantes eligen NextManager para llevar su negocio al siguiente nivel.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {testimonialsData.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="flex flex-col rounded-2xl bg-white dark:bg-gray-900 shadow-lg"
              custom={index}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
            >
              <div className="flex-1 p-8">
                <StarRating rating={testimonial.rating} />
                <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-b-2xl flex items-center gap-x-4">
                <img className="h-12 w-12 rounded-full bg-gray-50 object-cover" src={testimonial.avatar} alt={testimonial.name} />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
