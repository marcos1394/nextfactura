import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    XCircle, 
    RotateCcw, 
    HelpCircle, 
    CreditCard, 
    ShieldAlert, 
    Wallet 
} from 'lucide-react';

/**
 * PaymentFailurePage - Página de error de pago optimizada.
 * Enfocada en la resolución de problemas y la calma del usuario.
 */
function PaymentFailurePage() {
    const navigate = useNavigate();

    const handleRetryPayment = () => {
        // Redirigir al paso anterior o a la selección de planes
        navigate('/plans');
    };

    // Variantes para la animación de entrada escalonada
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 font-sans text-gray-900 dark:text-white transition-colors duration-300">
            <div className="grid lg:grid-cols-2 min-h-screen">
                
                {/* --- Panel Izquierdo: Contenido --- */}
                <div className="flex flex-col justify-center items-center p-6 sm:p-12 lg:p-20 relative">
                    
                    {/* Botón de escape (Volver al inicio) */}
                    <div className="absolute top-6 left-6">
                        <button 
                            onClick={() => navigate('/')}
                            className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                        >
                            &larr; Volver al inicio
                        </button>
                    </div>

                    <motion.div 
                        className="w-full max-w-lg"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Icono de Error Estilizado */}
                        <motion.div variants={itemVariants} className="flex justify-center mb-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-100 dark:bg-red-900/30 rounded-full animate-pulse"></div>
                                <div className="relative bg-white dark:bg-slate-800 p-4 rounded-full shadow-lg border border-red-100 dark:border-red-900/50">
                                    <XCircle className="w-16 h-16 text-red-500" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="text-center mb-10">
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
                                No pudimos procesar el pago
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-slate-400">
                                No se ha realizado ningún cargo a tu cuenta. <br className="hidden sm:block"/>
                                Revisemos qué pudo haber pasado.
                            </p>
                        </motion.div>

                        {/* Lista de Verificación (Troubleshooting) */}
                        <motion.div variants={itemVariants} className="space-y-4 mb-10">
                            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-5 border border-gray-100 dark:border-slate-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <ShieldAlert className="w-5 h-5 text-amber-500" />
                                    Posibles causas comunes:
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300">
                                        <CreditCard className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <span>Revisa que el número de tarjeta, fecha de vencimiento y CVV sean correctos.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300">
                                        <Wallet className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <span>Verifica que tengas fondos suficientes o crédito disponible.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300">
                                        <ShieldAlert className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <span>Tu banco podría haber bloqueado la transacción por seguridad (común en pagos nuevos).</span>
                                    </li>
                                </ul>
                            </div>
                        </motion.div>

                        {/* Botones de Acción */}
                        <motion.div variants={itemVariants} className="space-y-3">
                            <button
                                onClick={handleRetryPayment}
                                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Intentar con otra tarjeta
                            </button>
                            
                            <button
                                onClick={() => navigate('/contact')} // Asumiendo que tienes una ruta de contacto
                                className="w-full py-3 px-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors"
                            >
                                <HelpCircle className="w-5 h-5" />
                                Contactar a Soporte
                            </button>
                        </motion.div>

                        {/* Código de Referencia (Da confianza al usuario) */}
                        <motion.div variants={itemVariants} className="mt-8 text-center">
                            <p className="text-xs text-gray-400 dark:text-slate-500 font-mono">
                                Código de error: <span className="bg-gray-100 dark:bg-slate-800 px-1 py-0.5 rounded select-all">ERR_PY_DECLINED_0x24</span>
                            </p>
                        </motion.div>

                    </motion.div>
                </div>

                {/* --- Panel Derecho: Imagen Inspiracional --- */}
                <div className="hidden lg:block relative overflow-hidden bg-slate-900">
                    <motion.div 
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=1974&auto=format&fit=crop')" }}
                    >
                        {/* Gradiente Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                    </motion.div>
                    
                    <div className="relative h-full flex flex-col justify-end p-20 z-10">
                        <motion.div
                             initial={{ opacity: 0, x: 20 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                                Estamos contigo en cada paso.
                            </h2>
                            <p className="text-xl text-slate-300 max-w-md">
                                Un pequeño obstáculo no detendrá el crecimiento de tu negocio. Nuestro equipo está listo para ayudarte a resolverlo.
                            </p>
                        </motion.div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default PaymentFailurePage;