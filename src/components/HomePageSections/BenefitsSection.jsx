import React from 'react';
import { motion } from 'framer-motion';
import { 
    Clock, 
    PieChart, 
    Zap, 
    ShieldCheck, 
    Smartphone, 
    FileCheck, 
    ArrowRight 
} from 'lucide-react';

// --- DATOS DE BENEFICIOS ---
const mainBenefits = [
    {
        icon: Clock,
        title: "Recupera tu Tiempo",
        headline: "Factura en segundos, no en horas.",
        description: "Olvida la captura manual de datos. NextManager se conecta directamente con tu punto de venta para generar facturas al instante con un solo clic. Tu equipo lo agradecerá.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop", 
        color: "blue"
    },
    {
        icon: PieChart,
        title: "Inteligencia de Negocios",
        headline: "Decisiones basadas en datos reales.",
        description: "Deja de adivinar. Nuestro dashboard te ofrece un panorama claro de tus ventas, productos estrella y tendencias financieras. Convierte datos en estrategias ganadoras.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        color: "indigo"
    },
    {
        icon: Zap,
        title: "Integración sin Fricción",
        headline: "Funciona con lo que ya usas.",
        description: "Diseñado específicamente para complementar SoftRestaurant. La instalación es cuestión de minutos y la sincronización es invisible. Sin configuraciones técnicas complejas.",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop",
        color: "purple"
    }
];

const secondaryBenefits = [
    { 
        icon: ShieldCheck, 
        title: "Seguridad Bancaria", 
        desc: "Encriptación SSL de 256-bits y protección de datos." 
    },
    { 
        icon: Smartphone, 
        title: "Acceso Móvil", 
        desc: "Gestiona tu facturación desde cualquier dispositivo." 
    },
    { 
        icon: FileCheck, 
        title: "Cumplimiento SAT", 
        desc: "Siempre actualizado con las últimas normas fiscales (CFDI 4.0)." 
    },
];

const BenefitsSection = () => {
    return (
        <section id="benefits" className="relative py-24 sm:py-32 bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-300">
            
            {/* Fondo decorativo sutil */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
            </div>

            <div className="container relative z-10 mx-auto px-6 max-w-7xl">
                
                {/* --- Header de la Sección --- */}
                <div className="mx-auto max-w-3xl text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                            Por qué elegirnos
                        </h2>
                        <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                            No es solo software, es tu <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                                ventaja competitiva
                            </span>
                        </p>
                        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                            Hemos eliminado la complejidad de la administración para que puedas dedicarte a lo que mejor sabes hacer: dirigir tu restaurante.
                        </p>
                    </motion.div>
                </div>

                {/* --- Beneficios Principales (Zig-Zag) --- */}
                <div className="space-y-24 lg:space-y-32">
                    {mainBenefits.map((benefit, index) => (
                        <div key={benefit.title} className={`flex flex-col lg:flex-row gap-12 lg:gap-24 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                            
                            {/* Texto */}
                            <motion.div 
                                className="flex-1 text-center lg:text-left"
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <div className={`inline-flex items-center justify-center p-3 rounded-2xl bg-${benefit.color}-100 dark:bg-${benefit.color}-900/30 text-${benefit.color}-600 dark:text-${benefit.color}-400 mb-6`}>
                                    <benefit.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {benefit.title}
                                </h3>
                                <h4 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                                    {benefit.headline}
                                </h4>
                                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                                    {benefit.description}
                                </p>
                                {/* Opcional: Enlace de "Saber más" */}
                                {/* <a href="#" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                                    Conoce más <ArrowRight className="w-4 h-4 ml-2" />
                                </a> */}
                            </motion.div>

                            {/* Imagen / Visual */}
                            <motion.div 
                                className="flex-1 w-full"
                                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="relative rounded-2xl bg-gray-900 shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 group">
                                    {/* Overlay gradiente al hacer hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                                    
                                    <img 
                                        src={benefit.image} 
                                        alt={benefit.title} 
                                        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                        loading="lazy"
                                    />
                                    
                                    {/* Decoración UI (Simulada) */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>

                {/* --- Grid de Beneficios Secundarios --- */}
                <div className="mt-32">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {secondaryBenefits.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                className="group p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                            >
                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-600/30">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default BenefitsSection;