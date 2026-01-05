import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    CheckCircle2, 
    Download, 
    Rocket, 
    ArrowRight,
    Check,
    Loader2,
    Home
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

const PaymentSuccess = () => {
    const { darkMode } = useThemeContext();
    const navigate = useNavigate();
    
    // Obtenemos user, verifySession y el estado de carga desde tu hook useAuth
    const { user, verifySession, isLoading: isAuthLoading } = useAuth();
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        // 1. Intentamos recuperar/refrescar la sesión al cargar la página
        // Esto es crucial al volver de una pasarela externa como Mercado Pago
        const restoreSession = async () => {
            try {
                await verifySession();
            } catch (error) {
                console.error("Error al verificar sesión post-pago:", error);
            }
        };
        restoreSession();

        // 2. Efecto de celebración (Confetti)
        const duration = 2500;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({ 
                particleCount: 2, 
                angle: 60, 
                spread: 55, 
                origin: { x: 0 }, 
                colors: ['#3b82f6', '#10b981', '#fbbf24'] 
            });
            confetti({ 
                particleCount: 2, 
                angle: 120, 
                spread: 55, 
                origin: { x: 1 }, 
                colors: ['#3b82f6', '#10b981', '#fbbf24'] 
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    }, [verifySession]); // Dependencia agregada por buenas prácticas

    const handleDownloadReceipt = () => {
        setDownloading(true);
        // Simulación de descarga
        setTimeout(() => {
            setDownloading(false);
            alert("Recibo descargado (simulación)");
        }, 1500);
    };

    // Pantalla de carga mientras verificamos la sesión
    if (isAuthLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Verificando estado de la cuenta...</p>
                </div>
            </div>
        );
    }

    // --- LÓGICA DE RUTEO INTELIGENTE ---
    // Basado en tu AuthContext, 'restaurants' es un array.
    // Si el array tiene elementos, el usuario ya configuró su negocio -> Va al Dashboard.
    // Si el array está vacío, es usuario nuevo -> Va a Configuración.
    const hasRestaurant = user?.restaurants && user.restaurants.length > 0;

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 font-sans overflow-hidden relative ${darkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
            
            {/* Fondo con patrón sutil */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
                 style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
            </div>

            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-blue-900/10 dark:shadow-black/50 max-w-lg w-full text-center border border-white/20 dark:border-slate-800 relative overflow-hidden backdrop-blur-xl"
            >
                {/* Decoración superior */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                {/* Icono Animado */}
                <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-500/10 rounded-full mb-8 relative"
                >
                    <div className="absolute inset-0 rounded-full border border-green-200 dark:border-green-500/20 animate-ping opacity-25"></div>
                    <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.4 }}
                >
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                        ¡Pago Exitoso!
                    </h1>
                    
                    {/* MENSAJE DINÁMICO SEGÚN TIPO DE USUARIO */}
                    <p className="text-gray-600 dark:text-slate-300 mb-8 text-lg leading-relaxed">
                        {hasRestaurant ? (
                            <>
                                Tu plan ha sido renovado correctamente.<br/>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    Todo listo para seguir operando.
                                </span>
                            </>
                        ) : (
                            <>
                                Tu cuenta ha sido activada.<br/>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    Solo falta un paso para comenzar a vender.
                                </span>
                            </>
                        )}
                    </p>

                    <div className="space-y-4">
                        {/* BOTÓN DE ACCIÓN DINÁMICO */}
                        <button 
                            onClick={() => navigate(hasRestaurant ? '/dashboard' : '/restaurant-config')} 
                            className={`group w-full flex items-center justify-center gap-3 py-4 text-white font-bold text-lg rounded-2xl transition-all shadow-lg hover:-translate-y-1 ${
                                hasRestaurant 
                                    ? 'bg-slate-800 hover:bg-slate-700 shadow-slate-500/30' // Estilo Dashboard
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'    // Estilo Configuración (más llamativo)
                            }`}
                        >
                            {hasRestaurant ? (
                                <>
                                    <Home className="w-6 h-6" />
                                    Ir al Dashboard
                                </>
                            ) : (
                                <>
                                    <Rocket className="w-6 h-6 group-hover:animate-pulse" />
                                    Configurar mi Restaurante
                                </>
                            )}
                            <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button 
                            onClick={handleDownloadReceipt}
                            disabled={downloading}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            {downloading ? (
                                'Generando PDF...' 
                            ) : (
                                <>
                                    <Download className="w-4 h-4" /> 
                                    Descargar comprobante de pago
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-slate-500">
                            <Check className="w-3 h-3 text-green-500" />
                            <span>Hemos enviado el comprobante a {user?.email}</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;