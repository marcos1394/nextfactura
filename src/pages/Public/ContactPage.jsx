import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, 
    Mail, 
    Phone, 
    MapPin, 
    MessageSquare, 
    CheckCircle2, 
    Loader2,
    ArrowRight
} from 'lucide-react';

// --- SUBCOMPONENTES ---

const ContactInput = ({ label, id, type = "text", required = false, placeholder }) => (
    <div className="space-y-1.5">
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input 
            type={type} 
            id={id} 
            required={required}
            placeholder={placeholder}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
        />
    </div>
);

const ContactTextArea = ({ label, id, required = false, placeholder }) => (
    <div className="space-y-1.5">
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea 
            id={id} 
            rows="5" 
            required={required}
            placeholder={placeholder}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none"
        ></textarea>
    </div>
);

const InfoCard = ({ icon: Icon, title, description, action, href }) => (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm mt-1 mb-3 leading-relaxed">
                {description}
            </p>
            <a 
                href={href} 
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
            >
                {action} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
        </div>
    </div>
);

// --- COMPONENTE PRINCIPAL ---

function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulación de envío a API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsSubmitting(false);
        setIsSent(true);
        // e.target.reset(); // Opcional: limpiar si no ocultamos el form
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300 font-sans">
            
            {/* Header Section */}
            <section className="relative py-20 bg-gray-50 dark:bg-slate-950 overflow-hidden">
                <div className="absolute inset-0 opacity-10 dark:opacity-20" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4">
                        Soporte & Ventas
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                        Hablemos. Estamos aquí para ayudar.
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Ya sea que tengas dudas sobre nuestros planes, necesites soporte técnico o quieras una demo personalizada.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Columna Izquierda: Formulario */}
                    <div className="lg:col-span-7">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 p-8 sm:p-10">
                            <AnimatePresence mode="wait">
                                {!isSent ? (
                                    <motion.form 
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSubmit} 
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                                                <MessageSquare className="w-6 h-6" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Envíanos un mensaje</h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <ContactInput id="name" label="Nombre" placeholder="Tu nombre" required />
                                            <ContactInput id="email" label="Correo Electrónico" type="email" placeholder="hola@empresa.com" required />
                                        </div>
                                        
                                        <ContactInput id="subject" label="Asunto" placeholder="¿En qué podemos ayudarte?" required />
                                        
                                        <ContactTextArea id="message" label="Mensaje" placeholder="Cuéntanos más detalles..." required />

                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Enviando...
                                                </>
                                            ) : (
                                                <>
                                                    Enviar Mensaje <Send className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>
                                    </motion.form>
                                ) : (
                                    <motion.div 
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-16 px-4"
                                    >
                                        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
                                            <CheckCircle2 className="w-12 h-12" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">¡Mensaje Recibido!</h2>
                                        <p className="text-gray-600 dark:text-slate-300 text-lg mb-8">
                                            Gracias por contactarnos. Nuestro equipo revisará tu mensaje y te responderá a la brevedad posible.
                                        </p>
                                        <button 
                                            onClick={() => setIsSent(false)}
                                            className="px-6 py-2 text-blue-600 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                        >
                                            Enviar otro mensaje
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Columna Derecha: Información */}
                    <div className="lg:col-span-5 space-y-6 pt-4 lg:pt-0">
                        <InfoCard 
                            icon={Mail}
                            title="Correo Electrónico"
                            description="Ideal para consultas detalladas o envío de documentos. Tiempo de respuesta promedio: < 2 horas."
                            action="soporte@nextmanager.com.mx"
                            href="mailto:soporte@nextmanager.com.mx"
                        />
                        
                        <InfoCard 
                            icon={Phone}
                            title="Línea Directa"
                            description="¿Asunto urgente? Llámanos. Disponible de Lunes a Viernes de 9:00 AM a 6:00 PM."
                            action="614-215-20-82"
                            href="tel:614-215-2082"
                        />

                        <div className="p-6 rounded-2xl bg-gray-900 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <MapPin className="w-24 h-24" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 relative z-10">Oficinas Centrales</h3>
                            <p className="text-gray-300 text-sm leading-relaxed relative z-10">
                                Av. Tecnológico #1234<br/>
                                Col. Centro, CP 31000<br/>
                                Chihuahua, Chih. México
                            </p>
                            <div className="mt-6 pt-6 border-t border-gray-700 relative z-10">
                                <p className="text-xs text-gray-400">
                                    ¿Eres cliente Enterprise? Contacta a tu gerente de cuenta dedicado.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ContactPage;