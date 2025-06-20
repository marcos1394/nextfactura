// src/pages/ContactPage.js
import React from 'react';
import { PaperAirplaneIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid';

function ContactPage() {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Mensaje enviado (simulado). ¡Gracias por contactarnos!');
        e.target.reset();
    };

    return (
        <div className="bg-white dark:bg-slate-900/50 min-h-full">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="text-center mb-12">
                     <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Ponte en Contacto</h1>
                     <p className="mt-2 text-lg text-gray-600 dark:text-slate-300">Nuestro equipo está listo para responder tus preguntas.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    {/* Formulario de Contacto */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Nombre Completo</label>
                            <input type="text" id="name" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-slate-800"/>
                        </div>
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Correo Electrónico</label>
                            <input type="email" id="email" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-slate-800"/>
                        </div>
                         <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Tu Mensaje</label>
                            <textarea id="message" rows="5" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-slate-800"></textarea>
                        </div>
                        <button type="submit" className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                            Enviar Mensaje <PaperAirplaneIcon className="w-5 h-5"/>
                        </button>
                    </form>
                    
                    {/* Información de Contacto Alternativa */}
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <EnvelopeIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mt-1"/>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vía Correo Electrónico</h3>
                                <p className="text-gray-600 dark:text-slate-400">La mejor opción para preguntas detalladas. Te responderemos en menos de 24 horas.</p>
                                <a href="mailto:soporte@nextmanager.com.mx" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">soporte@nextmanager.com.mx</a>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <PhoneIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mt-1"/>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vía Telefónica</h3>
                                <p className="text-gray-600 dark:text-slate-400">Para asuntos urgentes, llámanos de Lunes a Viernes de 9am a 6pm.</p>
                                <a href="tel:614-215-2082" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">614-215-20-82</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;
