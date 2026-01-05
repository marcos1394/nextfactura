import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * Accordion - Componente desplegable con animaciones suaves.
 * * @param {string} title - Título del encabezado.
 * @param {LucideIcon} icon - Icono opcional a la izquierda.
 * @param {ReactNode} children - Contenido oculto.
 * @param {boolean} defaultOpen - Estado inicial.
 */
const Accordion = ({ title, icon: Icon, children, defaultOpen = false, className = "" }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div 
            className={`
                border rounded-xl overflow-hidden transition-all duration-300
                ${isOpen 
                    ? 'border-blue-500/50 ring-1 ring-blue-500/20 bg-blue-50/30 dark:bg-blue-900/10' 
                    : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'}
                ${className}
            `}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full px-5 py-4 flex items-center justify-between transition-colors outline-none
                    ${isOpen 
                        ? 'text-blue-700 dark:text-blue-300' 
                        : 'text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700/50'}
                `}
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className={`
                            p-1.5 rounded-lg transition-colors
                            ${isOpen ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-gray-100 dark:bg-slate-700 text-gray-500'}
                        `}>
                            <Icon className="w-5 h-5" />
                        </div>
                    )}
                    <span className="font-semibold text-base">{title}</span>
                </div>
                
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-blue-500' : 'text-gray-400'}`} />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: "auto", marginTop: 0 },
                            collapsed: { opacity: 0, height: 0, marginTop: -10 }
                        }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 pt-2 border-t border-gray-100 dark:border-slate-700/50 text-gray-600 dark:text-slate-300">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Accordion;