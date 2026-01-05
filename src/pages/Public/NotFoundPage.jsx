import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FileQuestion, 
    Home, 
    ArrowLeft, 
    LifeBuoy 
} from 'lucide-react';

function NotFoundPage() {
    const navigate = useNavigate();

    // Animación suave de entrada
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans transition-colors duration-300">
            
            {/* Patrón de fondo decorativo */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
                style={{ 
                    backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', 
                    backgroundSize: '24px 24px' 
                }}
            ></div>

            <motion.div 
                className="relative z-10 text-center max-w-lg w-full"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Icono Flotante */}
                <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="mx-auto w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center mb-8 rotate-12 shadow-xl shadow-blue-500/10"
                >
                    <FileQuestion className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </motion.div>

                {/* Texto Principal */}
                <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-2">
                    404
                </h1>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Página no encontrada
                </h2>
                <p className="text-gray-600 dark:text-slate-400 text-lg mb-10 leading-relaxed">
                    Parece que te has desviado del camino. La página que buscas no existe o ha sido movida.
                </p>

                {/* Botones de Acción */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm hover:shadow"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Regresar
                    </button>

                    <Link 
                        to="/dashboard" 
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-0.5"
                    >
                        <Home className="w-4 h-4" />
                        Ir al Inicio
                    </Link>
                </div>

                {/* Footer de Ayuda */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-800">
                    <Link to="/help-center" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <LifeBuoy className="w-4 h-4" />
                        ¿Necesitas ayuda? Visita nuestro Centro de Soporte
                    </Link>
                </div>

            </motion.div>
        </main>
    );
}

export default NotFoundPage;