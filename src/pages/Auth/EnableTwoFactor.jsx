import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import { 
    ShieldCheck, 
    Smartphone, 
    Mail, 
    Copy, 
    ArrowLeft, 
    CheckCircle2, 
    QrCode, 
    Lock, 
    AlertTriangle, 
    Loader2, 
    ArrowRight 
} from 'lucide-react';

// --- COMPONENTE: Barra de Progreso ---
const ProgressBar = ({ currentStep, totalSteps }) => {
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    return (
        <div className="w-full mb-8">
            <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                <span className={currentStep >= 1 ? "text-blue-600 dark:text-blue-400" : ""}>Método</span>
                <span className={currentStep >= 2 ? "text-blue-600 dark:text-blue-400" : ""}>Verificar</span>
                <span className={currentStep >= 3 ? "text-blue-600 dark:text-blue-400" : ""}>Respaldo</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                    className="bg-blue-600 h-full" 
                    initial={{ width: 0 }} 
                    animate={{ width: `${progressPercentage}%` }} 
                    transition={{ duration: 0.5, ease: 'easeInOut' }} 
                />
            </div>
        </div>
    );
};

// --- COMPONENTE: Tarjeta de Selección ---
const MethodCard = ({ icon: Icon, title, description, value, selectedMethod, onSelect }) => (
    <div
        onClick={() => onSelect(value)}
        className={`relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 group ${
            selectedMethod === value 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm bg-white dark:bg-gray-800'
        }`}
    >
        <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${selectedMethod === value ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-blue-50 dark:group-hover:bg-gray-600'}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h3 className={`font-bold text-lg ${selectedMethod === value ? 'text-blue-900 dark:text-white' : 'text-gray-900 dark:text-gray-200'}`}>
                    {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    {description}
                </p>
            </div>
            {selectedMethod === value && (
                <div className="absolute top-5 right-5 text-blue-500">
                    <CheckCircle2 className="w-5 h-5" />
                </div>
            )}
        </div>
    </div>
);

// --- PÁGINA PRINCIPAL ---
function EnableTwoFactorPage() {
    const { darkMode } = useThemeContext();
    const navigate = useNavigate();

    // Estados
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [otp, setOtp] = useState(new Array(6).fill("")); // Array para 6 inputs
    const [recoveryCodesSaved, setRecoveryCodesSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Refs para manejo de foco en OTP
    const inputRefs = useRef([]);

    // Mock Data
    const mockRecoveryCodes = [
        '3K9D-J4F8', 'A5S6-D7F8', 'Z3X4-C5V6', 
        'Q1W2-E3R4', 'P0O9-I8U7', 'F1G2-H3J4'
    ];

    // --- LÓGICA OTP (Input de 6 casillas) ---
    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Enfocar siguiente input si se escribió un número
        if (element.value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const data = e.clipboardData.getData("text").slice(0, 6).split("");
        if (data.length === 6) {
            setOtp(data);
            inputRefs.current[5].focus();
        }
    };

    // --- MANEJADORES DE NAVEGACIÓN ---
    const handleNextStep = () => setCurrentStep(prev => prev + 1);
    const handlePrevStep = () => setCurrentStep(prev => prev - 1);

    const handleVerification = async () => {
        setIsLoading(true);
        // Simulación de API
        await new Promise(r => setTimeout(r, 1500));
        
        const code = otp.join("");
        if (code === '123456') { 
            setIsLoading(false);
            toast.success("¡Código verificado correctamente!");
            handleNextStep();
        } else {
            setIsLoading(false);
            toast.error("Código incorrecto. Intenta con 123456.");
            setOtp(new Array(6).fill(""));
            inputRefs.current[0].focus();
        }
    };

    const handleFinishSetup = () => {
        if (!recoveryCodesSaved) {
            toast.warn('Debes confirmar que guardaste los códigos.');
            return;
        }
        toast.success("¡2FA Activado exitosamente!");
        handleNextStep(); // Paso final
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(mockRecoveryCodes.join('\n'));
        toast.success("Códigos copiados al portapapeles");
    };

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            <div className="grid lg:grid-cols-2 min-h-screen">
                
                {/* --- Panel Izquierdo: Configuración --- */}
                <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-white dark:bg-gray-900 shadow-2xl lg:shadow-none z-10">
                    <motion.div 
                        className="w-full max-w-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Header */}
                        <div className="mb-8">
                            <Link to="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-6">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Cancelar y volver
                            </Link>
                            <img src="/logo192.png" alt="NextManager" className="h-10 w-auto mb-6" />
                            <ProgressBar currentStep={currentStep} totalSteps={4} />
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* --- PASO 1: SELECCIÓN --- */}
                                {currentStep === 1 && (
                                    <>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                            Protege tu cuenta
                                        </h1>
                                        <p className="text-gray-500 dark:text-gray-400 mb-8">
                                            La autenticación de dos factores añade una capa extra de seguridad. Elige cómo quieres recibir tus códigos.
                                        </p>
                                        
                                        <div className="space-y-4 mb-8">
                                            <MethodCard 
                                                icon={Smartphone} 
                                                title="App de Autenticación" 
                                                description="Recomendado. Usa Google Authenticator, Authy o Microsoft Authenticator." 
                                                value="app" 
                                                selectedMethod={selectedMethod} 
                                                onSelect={setSelectedMethod} 
                                            />
                                            <MethodCard 
                                                icon={Mail} 
                                                title="Correo Electrónico" 
                                                description="Te enviaremos un código temporal a tu email cada vez que inicies sesión." 
                                                value="email" 
                                                selectedMethod={selectedMethod} 
                                                onSelect={setSelectedMethod} 
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <button 
                                                onClick={handleNextStep} 
                                                disabled={!selectedMethod}
                                                className="flex items-center py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            >
                                                Continuar
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* --- PASO 2: VERIFICACIÓN --- */}
                                {currentStep === 2 && (
                                    <>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                            Verifica tu dispositivo
                                        </h1>
                                        
                                        {selectedMethod === 'app' ? (
                                            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8 text-center">
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                    Escanea este código QR con tu aplicación.
                                                </p>
                                                <div className="bg-white p-4 inline-block rounded-lg shadow-sm border border-gray-100">
                                                    {/* 

[Image of QR Code]
 */}
                                                    <QrCode className="w-32 h-32 text-gray-900" />
                                                </div>
                                                <p className="mt-4 text-xs text-gray-400 font-mono">
                                                    Llave: J7K2-M4N5-P6Q8-R9S0
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800 mb-8 flex items-start">
                                                <Mail className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                                                <div>
                                                    <h3 className="font-semibold text-blue-900 dark:text-white">Código enviado</h3>
                                                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                                        Hemos enviado un código de 6 dígitos a tu correo. Revisa tu bandeja de entrada.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mb-8">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                                                Ingresa el código de 6 dígitos
                                            </label>
                                            <div className="flex justify-center gap-2">
                                                {otp.map((data, index) => (
                                                    <input
                                                        key={index}
                                                        type="text"
                                                        maxLength="1"
                                                        ref={el => inputRefs.current[index] = el}
                                                        value={data}
                                                        onChange={e => handleOtpChange(e.target, index)}
                                                        onKeyDown={e => handleKeyDown(e, index)}
                                                        onPaste={handlePaste}
                                                        className="w-12 h-14 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-xl font-bold bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <button onClick={handlePrevStep} className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm font-medium">
                                                Atrás
                                            </button>
                                            <button 
                                                onClick={handleVerification} 
                                                disabled={otp.join("").length !== 6 || isLoading}
                                                className="flex items-center py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            >
                                                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Verificar"}
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* --- PASO 3: CÓDIGOS DE RECUPERACIÓN --- */}
                                {currentStep === 3 && (
                                    <>
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-400">
                                                <AlertTriangle className="w-6 h-6" />
                                            </div>
                                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                Códigos de Recuperación
                                            </h1>
                                        </div>
                                        
                                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                                            Si pierdes acceso a tu dispositivo, estos códigos son la <strong className="text-gray-900 dark:text-white">única forma</strong> de entrar a tu cuenta. Guárdalos en un lugar seguro (como un gestor de contraseñas).
                                        </p>

                                        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 font-mono text-sm grid grid-cols-2 gap-4 mb-6 relative group">
                                            {mockRecoveryCodes.map((code, i) => (
                                                <div key={i} className="bg-white dark:bg-gray-900 p-2 rounded text-center text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                                    {code}
                                                </div>
                                            ))}
                                            
                                            <button 
                                                onClick={copyToClipboard}
                                                className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                                                title="Copiar todo"
                                            >
                                                <Copy className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                                            </button>
                                        </div>

                                        <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800/50 mb-8">
                                            <label className="flex items-start cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={recoveryCodesSaved} 
                                                    onChange={(e) => setRecoveryCodesSaved(e.target.checked)}
                                                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <span className="ml-3 text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                                                    Confirmo que he guardado estos códigos en un lugar seguro.
                                                </span>
                                            </label>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <button onClick={handlePrevStep} className="text-gray-500 hover:text-gray-900 text-sm font-medium">
                                                Atrás
                                            </button>
                                            <button 
                                                onClick={handleFinishSetup} 
                                                disabled={!recoveryCodesSaved}
                                                className="flex items-center py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            >
                                                Activar 2FA
                                                <ShieldCheck className="w-4 h-4 ml-2" />
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* --- PASO 4: ÉXITO --- */}
                                {currentStep === 4 && (
                                    <div className="text-center py-8">
                                        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
                                            <Lock className="w-12 h-12 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                            ¡Cuenta Blindada!
                                        </h1>
                                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                            La autenticación de dos factores está activa. La próxima vez que inicies sesión, te pediremos un código de seguridad.
                                        </p>
                                        
                                        <button 
                                            onClick={() => navigate('/dashboard')} 
                                            className="inline-flex items-center py-3 px-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                                        >
                                            Volver al Dashboard
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* --- Panel Derecho: Visuals --- */}
                <motion.div 
                    className="hidden lg:block relative overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-gray-900 via-gray-900/80 to-blue-900/40"></div>
                    
                    <div className="relative h-full flex flex-col justify-center items-center p-16 text-center">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="inline-block p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 mb-8">
                                <ShieldCheck className="w-16 h-16 text-blue-400" />
                            </div>
                            <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
                                Seguridad de nivel bancario para tu negocio.
                            </h2>
                            <p className="text-xl text-gray-300 font-light max-w-lg mx-auto">
                                "La confianza tarda años en construirse, segundos en romperse y una eternidad en repararse."
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default EnableTwoFactorPage;