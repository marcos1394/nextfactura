// src/components/HomePageSections/FaqSection.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';

// Preguntas más estratégicas que abordan objeciones comunes de venta.
const frequentQuestionsData = [
  { 
    question: "¿La instalación es complicada o requiere de un técnico?", 
    answer: "Para nada. La configuración inicial es guiada y toma menos de 15 minutos. Si te conectas a SoftRestaurant, nuestro sistema lo detecta y la integración es prácticamente automática. ¡No necesitas ser un experto en tecnología!" 
  },
  { 
    question: "¿Qué tan seguro están mis datos fiscales y de ventas?", 
    answer: "La seguridad es nuestra máxima prioridad. Utilizamos encriptación de extremo a extremo (la misma que usan los bancos), servidores seguros y cumplimos con todas las normativas del SAT. Tus datos están 100% protegidos y respaldados." 
  },
  { 
    question: "¿Puedo cambiar de plan o cancelar en cualquier momento?", 
    answer: "Sí. Eres libre de mejorar tu plan o cancelarlo cuando quieras, sin penalizaciones ni contratos forzosos. Queremos que te quedes por el valor que te damos, no por una obligación contractual." 
  },
  { 
    question: "¿Qué tipo de soporte recibiré si tengo un problema?", 
    answer: "Todos nuestros planes incluyen soporte, pero la prioridad varía. El plan Completo te da acceso a nuestro equipo premium 24/7. Nuestro objetivo es resolver cualquier duda o problema en el menor tiempo posible para que tu operación nunca se detenga." 
  },
  {
    question: "¿El portal de auto-facturación es fácil de usar para mis clientes?",
    answer: "Sí, está diseñado para ser extremadamente intuitivo. Tu cliente solo necesita escanear un QR o introducir los datos de su ticket y obtendrá su factura al instante. Mejora la experiencia de tu cliente y te libera de trabajo administrativo."
  }
];

/**
 * FaqSection - Optimizada para resolver dudas y construir confianza final.
 * * Estrategia de UX/UI:
 * 1.  Manejo Proactivo de Objeciones: Las preguntas están diseñadas para responder a las dudas clave
 * que un cliente tiene antes de comprar (seguridad, facilidad de uso, compromiso), eliminando barreras a la conversión.
 * 2.  Iconografía Explícita: El uso de íconos +/- es más claro que una flecha. El estado (abierto/cerrado)
 * es inconfundible, mejorando la usabilidad.
 * 3.  Animación Fluida: `AnimatePresence` y variantes de `motion` bien definidas crean una apertura y
 * cierre del acordeón suave y satisfactorio, lo que transmite calidad.
 * 4.  Válvula de Escape (Escape Hatch): El CTA final de "Contáctanos" es una red de seguridad que le
 * dice al usuario "incluso si no resolvimos tu duda aquí, estamos para ayudarte", generando confianza.
 */
const FaqSection = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <section id="faq" className="bg-white dark:bg-gray-900 py-24 sm:py-32">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Resolvemos tus dudas
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Todo lo que necesitas saber para tomar la mejor decisión con total confianza.
          </p>
        </div>
        <div className="mt-16">
          <dl className="space-y-4">
            {frequentQuestionsData.map((item, index) => (
              <div key={item.question} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <dt>
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="flex w-full items-start justify-between p-6 text-left text-gray-900 dark:text-white"
                    aria-expanded={activeQuestion === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="text-base font-semibold leading-7">{item.question}</span>
                    <span className="ml-6 flex h-7 items-center">
                      {activeQuestion === index ? (
                        <MinusIcon className="h-6 w-6" aria-hidden="true" />
                      ) : (
                        <PlusIcon className="h-6 w-6" aria-hidden="true" />
                      )}
                    </span>
                  </button>
                </dt>
                <AnimatePresence initial={false}>
                  {activeQuestion === index && (
                    <motion.dd
                      id={`faq-answer-${index}`}
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { opacity: 1, height: 'auto' },
                        collapsed: { opacity: 0, height: 0 },
                      }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <p className="text-base leading-7 text-gray-600 dark:text-gray-300">{item.answer}</p>
                      </div>
                    </motion.dd>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-16 text-center border-t border-gray-200 dark:border-gray-700 pt-8">
            <p className="text-gray-700 dark:text-gray-300">¿No encuentras la respuesta que buscas?</p>
            <a href="/contact" className="mt-2 inline-block text-lg font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500">
                Contacta a nuestro equipo de soporte &rarr;
            </a>
        </div>

      </div>
    </section>
  );
};

export default FaqSection;
