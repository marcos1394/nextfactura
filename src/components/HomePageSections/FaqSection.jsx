import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, ArrowRight } from 'lucide-react';

const frequentQuestionsData = [
  { 
    question: "¿La instalación es complicada?", 
    answer: "Para nada. Es una solución en la nube (SaaS), por lo que no necesitas instalar servidores. Solo descargas un pequeño agente que conecta tu SoftRestaurant con nuestra nube en minutos." 
  },
  { 
    question: "¿Qué tan seguros están mis datos?", 
    answer: "Usamos encriptación de nivel bancario (SSL de 256 bits) y servidores redundantes. Tus datos fiscales y de ventas están blindados y respaldados automáticamente todos los días." 
  },
  { 
    question: "¿Puedo cambiar de plan más adelante?", 
    answer: "Sí, en cualquier momento. Puedes subir de plan si necesitas más funciones o bajar si tu operación cambia. Todo desde tu panel de administración, sin llamadas molestas." 
  },
  { 
    question: "¿Qué pasa si se va el internet en mi restaurante?", 
    answer: "El agente local guarda la información y la sincroniza automáticamente en cuanto regresa la conexión. Tu operación local nunca se detiene." 
  },
  {
    question: "¿Facturan automáticamente?",
    answer: "Sí. Puedes configurar reglas para que las facturas de cierre de día o de clientes recurrentes se generen y envíen sin que tú muevas un dedo."
  }
];

const FaqSection = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <section id="faq" className="bg-gray-50 dark:bg-gray-900 py-24 sm:py-32 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mb-6">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Preguntas Frecuentes
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Todo lo que necesitas saber para tomar la decisión correcta.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {frequentQuestionsData.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${
                activeQuestion === index 
                  ? 'bg-white dark:bg-gray-800 border-blue-500 shadow-lg' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
                aria-expanded={activeQuestion === index}
              >
                <span className={`text-lg font-semibold transition-colors ${
                  activeQuestion === index ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                }`}>
                  {item.question}
                </span>
                <span className={`ml-6 flex-shrink-0 transition-transform duration-300 ${activeQuestion === index ? 'rotate-180' : ''}`}>
                  {activeQuestion === index ? (
                    <Minus className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-400" />
                  )}
                </span>
              </button>

              <AnimatePresence>
                {activeQuestion === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-base leading-relaxed text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 pt-4">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Footer / Contacto */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400">¿No encontraste lo que buscabas?</p>
          <a href="/contact" className="mt-2 inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            Contactar a Soporte <ArrowRight className="ml-2 w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};

export default FaqSection;