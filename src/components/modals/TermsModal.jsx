import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ChevronDown, ScrollText } from 'lucide-react';

/**
 * TermsModal - Componente de términos legales optimizado.
 * Características:
 * - Scroll obligatorio para habilitar botón.
 * - Barra de progreso de lectura.
 * - Animaciones suaves de entrada/salida.
 */
const TermsModal = ({ isOpen, onClose, onAccept }) => {
    const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const contentRef = useRef(null);

    // Manejador de scroll para detectar el final y calcular progreso
    const handleScroll = () => {
        if (contentRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
            
            // Margen de error de 2px para pantallas de alta densidad
            const isBottom = scrollTop + clientHeight >= scrollHeight - 2;
            
            if (isBottom) {
                setIsScrolledToEnd(true);
            }

            // Cálculo del porcentaje de lectura
            const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
            setScrollProgress(Math.min(progress, 100));
        }
    };

    // Resetear estados al abrir
    useEffect(() => {
        if (isOpen) {
            setIsScrolledToEnd(false);
            setScrollProgress(0);
            if (contentRef.current) {
                contentRef.current.scrollTop = 0;
            }
        }
    }, [isOpen]);

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { type: 'spring', damping: 25, stiffness: 300 } 
        },
        exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        className="relative bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-gray-200 dark:border-slate-700"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="terms-title"
                    >
                        {/* --- Header --- */}
                        <div className="flex-shrink-0 bg-white dark:bg-slate-900 z-10 border-b border-gray-100 dark:border-slate-800">
                            <div className="flex items-center justify-between px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                        <ScrollText className="w-5 h-5" />
                                    </div>
                                    <h2 id="terms-title" className="text-xl font-bold text-gray-900 dark:text-white">
                                        Términos y Condiciones
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                                    aria-label="Cerrar"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            {/* Barra de Progreso de Lectura */}
                            <div className="w-full bg-gray-100 dark:bg-slate-800 h-1">
                                <motion.div
                                    className="h-full bg-blue-600"
                                    style={{ width: `${scrollProgress}%` }}
                                    transition={{ ease: "linear", duration: 0.1 }}
                                />
                            </div>
                        </div>

                        {/* --- Cuerpo Scrollable --- */}
                        <div
                            ref={contentRef}
                            onScroll={handleScroll}
                            className="flex-grow overflow-y-auto px-6 py-6 scroll-smooth"
                        >
                            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                                <p className="lead">
                                    Bienvenido a <strong>NextManager</strong>. Al utilizar nuestra plataforma, aceptas cumplir con los siguientes términos diseñados para garantizar un servicio seguro y confiable para todos.
                                </p>

                                <h3>1. Aceptación de los Términos</h3>
                                <p>
                                    Al acceder o utilizar nuestros servicios, usted acepta estar legalmente vinculado por estos Términos y todas las leyes y regulaciones aplicables. Si no está de acuerdo con alguno de estos términos, tiene prohibido usar o acceder a este sitio.
                                </p>

                                <h3>2. Licencia de Uso</h3>
                                <p>
                                    Se concede permiso para descargar temporalmente una copia de los materiales (información o software) en el sitio web de NextManager solo para visualización transitoria personal y no comercial. Esta es la concesión de una licencia, no una transferencia de título.
                                </p>

                                <h3>3. Responsabilidades del Usuario</h3>
                                <ul>
                                    <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
                                    <li>No utilizar el servicio para actividades ilegales o no autorizadas.</li>
                                    <li>No intentar ingeniería inversa o vulnerar la seguridad del sistema.</li>
                                </ul>

                                <h3>4. Pagos y Facturación</h3>
                                <p>
                                    El servicio se factura por adelantado de forma mensual o anual. No habrá reembolsos ni créditos por meses parciales de servicio, reembolsos de actualización/downgrade, o reembolsos por meses no utilizados con una cuenta abierta.
                                </p>

                                <h3>5. Cancelación y Terminación</h3>
                                <p>
                                    Usted es el único responsable de cancelar correctamente su cuenta. Puede cancelar su cuenta en cualquier momento a través del panel de control. Todo su contenido será inaccesible inmediatamente después de la cancelación.
                                </p>

                                <h3>6. Limitación de Responsabilidad</h3>
                                <p>
                                    En ningún caso NextManager o sus proveedores serán responsables de daños (incluidos, entre otros, daños por pérdida de datos o beneficios, o debido a la interrupción del negocio) que surjan del uso o la imposibilidad de usar nuestros servicios.
                                </p>

                                {/* Espacio extra para asegurar scroll */}
                                <div className="h-8"></div>

                                {/* Indicador de Fin */}
                                {isScrolledToEnd && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-center gap-2 py-4 text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/10 rounded-lg"
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span>Has leído todo el documento.</span>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* --- Indicador Flotante de Scroll --- */}
                        {!isScrolledToEnd && (
                            <div className="absolute bottom-20 left-0 right-0 flex justify-center pointer-events-none">
                                <motion.div
                                    animate={{ y: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700 rounded-full p-2 text-gray-400 dark:text-gray-500"
                                >
                                    <ChevronDown className="w-5 h-5" />
                                </motion.div>
                            </div>
                        )}

                        {/* --- Footer --- */}
                        <div className="flex-shrink-0 border-t border-gray-100 dark:border-slate-800 p-6 bg-gray-50 dark:bg-slate-900/50 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={onAccept}
                                disabled={!isScrolledToEnd}
                                className={`
                                    flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-300
                                    ${isScrolledToEnd 
                                        ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 cursor-pointer transform hover:-translate-y-0.5' 
                                        : 'bg-gray-300 dark:bg-slate-700 text-gray-500 cursor-not-allowed'}
                                `}
                            >
                                {isScrolledToEnd ? <CheckCircle2 className="w-4 h-4" /> : <ScrollText className="w-4 h-4" />}
                                Aceptar y Continuar
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TermsModal;