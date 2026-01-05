import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, ArrowRight, CheckCircle2 } from 'lucide-react';

const CallToActionSection = () => {
  const navigate = useNavigate();

  const handlePrimaryAction = () => {
    navigate('/register');
  };

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-blue-600 dark:bg-blue-700 transition-colors duration-300">
      
      {/* --- Elementos Decorativos de Fondo (Patrón) --- */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
      </div>

      {/* --- Efectos de Luz (Glow) --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white opacity-20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container relative z-10 mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            ¿Listo para tomar el control <br/>
            <span className="text-blue-200">total de tu restaurante?</span>
          </h2>

          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Únete a la nueva generación de negocios inteligentes. Facturación automática, reportes en tiempo real y clientes más felices.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <motion.button
              onClick={handlePrimaryAction}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all duration-300"
            >
              Comenzar Prueba Gratis
              <Rocket className="w-5 h-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </motion.button>
            
            {/* Botón Secundario (Opcional - Demo) */}
            {/* <button className="px-8 py-4 rounded-full font-semibold text-white border-2 border-blue-400 hover:bg-blue-500/20 transition-colors">
                Ver Demo en Vivo
            </button> */}
          </div>

          {/* --- Badges de Confianza (Eliminadores de Fricción) --- */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium text-blue-100 opacity-90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-300" />
              <span>Sin tarjeta de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-300" />
              <span>14 días de prueba</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-300" />
              <span>Cancela cuando quieras</span>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;