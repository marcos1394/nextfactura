// src/components/HomePageSections/FaqSection.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QuestionMarkCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline'; // Usar outline para el icono base

const frequentQuestionsData = [
    { question: "¿Cómo funciona la integración con SoftRestaurant?", answer: "NextFactura se sincroniza automáticamente con tu sistema de punto de venta. Todos los datos de ventas se convierten en facturas electrónicas en tiempo real sin intervención manual." },
    { question: "¿Qué pasa si necesito soporte técnico?", answer: "Ofrecemos soporte técnico por correo electrónico y teléfono. Los planes semestral y anual incluyen soporte prioritario con tiempos de respuesta más rápidos." },
    { question: "¿Puedo probar NextFactura antes de comprar?", answer: "¡Claro! Ofrecemos una demo gratuita donde podrás explorar todas las funcionalidades de NextFactura y ver cómo puede transformar tu gestión." },
    { question: "¿Es seguro almacenar mis datos fiscales?", answer: "Utilizamos encriptación de última generación y cumplimos con todas las normativas de seguridad fiscal. Tus datos están 100% protegidos." }
];


const FaqSection = () => {
    const [activeQuestion, setActiveQuestion] = useState(null); // Índice de la pregunta activa

    const toggleQuestion = (index) => {
        setActiveQuestion(activeQuestion === index ? null : index);
    };

    return (
        <div id="faq" className="bg-white dark:bg-gray-900 py-16">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">Preguntas Frecuentes</h2>
                <div className="space-y-4">
                    {frequentQuestionsData.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={false} // Evita animación inicial en cada carga
                            animate={{ backgroundColor: activeQuestion === index ? "rgba(239, 246, 255, 1)" : "rgba(255, 255, 255, 1)" }} // Cambia color de fondo suavemente (ajusta para dark mode)
                            // dark:animate={{ backgroundColor: activeQuestion === index ? "rgba(31, 41, 55, 1)" : "rgba(17, 24, 39, 1)" }} // Dark mode background change
                            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                        >
                            <button
                                className="flex justify-between items-center w-full p-5 text-left text-lg font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none"
                                onClick={() => toggleQuestion(index)}
                                aria-expanded={activeQuestion === index}
                            >
                                <span className="flex items-center">
                                    <QuestionMarkCircleIcon className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                    {item.question}
                                </span>
                                <ChevronDownIcon
                                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${
                                        activeQuestion === index ? 'rotate-180' : 'rotate-0'
                                    }`}
                                />
                            </button>
                            {/* Panel de Respuesta Animado */}
                            <motion.div
                                initial={false} // Para que no anime al cargar la página
                                animate={activeQuestion === index ? "open" : "closed"}
                                variants={{
                                    open: { opacity: 1, height: 'auto', marginTop: '16px', marginBottom: '16px' },
                                    closed: { opacity: 0, height: 0, marginTop: '0px', marginBottom: '0px' }
                                }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                style={{ overflow: 'hidden' }} // Importante para la animación de altura
                            >
                                {/* Padding interno para la respuesta */}
                                <div className="px-5 pb-5">
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {item.answer}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FaqSection;