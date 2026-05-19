import React from 'react';
import { Globe, Store, Check, CheckCircle2, Lock } from 'lucide-react';

const SetupStepper = ({ currentStep, setStep }) => {
    
    const steps = [
        { 
            id: 1, 
            title: 'Portal de Facturación', 
            description: 'Identidad y acceso',
            icon: Globe 
        },
        { 
            id: 2, 
            title: 'Sucursales', 
            description: 'Puntos de venta',
            icon: Store 
        },
        { 
            id: 3, 
            title: 'Resumen', 
            description: 'Confirmar y guardar',
            icon: Check 
        }
    ];

    return (
        <div className="relative sticky top-6">
            {/* Línea de progreso vertical decorativa (Opcional, sutil) */}
            <div className="absolute left-8 top-8 bottom-8 w-px bg-gray-200 dark:bg-slate-700 -z-10 hidden md:block"></div>

            <nav aria-label="Progreso de configuración" className="space-y-4">
                {steps.map((s) => {
                    const isActive = currentStep === s.id;
                    const isCompleted = currentStep > s.id;
                    // Solo permitimos navegar a pasos completados o al actual
                    const isDisabled = !isCompleted && !isActive; 

                    return (
                        <button
                            key={s.id}
                            onClick={() => !isDisabled && setStep(s.id)}
                            disabled={isDisabled}
                            aria-current={isActive ? 'step' : undefined}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all border text-left group relative bg-white dark:bg-slate-800 ${
                                isActive 
                                    ? 'border-blue-500 ring-1 ring-blue-500 shadow-lg shadow-blue-500/10 z-10' 
                                    : isCompleted
                                    ? 'border-green-200 dark:border-green-900/50 hover:bg-green-50 dark:hover:bg-green-900/10 cursor-pointer'
                                    : 'border-transparent opacity-60 cursor-not-allowed bg-transparent'
                            }`}
                        >
                            {/* Icono */}
                            <div className={`p-2.5 rounded-lg transition-colors shadow-sm ${
                                isActive 
                                    ? 'bg-blue-600 text-white' 
                                    : isCompleted
                                    ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                                    : 'bg-gray-100 text-gray-400 dark:bg-slate-700 dark:text-slate-500'
                            }`}>
                                <s.icon className="w-5 h-5" />
                            </div>

                            {/* Textos */}
                            <div className="flex-1">
                                <p className={`font-bold text-sm ${
                                    isActive ? 'text-gray-900 dark:text-white' : 
                                    isCompleted ? 'text-green-700 dark:text-green-400' : 
                                    'text-gray-500 dark:text-slate-400'
                                }`}>
                                    {s.title}
                                </p>
                                <p className={`text-xs mt-0.5 ${
                                    isActive ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-400 dark:text-slate-500'
                                }`}>
                                    {isActive ? 'En progreso...' : isCompleted ? 'Completado' : s.description}
                                </p>
                            </div>

                            {/* Estado Final */}
                            <div>
                                {isCompleted ? (
                                    <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                ) : isDisabled ? (
                                    <Lock className="w-4 h-4 text-gray-300 dark:text-slate-600" />
                                ) : null}
                            </div>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default SetupStepper;