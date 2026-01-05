import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  const handlePrimaryAction = () => {
    navigate('/register');
  };

  const handleSecondaryAction = () => {
    // Aquí podrías abrir un modal de video o llevar a una página de demo
    navigate('/features'); 
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }, // Curva "Apple-like"
    },
  };

  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-900 min-h-screen flex items-center">
      
      {/* --- Fondo Decorativo --- */}
      <div className="absolute inset-0 z-0">
        {/* Patrón de puntos sutil */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 dark:opacity-5"></div>
        
        {/* Gradientes de luz */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container relative z-10 mx-auto px-6 py-12 lg:py-24">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* --- Columna de Texto --- */}
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-300 tracking-wide uppercase">
                    Nueva Generación de SaaS
                </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]"
            >
              Gestión total para tu <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                restaurante moderno.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              Deja de luchar con hojas de cálculo y sistemas lentos. NextManager centraliza tu facturación, reportes y operaciones en una sola plataforma en la nube.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={handlePrimaryAction}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/40 transform hover:-translate-y-1 transition-all duration-300"
              >
                Comenzar Gratis
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleSecondaryAction}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <PlayCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                Cómo funciona
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                        </div>
                    ))}
                </div>
                <p>Usado por +500 restaurantes líderes</p>
            </motion.div>
          </div>

          {/* --- Columna Visual (Imagen 3D) --- */}
          <motion.div
            variants={itemVariants}
            className="hidden lg:block relative"
          >
            {/* Contenedor de la imagen con efecto de flotación y perspectiva */}
            <div className="relative w-full aspect-[4/3] rounded-2xl bg-gray-900 shadow-2xl overflow-hidden border border-gray-800 transform perspective-1000 rotate-y-[-5deg] hover:rotate-y-0 transition-transform duration-700 ease-out group">
                
                {/* Imagen del Dashboard (Placeholder de alta calidad) */}
                <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                    alt="Dashboard Preview" 
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Overlay de gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>

                {/* Elementos flotantes simulados (Notificaciones) */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4 shadow-lg"
                >
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                        $
                    </div>
                    <div>
                        <p className="text-white font-semibold">Ventas de hoy</p>
                        <p className="text-green-400 font-bold">+24% vs ayer</p>
                    </div>
                </motion.div>
            </div>

            {/* Sombra decorativa detrás */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-2xl opacity-20 -z-10 transform rotate-2"></div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}

export default Hero;