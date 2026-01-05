import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

// 1. IMPORTAMOS LA FUNCIÓN DE REGISTRO
import { registerUser } from '../../services/api';

// 2. IMPORTAMOS EL MODAL (Asegúrate que la ruta sea correcta)
import TermsModal from '../../components/modals/TermsModal';

// --- ICONOS MODERNOS ---
import { 
    User, Mail, Lock, Store, Phone, 
    ArrowRight, ArrowLeft, Check, X, 
    Eye, EyeOff, Loader2, CheckCircle2 
} from 'lucide-react';

// --- COMPONENTE: Barra de Progreso ---
const ProgressBar = ({ currentStep, totalSteps }) => {
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    
    return (
        <div className="w-full mb-8">
            <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                <span className={currentStep >= 1 ? "text-blue-600 dark:text-blue-400" : ""}>Cuenta</span>
                <span className={currentStep >= 2 ? "text-blue-600 dark:text-blue-400" : ""}>Negocio</span>
                <span className={currentStep >= 3 ? "text-blue-600 dark:text-blue-400" : ""}>Confirmar</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
            </div>
        </div>
    );
};

// --- COMPONENTE: Criterios de Contraseña ---
const PasswordCriteriaItem = ({ valid, label }) => (
    <div className={`flex items-center space-x-2 text-xs transition-colors duration-300 ${valid ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
        <div className={`p-0.5 rounded-full ${valid ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
            {valid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
        </div>
        <span>{label}</span>
    </div>
);

function RegisterPage() {
    const { darkMode } = useThemeContext();
    const navigate = useNavigate();
    
    // Estados de UI
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    
    // 3. ESTADO PARA EL MODAL
    const [showTerms, setShowTerms] = useState(false);

    // Estados de Formulario
    const [formData, setFormData] = useState({
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '',
        restaurantName: '', 
        phoneNumber: '', 
        termsAccepted: false,
    });

    // Validación de Contraseña
    const [criteria, setCriteria] = useState({
        length: false, uppercase: false, lowercase: false, number: false, match: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        setFormData(prev => ({ ...prev, [name]: val }));

        if (name === 'password' || name === 'confirmPassword') {
            const pass = name === 'password' ? val : formData.password;
            const confirm = name === 'confirmPassword' ? val : formData.confirmPassword;
            
            setCriteria({
                length: pass.length >= 8,
                uppercase: /[A-Z]/.test(pass),
                lowercase: /[a-z]/.test(pass),
                number: /\d/.test(pass),
                match: pass !== '' && pass === confirm
            });
        }
    };

    const isStep1Valid = () => formData.name && formData.email && Object.values(criteria).every(Boolean);
    const isStep2Valid = () => formData.restaurantName.trim() !== '';

    const handleNextStep = () => { setDirection(1); setCurrentStep(prev => prev + 1); };
    const handlePrevStep = () => { setDirection(-1); setCurrentStep(prev => prev - 1); };

    // --- SUBMIT FINAL (CORREGIDO) ---
    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.termsAccepted) {
            toast.warning('Debes aceptar los términos y condiciones.');
            return;
        }

        setIsLoading(true);

        try {
            // 4. USAMOS LA FUNCIÓN REAL DE REGISTRO
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                restaurantName: formData.restaurantName,
                phoneNumber: formData.phoneNumber
            };

            await registerUser(payload);

            toast.success('¡Cuenta creada con éxito! Bienvenido.');
            
            // Redirigir a planes
            navigate('/plans');

        } catch (err) {
            console.error("Error registro:", err);
            const errorMsg = err.message || 'Error al crear la cuenta.';
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const slideVariants = {
        enter: (direction) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction) => ({ x: direction < 0 ? 50 : -50, opacity: 0 }),
    };

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            <div className="grid lg:grid-cols-2 min-h-screen">

                {/* --- Panel Izquierdo: Wizard --- */}
                <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-white dark:bg-gray-900 shadow-2xl lg:shadow-none z-10">
                    <motion.div 
                        className="w-full max-w-md"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="mb-8 text-center lg:text-left">
                            <Link to="/" className="inline-block hover:opacity-80 transition-opacity mb-6">
                                <img src="/logonextfactura.png" alt="NextManager" className="h-10 w-auto mx-auto lg:mx-0" />
                            </Link>
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                {currentStep === 1 ? 'Crea tu Cuenta' : currentStep === 2 ? 'Tu Restaurante' : 'Finalizar'}
                            </h1>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">
                                {currentStep === 1 ? 'Comienza tu prueba gratuita de 14 días.' : 
                                 currentStep === 2 ? 'Personaliza tu espacio de trabajo.' : 
                                 'Revisa tus datos y comienza.'}
                            </p>
                        </div>

                        <ProgressBar currentStep={currentStep} totalSteps={3} />

                        <div className="relative overflow-hidden min-h-[400px]">
                            <AnimatePresence initial={false} custom={direction} mode="wait">
                                <motion.div
                                    key={currentStep}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    className="w-full"
                                >
                                    
                                    {/* PASO 1 */}
                                    {currentStep === 1 && (
                                        <div className="space-y-5">
                                            <div className="relative group">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    name="name" type="text" placeholder="Nombre completo"
                                                    value={formData.name} onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                                />
                                            </div>
                                            <div className="relative group">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    name="email" type="email" placeholder="correo@ejemplo.com"
                                                    value={formData.email} onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="relative group">
                                                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${criteria.length ? 'text-blue-500' : 'text-gray-400'}`} />
                                                    <input
                                                        name="password" type={showPassword ? 'text' : 'password'} placeholder="Contraseña"
                                                        value={formData.password} onChange={handleChange}
                                                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                    </button>
                                                </div>
                                                <div className="relative group">
                                                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${criteria.match ? 'text-green-500' : 'text-gray-400'}`} />
                                                    <input
                                                        name="confirmPassword" type="password" placeholder="Confirmar contraseña"
                                                        value={formData.confirmPassword} onChange={handleChange}
                                                        className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-gray-800 focus:ring-2 focus:outline-none transition-all ${formData.password && !criteria.match ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'}`}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700/50">
                                                <PasswordCriteriaItem valid={criteria.length} label="8+ caracteres" />
                                                <PasswordCriteriaItem valid={criteria.uppercase} label="Mayúscula" />
                                                <PasswordCriteriaItem valid={criteria.lowercase} label="Minúscula" />
                                                <PasswordCriteriaItem valid={criteria.number} label="Número" />
                                            </div>
                                        </div>
                                    )}

                                    {/* PASO 2 */}
                                    {currentStep === 2 && (
                                        <div className="space-y-6">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 mb-6">
                                                <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center">
                                                    <Store className="w-5 h-5 mr-2" />
                                                    ¡Genial, <strong>{formData.name.split(' ')[0]}</strong>! Ahora cuéntanos sobre tu local.
                                                </p>
                                            </div>
                                            <div className="relative group">
                                                <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    name="restaurantName" type="text" placeholder="Nombre del Restaurante"
                                                    value={formData.restaurantName} onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                                />
                                            </div>
                                            <div className="relative group">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    name="phoneNumber" type="tel" placeholder="Teléfono (Opcional)"
                                                    value={formData.phoneNumber} onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* PASO 3 */}
                                    {currentStep === 3 && (
                                        <div className="space-y-6">
                                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Resumen</h3>
                                                <div className="space-y-3">
                                                    <div className="flex items-start">
                                                        <User className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.name}</p>
                                                            <p className="text-xs text-gray-500">{formData.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start border-t border-gray-200 dark:border-gray-700 pt-3">
                                                        <Store className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.restaurantName}</p>
                                                            <p className="text-xs text-gray-500">{formData.phoneNumber || 'Sin teléfono'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        id="terms" name="termsAccepted" type="checkbox"
                                                        checked={formData.termsAccepted} onChange={handleChange}
                                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                                                        Acepto los Términos y Condiciones
                                                    </label>
                                                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                                                        Al crear una cuenta, aceptas nuestras{' '}
                                                        {/* 5. AQUÍ ESTÁ EL ARREGLO DEL MODAL */}
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => { e.preventDefault(); setShowTerms(true); }}
                                                            className="text-blue-600 hover:underline font-medium focus:outline-none"
                                                        >
                                                            Políticas de Uso y Privacidad
                                                        </button>
                                                        .
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Botones */}
                        <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-100 dark:border-gray-800">
                            {currentStep > 1 ? (
                                <button type="button" onClick={handlePrevStep} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Atrás
                                </button>
                            ) : <div></div>}

                            {currentStep < 3 ? (
                                <button type="button" onClick={handleNextStep} disabled={currentStep === 1 ? !isStep1Valid() : !isStep2Valid()} className="flex items-center py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                    Siguiente <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            ) : (
                                <button type="button" onClick={handleFinalSubmit} disabled={!formData.termsAccepted || isLoading} className="flex items-center py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                    {isLoading ? <><Loader2 className="animate-spin w-4 h-4 mr-2" /> Creando...</> : <>Crear Cuenta <CheckCircle2 className="w-4 h-4 ml-2" /></>}
                                </button>
                            )}
                        </div>
                        
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                ¿Ya tienes cuenta?{' '}
                                <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">Inicia sesión aquí</Link>
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Panel Derecho */}
                <motion.div className="hidden lg:block relative overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop')" }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                    <div className="relative h-full flex flex-col justify-end p-16 max-w-2xl">
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                            <div className="flex items-center mb-6 space-x-2">
                                <div className="h-1 w-12 bg-green-500 rounded-full"></div>
                                <span className="text-green-400 font-medium tracking-wider uppercase text-sm">Únete a la revolución</span>
                            </div>
                            <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">"La mejor decisión que tomamos para nuestro restaurante."</h2>
                            <p className="text-xl text-gray-300 font-light">Comienza hoy y obtén acceso total a todas las herramientas premium por 14 días. Sin tarjetas de crédito.</p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* 6. AQUI VA EL MODAL (Fuera del grid para que se sobreponga) */}
            <TermsModal 
                isOpen={showTerms} 
                onClose={() => setShowTerms(false)} 
            />
        </div>
    );
}

export default RegisterPage;