import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api'; // Asegúrate que esta ruta apunte a tu configuración de Axios

function PaymentPending() {
    const { darkMode } = useThemeContext();
    const { verifySession } = useAuth(); // Función para recargar los claims del usuario
    const navigate = useNavigate();
    const location = useLocation();
    const [retryCount, setRetryCount] = useState(0);

    // Extraemos el ID de la compra (external_reference de Mercado Pago o ID de sesión de Stripe)
    const query = new URLSearchParams(location.search);
    const purchaseId = query.get('external_reference') || query.get('preference_id');

    // --- LÓGICA DE POLLING ---
    useEffect(() => {
        if (!purchaseId) {
            console.warn("No se encontró ID de compra, redirigiendo...");
            // Pequeño delay para que el usuario no vea un flash raro
            setTimeout(() => navigate('/dashboard'), 2000);
            return;
        }

        const checkStatus = async () => {
            try {
                // Endpoint que consulta a MercadoPago/Stripe el estado real
                const response = await api.get(`/payments/purchase-status/${purchaseId}`);
                const data = response.data;

                if (data.success && data.status === 'active') { // O 'approved' dependiendo de tu backend
                    // 1. ÉXITO: El pago se acreditó
                    await verifySession(); // Actualizar permisos del usuario (créditos, plan)
                    navigate('/payment-success');
                    return true; // Detener polling
                } 
                else if (data.success && data.status === 'rejected') {
                    // 2. FALLO: El pago fue rechazado
                    navigate('/payment-failure');
                    return true; // Detener polling
                }
                
                // 3. PENDIENTE: Seguimos esperando...
                return false; 

            } catch (error) {
                console.error("Error verificando pago:", error);
                setRetryCount(prev => prev + 1);
                return false;
            }
        };

        // Intervalo de Polling (cada 3 segundos)
        const intervalId = setInterval(async () => {
            const shouldStop = await checkStatus();
            if (shouldStop) clearInterval(intervalId);
        }, 3000);

        // Timeout de seguridad (si en 2 minutos no se resuelve, mostrar error o contactar soporte)
        const timeoutId = setTimeout(() => {
            clearInterval(intervalId);
            // Opcional: Redirigir a una página de "Pago en proceso manual" o Dashboard
            alert("El pago está tardando más de lo esperado. Te notificaremos por correo.");
            navigate('/dashboard');
        }, 120000); 

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };

    }, [purchaseId, navigate, verifySession]);

    // --- VARIANTES DE ANIMACIÓN ---
    const pulseVariant = {
        initial: { scale: 1, opacity: 0.5 },
        animate: {
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
            transition: {
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
            }
        }
    };

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-slate-950' : 'bg-white'}`}>
            <div className="grid lg:grid-cols-2 min-h-screen">
                
                {/* --- Panel Izquierdo: Estado del Proceso --- */}
                <div className="flex flex-col justify-center items-center p-6 sm:p-12 order-2 lg:order-1 relative">
                    
                    {/* Botón de escape de emergencia (por si se traba) */}
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="absolute top-6 left-6 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                    >
                        &larr; Volver al Dashboard
                    </button>

                    <motion.div 
                        className="w-full max-w-md text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        {/* Animación Central */}
                        <div className="relative flex justify-center items-center h-48 w-48 mx-auto mb-8">
                            <motion.div 
                                variants={pulseVariant} 
                                initial="initial" 
                                animate="animate" 
                                className="absolute w-full h-full rounded-full bg-yellow-100 dark:bg-yellow-500/10" 
                            />
                            <motion.div 
                                variants={pulseVariant} 
                                initial="initial" 
                                animate="animate" 
                                style={{ animationDelay: '0.5s' }} 
                                className="absolute w-2/3 h-2/3 rounded-full bg-yellow-200 dark:bg-yellow-500/20" 
                            />
                            <div className="relative bg-white dark:bg-slate-800 p-6 rounded-full shadow-xl border border-yellow-100 dark:border-yellow-500/20 z-10">
                                <Clock className="w-16 h-16 text-yellow-500 animate-pulse" />
                            </div>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
                            Confirmando pago...
                        </h1>
                        
                        <p className="text-lg text-gray-600 dark:text-slate-400 mb-8">
                            Estamos comunicándonos con el banco para validar tu transacción. Esto tomará solo unos momentos.
                        </p>

                        {/* Barra de Progreso Infinita */}
                        <div className="relative w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
                            <motion.div 
                                className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
                                animate={{ x: ['-100%', '350%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                        </div>

                        {retryCount > 5 && (
                            <p className="text-sm text-yellow-600 dark:text-yellow-500 flex items-center justify-center gap-2 animate-fadeIn">
                                <AlertCircle className="w-4 h-4" />
                                Esto está tardando un poco más de lo normal, gracias por tu paciencia.
                            </p>
                        )}

                        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-xl">
                            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                                Por favor, no cierres ni recargues esta página.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* --- Panel Derecho: Mensajes de Confianza --- */}
                <div className="hidden lg:flex relative bg-slate-900 order-1 lg:order-2 flex-col justify-center p-12 lg:p-20 overflow-hidden">
                    
                    {/* Fondo decorativo */}
                    <div className="absolute inset-0 opacity-20" 
                        style={{ 
                            backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', 
                            backgroundSize: '32px 32px' 
                        }}
                    ></div>
                    
                    <div className="relative z-10 text-white max-w-lg">
                        <div className="inline-flex p-3 bg-green-500/10 rounded-2xl mb-6 border border-green-500/20">
                            <ShieldCheck className="w-10 h-10 text-green-400" />
                        </div>
                        
                        <h2 className="text-3xl font-bold leading-tight mb-4">
                            Tu seguridad es nuestra prioridad.
                        </h2>
                        <p className="text-slate-400 text-lg mb-8">
                            Utilizamos encriptación de grado bancario (SSL de 256 bits) para asegurar que tus datos viajen protegidos de extremo a extremo.
                        </p>

                        <div className="space-y-4 border-t border-slate-800 pt-8">
                            <div className="flex items-center gap-3 text-slate-300">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>Verificación instantánea</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>Sin cargos ocultos</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>Activación inmediata de servicios</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default PaymentPending;