import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

// --- DATOS (con fotos reales de Unsplash) ---
const testimonialsData = [
  { 
    name: "Carlos Mendoza", 
    role: "Dueño, 'El Sazón Porteño'", 
    quote: "NextManager no solo automatizó mi facturación, me dio una visión clara de mi negocio que antes no tenía. La integración con SoftRestaurant es simplemente perfecta. Es una herramienta indispensable.", 
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop", 
    rating: 5 
  },
  { 
    name: "Laura Jiménez", 
    role: "Gerente de Operaciones, Grupo GQB", 
    quote: "Gestionamos 5 sucursales y la consolidación de reportes era una pesadilla. Con NextManager, tengo toda la información al instante y en un solo lugar. El ahorro en tiempo es incalculable.", 
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop",
    rating: 5 
  },
  { 
    name: "Javier Ríos", 
    role: "Chef Propietario, 'Cocina de Autor'", 
    quote: "Soy chef, no contador. La simplicidad de la plataforma para generar los comprobantes fiscales directamente desde la venta me ha quitado un peso enorme de encima. Funciona y punto.", 
    avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=256&auto=format&fit=crop",
    rating: 4 
  }
];

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 fill-current ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
      />
    ))}
  </div>
);

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="bg-white dark:bg-gray-900 py-24 sm:py-32 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative">
        
        {/* Elemento decorativo de fondo */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-5 dark:opacity-5 pointer-events-none">
            <Quote className="w-96 h-96 text-gray-900 dark:text-white transform rotate-12" />
        </div>

        <div className="mx-auto max-w-2xl text-center mb-16 relative z-10">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Historias de éxito reales
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Descubre por qué cientos de restaurantes confían en nosotros.
          </p>
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonialsData.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="flex flex-col justify-between bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                    <StarRating rating={testimonial.rating} />
                    <Quote className="w-8 h-8 text-blue-100 dark:text-blue-900/30" />
                </div>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 italic mb-8">
                  "{testimonial.quote}"
                </p>
              </div>
              
              <div className="flex items-center gap-x-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                <img 
                    className="h-12 w-12 rounded-full bg-gray-50 object-cover ring-2 ring-white dark:ring-gray-700" 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
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