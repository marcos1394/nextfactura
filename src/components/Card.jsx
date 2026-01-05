import React from 'react';

/**
 * Card - Contenedor flexible para secciones del dashboard.
 * * @param {string} title - Título principal.
 * @param {string} description - Texto secundario o explicativo (opcional).
 * @param {LucideIcon} icon - Icono que acompaña al título (opcional).
 * @param {ReactNode} action - Elemento a la derecha (ej: botón, menú) (opcional).
 * @param {boolean} noPadding - Si es true, elimina el padding del cuerpo (útil para tablas).
 * @param {string} className - Clases adicionales.
 */
const Card = ({ 
    title, 
    description, 
    icon: Icon, 
    action, 
    children, 
    noPadding = false,
    className = "" 
}) => {
    return (
        <div className={`
            bg-white dark:bg-slate-800 
            border border-gray-200 dark:border-slate-700 
            rounded-xl shadow-sm 
            transition-all duration-300 
            hover:shadow-md 
            ${className}
        `}>
            {/* Header: Solo se renderiza si hay título, icono o acción */}
            {(title || action || Icon) && (
                <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Título e Icono */}
                    <div className="flex items-start gap-3">
                        {Icon && (
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 mt-0.5">
                                <Icon className="w-5 h-5" />
                            </div>
                        )}
                        <div>
                            {title && (
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                    {title}
                                </h3>
                            )}
                            {description && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Acción (Botón, Switch, etc.) */}
                    {action && (
                        <div className="flex-shrink-0">
                            {action}
                        </div>
                    )}
                </div>
            )}

            {/* Cuerpo del Card */}
            <div className={noPadding ? "p-0" : "p-6"}>
                {children}
            </div>
        </div>
    );
};

export default Card;