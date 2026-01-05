import React from 'react';
import { Globe, Store, CheckCircle2, Check, Lock } from 'lucide-react';

/**
 * SetupStepper - Navegación vertical para procesos de configuración.
 * Gestiona estados: Activo (Blue), Completado (Green), Pendiente (Gray).
 */
const SetupStepper = ({ currentStep, setStep }) => {
    const steps = [
        {
            id: 1,
            title: 'Portal de Clientes',
            description: 'Personaliza tu marca y URL',
            icon: Globe,
        },
        {
            id: 2,
            title: 'Datos Fiscales',
            description: 'Configura tus sucursales',
            icon: Store,
        },
        {
            id: 3,
            title: 'Resumen Final',
            description: 'Revisión y activación',
            icon: CheckCircle2,
        }
    ];

    return (
        <nav className="space-y-3">
            {steps.map((step) => {
                const Icon = step.icon;
                
                // Estados Lógicos
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const isPending = currentStep < step.id;
                
                // Un paso es "clickable" si ya está completado (para volver)
                // o si es el actual (aunque no hace nada). 
                // Los pendientes están bloqueados para forzar el flujo secuencial.
                const isClickable = isCompleted;

                return (
                    <button
                        key={step.id}
                        onClick={() => isClickable && setStep(step.id)}
                        disabled={!isClickable && !isActive}
                        className={`
                            relative w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-300
                            ${isActive 
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-md scale-[1.02] z-10' 
                                : isCompleted
                                    ? 'bg-white dark:bg-slate-800 border-green-500/50 hover:bg-green-50 dark:hover:bg-green-900/10 cursor-pointer'
                                    : 'bg-gray-50 dark:bg-slate-900 border-transparent opacity-60 cursor-not-allowed'
                            }
                        `}
                    >
                        {/* --- Icono del Paso --- */}
                        <div className={`
                            flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors
                            ${isActive 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                                : isCompleted
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                    : 'bg-gray-200 dark:bg-slate-700 text-gray-400'
                            }
                        `}>
                            {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                        </div>

                        {/* --- Textos --- */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <span className={`text-sm font-bold uppercase tracking-wider mb-0.5 ${
                                    isActive ? 'text-blue-600 dark:text-blue-400' : 
                                    isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-500'
                                }`}>
                                    Paso {step.id}
                                </span>
                                {isPending && <Lock className="w-3 h-3 text-gray-400" />}
                            </div>
                            
                            <h4 className={`text-base font-bold leading-tight ${
                                isActive || isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-slate-400'
                            }`}>
                                {step.title}
                            </h4>
                            
                            <p className={`text-xs mt-1 truncate ${
                                isActive ? 'text-blue-700 dark:text-blue-200' : 'text-gray-500 dark:text-slate-500'
                            }`}>
                                {step.description}
                            </p>
                        </div>

                        {/* --- Indicador de Flecha (Solo Activo) --- */}
                        {isActive && (
                            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rotate-45 border-r border-t border-white dark:border-slate-800 hidden md:block"></div>
                        )}
                    </button>
                );
            })}
        </nav>
    );
};

export default SetupStepper;