import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Store, FileCheck, Star } from 'lucide-react';

// --- LOGOS SIMULADOS (Para que se vea bien sin archivos extra) ---
const clientLogos = [
  { name: 'GastroGroup', style: 'font-serif font-bold text-xl tracking-tighter' },
  { name: 'SaborMX', style: 'font-sans font-extrabold text-lg tracking-widest uppercase' },
  { name: 'El Fogón', style: 'font-mono font-bold text-xl' },
  { name: 'Mariscos Bahía', style: 'font-serif italic font-bold text-lg' },
  { name: 'Pizza Nostra', style: 'font-sans font-black text-xl tracking-tight' },
];

const socialProofMetrics = [
  { 
    icon: Store, 
    number: 500, 
    label: "Restaurantes Activos", 
    suffix: "+" 
  },
  { 
    icon: FileCheck, 
    number: 1200000, 
    label: "Facturas Generadas", 
    suffix: "+", 
    separator: "," 
  },
  { 
    icon: Star, 
    number: 4.9, 
    label: "Calificación Promedio", 
    suffix: "/5", 
    decimals: 1 
  },
];

const SocialProofSection = () => {
  return (
    <section className="bg-white dark:bg-gray-900 py-20 border-y border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-6">
        
        {/* --- Sección de Logos --- */}
        <div className="text-center mb-20">
          <p className="text-sm font-bold uppercase text-gray-400 dark:text-gray-500 tracking-widest mb-8">
            Con la confianza de los líderes en la industria
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {clientLogos.map((logo, index) => (
              <div key={index} className={`text-gray-500 dark:text-gray-400 ${logo.style}`}>
                {logo.name}
              </div>
            ))}
          </div>
        </div>

        {/* --- Sección de Métricas --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
          {socialProofMetrics.map(({ icon: Icon, number, label, suffix = "", decimals = 0, separator = "" }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="p-4"
            >
              <div className="inline-flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 mb-4">
                <Icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                <CountUp
                  start={0}
                  end={parseFloat(number)}
                  duration={2.5}
                  separator={separator}
                  decimals={decimals}
                  suffix={suffix}
                  enableScrollSpy
                  scrollSpyOnce
                />
              </h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium">{label}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SocialProofSection;