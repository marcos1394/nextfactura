// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext'; // Asumiendo que existe

// Importamos iconos para cada campo, mejorando la guía visual
import { UserIcon, EnvelopeIcon, LockClosedIcon, BuildingStorefrontIcon, PhoneIcon, CheckCircleIcon, XCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

// Componente para la barra de progreso
const ProgressBar = ({ currentStep, totalSteps }) => {
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
            <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
        </div>
    );
};

// Componente para los criterios de la contraseña
const PasswordCriteria = ({ criteria }) => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-2">
        {Object.entries(criteria).map(([key, { valid, label }]) => (
            <div key={key} className={`flex items-center gap-1.5 transition-colors ${valid ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                {valid ? <CheckCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />}
                <span>{label}</span>
            </div>
        ))}
    </div>
);

/**
 * RegisterPage - Rediseñada con una estrategia de UX de divulgación progresiva.
 * * Estrategia de UX/UI:
 * 1.  Formulario Multi-paso: Se divide el registro en 3 pasos lógicos para reducir la carga cognitiva
 * y hacer que el proceso parezca menos abrumador. Esto aumenta drásticamente la tasa de finalización.
 * 2.  Gestión de Expectativas: La barra de progreso visual informa al usuario sobre su avance,
 * eliminando la incertidumbre y motivándolo a continuar.
 * 3.  Experiencia de Marca Consistente: Se reutiliza el layout de dos paneles de la página de inicio de
 * sesión para crear una experiencia de usuario unificada y profesional.
 * 4.  Feedback Interactivo: Los criterios de la contraseña y los estados de los botones proporcionan
 * una retroalimentación clara e instantánea, guiando al usuario sin esfuerzo.
 */
function RegisterPage() {
    const { darkMode } = useThemeContext();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        restaurantName: '', phoneNumber: '', termsAccepted: false,
    });
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: { valid: false, label: '8+ caracteres' },
        uppercase: { valid: false, label: 'Una mayúscula' },
        lowercase: { valid: false, label: 'Una minúscula' },
        number: { valid: false, label: 'Un número' },
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        if (name === 'password') validatePassword(value);
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const validatePassword = (password) => {
        setPasswordCriteria({
            length: { ...passwordCriteria.length, valid: password.length >= 8 },
            uppercase: { ...passwordCriteria.uppercase, valid: /[A-Z]/.test(password) },
            lowercase: { ...passwordCriteria.lowercase, valid: /[a-z]/.test(password) },
            number: { ...passwordCriteria.number, valid: /\d/.test(password) },
        });
    };

    const isStep1Valid = () => {
        const { name, email, password, confirmPassword } = formData;
        const allCriteriaValid = Object.values(passwordCriteria).every(c => c.valid);
        return name && email && password && allCriteriaValid && password === confirmPassword;
    };

    const isStep2Valid = () => formData.restaurantName.trim() !== '';

    // --- MANEJADORES DE NAVEGACIÓN Y ENVÍO (SIMULADOS) ---
    const handleNextStep = () => setCurrentStep(prev => prev + 1);
    const handlePrevStep = () => setCurrentStep(prev => prev - 1);
    const handleFinalSubmit = (e) => {
        e.preventDefault();
        if (!formData.termsAccepted) {
            alert('Debes aceptar los términos y condiciones.');
            return;
        }
        console.log('REGISTRO SIMULADO ENVIADO:', formData);
        alert('¡Registro exitoso! Serás redirigido.');
        navigate('/plans'); // Redirigir al usuario a seleccionar un plan tras el registro
    };

    const slideVariants = {
        enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
    };
    const [direction, setDirection] = useState(0);

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
            <div className="grid lg:grid-cols-2 min-h-screen">

                {/* --- Panel Izquierdo: Formulario Multi-paso --- */}
                <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                    <motion.div
                        className="w-full max-w-md"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <Link to="/" className="mb-8 inline-block">
                            <img src="/logo-nextmanager.svg" alt="NextManager Logo" className="h-10" />
                        </Link>
                        
                        <ProgressBar currentStep={currentStep} totalSteps={3} />

                        <div className="overflow-hidden relative h-auto">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={currentStep}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ type: 'tween', ease: 'easeInOut', duration: 0.5 }}
                                    className="w-full"
                                >
                                    {/* --- PASO 1: CUENTA --- */}
                                    {currentStep === 1 && (
                                        <div className="space-y-5">
                                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Crea tu Cuenta</h1>
                                            <p className="text-gray-600 dark:text-gray-400">Empecemos con tus datos básicos.</p>
                                            <div className="relative">
                                                <UserIcon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                                                <input name="name" type="text" placeholder="Nombre completo" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
                                            </div>
                                            <div className="relative">
                                                <EnvelopeIcon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                                                <input name="email" type="email" placeholder="correo@ejemplo.com" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
                                            </div>
                                            <div className="relative">
                                                <LockClosedIcon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                                                <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Contraseña" value={formData.password} onChange={handleChange} className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                    {showPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                                                </button>
                                            </div>
                                            <PasswordCriteria criteria={passwordCriteria} />
                                            <div className="relative">
                                                <LockClosedIcon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                                                <input name="confirmPassword" type="password" placeholder="Confirmar contraseña" value={formData.confirmPassword} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
                                            </div>
                                        </div>
                                    )}

                                    {/* --- PASO 2: NEGOCIO --- */}
                                    {currentStep === 2 && (
                                        <div className="space-y-5">
                                             <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Sobre tu Restaurante</h1>
                                            <p className="text-gray-600 dark:text-gray-400">Esta información nos ayudará a personalizar tu experiencia.</p>
                                            <div className="relative">
                                                <BuildingStorefrontIcon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                                                <input name="restaurantName" type="text" placeholder="Nombre del restaurante" value={formData.restaurantName} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
                                            </div>
                                            <div className="relative">
                                                <PhoneIcon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                                                <input name="phoneNumber" type="tel" placeholder="Número de teléfono (Opcional)" value={formData.phoneNumber} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
                                            </div>
                                        </div>
                                    )}

                                    {/* --- PASO 3: CONFIRMACIÓN --- */}
                                    {currentStep === 3 && (
                                        <div className="space-y-6">
                                             <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Último Paso</h1>
                                            <p className="text-gray-600 dark:text-gray-400">Revisa que todo esté correcto y acepta nuestros términos de servicio para finalizar.</p>
                                            <div className="flex items-start">
                                                <input id="terms" name="termsAccepted" type="checkbox" checked={formData.termsAccepted} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1" />
                                                <label htmlFor="terms" className="ml-3 block text-sm text-gray-900 dark:text-gray-300">
                                                    He leído y acepto los <a href="/terms" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">Términos y Condiciones</a> y la <a href="/privacy" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">Política de Privacidad</a>.
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* --- Botones de Navegación --- */}
                        <div className="mt-8 flex justify-between items-center">
                            {currentStep > 1 ? (
                                <button type="button" onClick={() => {setDirection(-1); handlePrevStep();}} className="py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">Atrás</button>
                            ) : <div />}
                            
                            {currentStep < 3 && (
                                <button type="button" onClick={() => {setDirection(1); handleNextStep();}} disabled={currentStep === 1 ? !isStep1Valid() : !isStep2Valid()} className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed">Siguiente</button>
                            )}
                            
                            {currentStep === 3 && (
                                <button type="button" onClick={handleFinalSubmit} disabled={!formData.termsAccepted} className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed">Crear Cuenta</button>
                            )}
                        </div>

                        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                            ¿Ya tienes una cuenta?{' '}
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                Inicia sesión
                            </Link>
                        </p>
                    </motion.div>
                </div>

                {/* --- Panel Derecho: Branding --- */}
                <motion.div className="hidden lg:block relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                >
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')" }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                    </div>
                    <div className="relative h-full flex flex-col justify-end p-12">
                        <h2 className="text-3xl font-bold text-white leading-tight">
                           "Únete a cientos de restaurantes que ya están tomando decisiones más inteligentes."
                        </h2>
                        <p className="mt-4 text-lg text-gray-300">
                            Empieza en minutos. Transforma tu negocio para siempre.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default RegisterPage;
