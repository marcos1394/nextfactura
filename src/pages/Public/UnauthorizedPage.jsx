import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ShieldBan, 
    ArrowLeft, 
    LayoutDashboard, 
    Lock 
} from 'lucide-react';

/**
 * UnauthorizedPage - Muestra cuando el usuario no tiene rol suficiente (403).
 */
const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans transition-colors duration-300">
            
            {/* Fondo decorativo de seguridad */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
                style={{ 
                    backgroundImage: 'radial-gradient(#ef4444 1px, transparent 1px)', // Rojo sutil para alerta
                    backgroundSize: '32px 32px' 
                }}
            ></div>

            <motion.div 
                className="relative z-10 text-center max-w-lg w-full"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                {/* Icono de Seguridad */}
                <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-red-500/10 relative">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full border border-red-200 dark:border-red-800 opacity-50"
                    ></motion.div>
                    <ShieldBan className="w-12 h-12 text-red-600 dark:text-red-500" />
                    
                    {/* Pequeño candado flotante */}
                    <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-2 rounded-full shadow-md border border-gray-100 dark:border-slate-700">
                        <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                </div>

                {/* Texto Principal */}
                <h1 className="text-6xl font-black text-gray-200 dark:text-slate-800 mb-[-1.5rem] select-none">
                    403
                </h1>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">
                    Acceso Denegado
                </h2>
                
                <p className="text-gray-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                    Lo sentimos, tu usuario no tiene los permisos necesarios para ver esta página. 
                    <br className="hidden sm:block" />
                    Esta zona es restringida.
                </p>

                {/* Acciones */}
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
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold hover:opacity-90 transition-all shadow-lg hover:-translate-y-0.5"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Ir al Dashboard
                    </Link>
                </div>

                {/* Nota de ayuda */}
                <p className="mt-10 text-xs text-gray-400 dark:text-slate-500">
                    Si crees que esto es un error, contacta al administrador del sistema.
                </p>

            </motion.div>
        </main>
    );
};

export default UnauthorizedPage;