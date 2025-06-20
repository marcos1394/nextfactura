// src/pages/EnableTwoFactorPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext';
import { ShieldCheckIcon, QrCodeIcon, EnvelopeIcon, DocumentDuplicateIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

// --- SUBCOMPONENTES PARA CLARIDAD ---

// Barra de Progreso
const ProgressBar = ({ currentStep, totalSteps }) => {
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
            <motion.div className="bg-blue-600 h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 0.5, ease: 'easeInOut' }} />
        </div>
    );
};

// Tarjeta para seleccionar el método 2FA
const MethodCard = ({ icon: Icon, title, description, value, selectedMethod, onSelect }) => (
    <div
        onClick={() => onSelect(value)}
        className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
            selectedMethod === value ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700 hover:border-blue-400'
        }`}
    >
        <div className="flex items-center gap-4">
            <Icon className={`w-8 h-8 ${selectedMethod === value ? 'text-blue-600' : 'text-gray-500'}`} />
            <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
            </div>
        </div>
    </div>
);


/**
 * EnableTwoFactorPage - Un flujo completo y seguro para la configuración de 2FA.
 * * Estrategia de UX/UI:
 * 1.  Flujo Guiado y Educativo: Se divide la configuración en 4 pasos claros, explicando la importancia
 * de cada uno (por qué 2FA, cómo verificar, por qué guardar los códigos).
 * 2.  Selección Visual de Métodos: Se reemplaza el <select> por tarjetas interactivas, haciendo la
 * elección más fácil y visualmente atractiva.
 * 3.  Paso de Recuperación Obligatorio: Se fuerza al usuario a reconocer que ha guardado sus códigos
 * de recuperación. Este es un paso CRUCIAL que previene futuros problemas de soporte y frustración.
 * 4.  Diseño Consistente y Seguro: Se mantiene el layout de dos paneles y se usan iconos de seguridad
 * para crear una atmósfera de confianza durante todo el proceso.
 */
function EnableTwoFactorPage() {
    const { darkMode } = useThemeContext();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [recoveryCodesSaved, setRecoveryCodesSaved] = useState(false);

    // Mock data
    const mockRecoveryCodes = [
        '3k9d-j4f8-p2q7-w8e1', 'a5s6-d7f8-g9h0-j1k2',
        'z3x4-c5v6-b7n8-m9l0', 'q1w2-e3r4-t5y6-u7i8',
        'p0o9-i8u7-y6t5-r4e3', 'f1g2-h3j4-k5l6-m7n8'
    ];

    // --- MANEJADORES DE NAVEGACIÓN (SIMULADOS) ---
    const handleNextStep = () => setCurrentStep(prev => prev + 1);
    const handlePrevStep = () => setCurrentStep(prev => prev - 1);

    const handleVerification = () => {
        // En una app real, aquí validarías el código con el backend.
        if (verificationCode === '123456') { // Simulación
            console.log('Código de verificación correcto.');
            handleNextStep();
        } else {
            alert('Código de verificación incorrecto. Intenta de nuevo.');
        }
    };

    const handleFinishSetup = () => {
        if (!recoveryCodesSaved) {
            alert('Por favor, confirma que has guardado tus códigos de recuperación.');
            return;
        }
        console.log('Configuración de 2FA finalizada.');
        handleNextStep(); // Ir al paso final de confirmación
    };

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
            <div className="grid lg:grid-cols-2 min-h-screen">
                
                {/* --- Panel Izquierdo: Flujo de Configuración --- */}
                <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                    <div className="w-full max-w-lg">
                        <Link to="/" className="mb-8 inline-block">
                            <img src="/logo-nextmanager.svg" alt="NextManager Logo" className="h-10" />
                        </Link>
                        <ProgressBar currentStep={currentStep} totalSteps={4} />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                {/* --- PASO 1: SELECCIÓN DE MÉTODO --- */}
                                {currentStep === 1 && (
                                    <div>
                                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Añade una capa extra de seguridad</h1>
                                        <p className="mt-2 text-gray-600 dark:text-gray-400">La Autenticación de Dos Factores (2FA) protege tu cuenta de accesos no autorizados. Elige tu método preferido.</p>
                                        <div className="mt-8 space-y-4">
                                            <MethodCard icon={ShieldCheckIcon} title="App de Autenticación" description="La opción más segura. Usa Google Authenticator, Authy, etc." value="app" selectedMethod={selectedMethod} onSelect={setSelectedMethod} />
                                            <MethodCard icon={EnvelopeIcon} title="Correo Electrónico" description="Recibe un código en tu email cada vez que inicies sesión." value="email" selectedMethod={selectedMethod} onSelect={setSelectedMethod} />
                                        </div>
                                        <div className="mt-8 flex justify-end">
                                            <button onClick={handleNextStep} disabled={!selectedMethod} className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed">Continuar</button>
                                        </div>
                                    </div>
                                )}

                                {/* --- PASO 2: VERIFICACIÓN --- */}
                                {currentStep === 2 && (
                                    <div>
                                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Verifica tu Método</h1>
                                        {selectedMethod === 'app' && (
                                            <>
                                                <p className="mt-2 text-gray-600 dark:text-gray-400">1. Escanea este código QR con tu app de autenticación.</p>
                                                <div className="my-6 p-4 bg-white rounded-lg inline-block shadow-md">
                                                    <QrCodeIcon className="w-40 h-40 text-black" /> {/* Placeholder para el QR real */}
                                                </div>
                                                <p className="mt-2 text-gray-600 dark:text-gray-400">2. Ingresa el código de 6 dígitos que aparece en tu app.</p>
                                            </>
                                        )}
                                        {selectedMethod === 'email' && (
                                            <p className="mt-2 text-gray-600 dark:text-gray-400">Hemos enviado un código de 6 dígitos a tu correo electrónico. Ingrésalo a continuación para verificar.</p>
                                        )}
                                        <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="123456" maxLength="6" className="w-full mt-4 text-center text-2xl tracking-[.5em] font-mono p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"/>
                                        <div className="mt-8 flex justify-between items-center">
                                            <button onClick={handlePrevStep} className="py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2"><ArrowLeftIcon className="w-4 h-4"/> Atrás</button>
                                            <button onClick={handleVerification} disabled={verificationCode.length !== 6} className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed">Verificar y Continuar</button>
                                        </div>
                                    </div>
                                )}

                                {/* --- PASO 3: CÓDIGOS DE RECUPERACIÓN --- */}
                                {currentStep === 3 && (
                                    <div>
                                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Guarda tus Códigos de Recuperación</h1>
                                        <p className="mt-2 text-red-600 dark:text-red-400 font-semibold">¡Paso importante! Guarda estos códigos en un lugar seguro. Si pierdes tu teléfono, los necesitarás para acceder a tu cuenta.</p>
                                        <div className="my-6 p-4 grid grid-cols-2 gap-4 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-gray-800 dark:text-gray-200">
                                            {mockRecoveryCodes.map(code => <span key={code}>{code}</span>)}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => navigator.clipboard.writeText(mockRecoveryCodes.join('\n'))} className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"><DocumentDuplicateIcon className="w-5 h-5"/> Copiar</button>
                                            {/* Otros botones como Imprimir o Descargar irían aquí */}
                                        </div>
                                        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                                            <div className="flex items-start">
                                                <input id="saved-codes" type="checkbox" checked={recoveryCodesSaved} onChange={(e) => setRecoveryCodesSaved(e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1" />
                                                <label htmlFor="saved-codes" className="ml-3 block text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                                    Sí, he guardado mis códigos de recuperación en un lugar seguro.
                                                </label>
                                            </div>
                                        </div>
                                        <div className="mt-8 flex justify-between items-center">
                                            <button onClick={handlePrevStep} className="py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2"><ArrowLeftIcon className="w-4 h-4"/> Atrás</button>
                                            <button onClick={handleFinishSetup} disabled={!recoveryCodesSaved} className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed">Finalizar Configuración</button>
                                        </div>
                                    </div>
                                )}

                                {/* --- PASO 4: CONFIRMACIÓN FINAL --- */}
                                {currentStep === 4 && (
                                     <div className="text-center bg-green-50 dark:bg-green-900/20 p-8 rounded-lg">
                                        <ShieldCheckIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                            ¡Todo Listo!
                                        </h1>
                                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                                            La Autenticación de Dos Factores está ahora <strong>activa</strong> en tu cuenta. Tu negocio está más seguro que nunca.
                                        </p>
                                        <button onClick={() => navigate('/dashboard')} className="mt-8 inline-block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                                            Ir al Dashboard
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* --- Panel Derecho: Branding --- */}
                <div className="hidden lg:block relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900"></div>
                     <div className="relative h-full flex flex-col justify-center items-center p-12 text-center text-white">
                        <ShieldCheckIcon className="w-24 h-24 mb-6 text-blue-400 opacity-80"/>
                        <h2 className="text-4xl font-bold leading-tight">
                           La seguridad no es una opción, es una promesa.
                        </h2>
                        <p className="mt-4 text-lg text-blue-200 max-w-sm">
                           Protegemos tus datos para que tú te puedas enfocar en hacer crecer tu negocio.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default EnableTwoFactorPage;
