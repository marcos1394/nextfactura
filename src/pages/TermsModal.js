// src/components/TermsModal.js
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Usaremos Heroicons para mantener consistencia con los demás componentes rediseñados
import { XMarkIcon, CheckCircleIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

/**
 * TermsModal - Un componente de UI legal, refinado para máxima claridad y una experiencia profesional.
 * * Estrategia de UX/UI:
 * 1.  Mantener la Funcionalidad Clave: La lógica de deshabilitar el botón de "Aceptar" hasta que el
 * usuario haya hecho scroll hasta el final es una excelente práctica de UX y se mantiene como el núcleo.
 * 2.  Mejora de la Legibilidad: Se ajusta la tipografía (tamaño, interlineado) para hacer el texto
 * legal denso lo más legible y menos intimidante posible.
 * 3.  Animaciones Fluidas: Se utiliza `framer-motion` para la animación de entrada y salida del modal,
 * proporcionando una experiencia más suave y profesional que las animaciones de clase CSS.
 * 4.  Diseño Cohesivo: Los colores, botones y estilos generales se alinean con el lenguaje de diseño
 * premium establecido en las páginas anteriores, haciendo que el modal se sienta como una parte
 * integral de la aplicación.
 * 5.  Accesibilidad (A11y): Se añaden atributos ARIA para asegurar que el modal es robusto y
 * usable por todos los usuarios.
 */
const TermsModal = ({ isOpen, onClose, onAccept }) => {
    const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const contentRef = useRef(null);

    const handleScroll = () => {
        if (contentRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
            // Un pequeño buffer de 1px para asegurar que se active en todos los navegadores
            if (scrollTop + clientHeight >= scrollHeight - 1) {
                setIsScrolledToEnd(true);
            }
            // Cálculo del progreso para la barra
            const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
            setScrollProgress(progress);
        }
    };

    // Resetear el estado cuando el modal se abre
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
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col h-[90vh]"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="terms-title"
                    >
                        {/* --- Header Fijo --- */}
                        <header className="flex-shrink-0 border-b border-gray-200 dark:border-slate-700">
                            <div className="flex items-center justify-between p-6">
                                <h2 id="terms-title" className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Términos y Condiciones
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                    aria-label="Cerrar modal"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>
                            {/* Barra de Progreso */}
                            <div className="w-full bg-gray-200 dark:bg-slate-700 h-1">
                                <motion.div
                                    className="h-1 bg-blue-600"
                                    style={{ width: `${scrollProgress}%` }}
                                    transition={{ duration: 0.1 }}
                                />
                            </div>
                        </header>

                        {/* --- Contenido Scrollable --- */}
                        <div
                            className="flex-grow overflow-y-auto px-8 py-6 relative"
                            ref={contentRef}
                            onScroll={handleScroll}
                        >
                            <div className="prose prose-slate dark:prose-invert max-w-none text-justify leading-relaxed">
                                <p>
                                    Te pedimos leer cuidadosamente los siguientes Términos y Condiciones antes de utilizar
                                    la aplicación web <strong>NEXFACTURA</strong> (en adelante, la "Aplicación"), un panel de
                                    autofacturación diseñado para restaurantes y otros establecimientos de consumo. Al
                                    utilizar NEXFACTURA, aceptas voluntariamente estos Términos y Condiciones. Si no estás
                                    de acuerdo, te pedimos que no utilices la Aplicación.
                                </p>
                                <h3>I. Propiedad Intelectual</h3>
                                <p>
                                    Todos los derechos de propiedad intelectual relacionados con el contenido, diseño y
                                    desarrollo de NEXFACTURA son propiedad exclusiva de <strong>NEXTECH</strong>. Ningún usuario
                                    podrá reproducir, modificar o distribuir el contenido de la Aplicación sin autorización
                                    previa y por escrito de NEXTECH.
                                </p>
                                <h3>II. Uso del Servicio</h3>
                                <p>
                                    NEXFACTURA está diseñada para que los clientes de restaurantes puedan generar sus
                                    facturas de manera sencilla. Al utilizar la Aplicación, te comprometes a:
                                </p>
                                <ul>
                                    <li>No realizar modificaciones no autorizadas en el sistema o en la base de datos.</li>
                                    <li>No utilizar la Aplicación con fines fraudulentos o para actividades contrarias a la ley.</li>
                                    <li>Proporcionar datos verídicos para la generación de facturas.</li>
                                </ul>
                                <h3>III. Cuentas de Usuario</h3>
                                <p>
                                    Para utilizar NEXFACTURA, es posible que debas crear una cuenta de usuario (en adelante,
                                    la "Cuenta"). Al crear una Cuenta, te comprometes a proporcionar información precisa y
                                    mantener la confidencialidad de tu contraseña. Cualquier actividad realizada desde tu
                                    Cuenta es tu responsabilidad.
                                </p>
                                <h3>XIV. Misceláneos</h3>
                                <p>
                                    NEXFACTURA no podrá ser licenciada, transferida ni cedida a terceros sin la previa
                                    autorización por escrito de NEXTECH. Solo los distribuidores autorizados por NEXTECH
                                    podrán comercializar y distribuir la Aplicación. Cualquier intento de licenciamiento o
                                    cesión no autorizado será considerado una violación de estos Términos y Condiciones.
                                </p>
                                <p>
                                    Si tienes alguna duda sobre estos Términos y Condiciones, puedes contactarnos a través
                                    de <strong>soporte@nextechsolutions.com.mx</strong> o al teléfono <strong>614-215-20-82</strong>.
                                </p>
                                {/* Indicador de Fin de Contenido */}
                                {isScrolledToEnd && (
                                    <div className="flex justify-center items-center gap-2 py-4 text-green-600 dark:text-green-400">
                                        <CheckCircleIcon className="w-5 h-5"/>
                                        <span className="text-sm font-semibold">Has llegado al final del documento.</span>
                                    </div>
                                )}
                            </div>
                             {/* Scroll Hint (Pista para bajar) */}
                            {!isScrolledToEnd && (
                                <motion.div
                                    className="sticky bottom-4 w-full flex justify-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <motion.div
                                        className="p-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-full shadow-lg"
                                        animate={{ y: [0, 8, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        <ChevronDownIcon className="w-6 h-6 text-gray-500" />
                                    </motion.div>
                                </motion.div>
                            )}
                        </div>

                        {/* --- Footer Fijo --- */}
                        <footer className="flex-shrink-0 border-t border-gray-200 dark:border-slate-700 p-4 sm:p-6 flex justify-end items-center space-x-4">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 border border-gray-300 dark:border-slate-600 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={onAccept}
                                disabled={!isScrolledToEnd}
                                className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300 flex items-center gap-2 disabled:bg-gray-300 dark:disabled:bg-slate-600 disabled:text-gray-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed"
                            >
                                <CheckCircleIcon className="w-5 h-5" />
                                He leído y Acepto los Términos
                            </button>
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TermsModal;
