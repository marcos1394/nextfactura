import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useThemeContext } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
    Lock, 
    Eye, 
    EyeOff, 
    Check, 
    X, 
    ShieldCheck, 
    Loader2, 
    ArrowRight 
} from 'lucide-react';

// --- SUBCOMPONENTE: Criterios de Contraseña ---
const PasswordCriteriaItem = ({ valid, label }) => (
    <div className={`flex items-center space-x-2 text-xs transition-colors duration-300 ${valid ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
        <div className={`p-0.5 rounded-full ${valid ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
            {valid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
        </div>
        <span>{label}</span>
    </div>
);

/**
 * ResetPasswordPage - Restablecimiento final
 */
function ResetPasswordPage() {
    const { darkMode } = useThemeContext();
    const { token } = useParams();
    const navigate = useNavigate();

    // Estados
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Toggles de visibilidad independientes
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);

    // Estado de validación
    const [criteria, setCriteria] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        match: false
    });

    // Efecto para validar en tiempo real
    useEffect(() => {
        setCriteria({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            match: password !== '' && password === confirmPassword
        });
    }, [password, confirmPassword]);

    const isFormValid = Object.values(criteria).every(Boolean);

    // --- MANEJADOR DE ENVÍO ---
    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (!isFormValid) return;

        setIsLoading(true);

        // Simulación de API
        setTimeout(() => {
            console.log('Token procesado:', token);
            setIsLoading(false);
            toast.success('¡Contraseña actualizada correctamente!');
            navigate('/login');
        }, 2000);
    };

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            <div className="grid lg:grid-cols-2 min-h-screen">
                
                {/* --- Panel Izquierdo: Formulario --- */}
                <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-white dark:bg-gray-900 shadow-2xl lg:shadow-none z-10">
                    <motion.div 
                        className="w-full max-w-md"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {/* Header */}
                        <div className="text-center lg:text-left mb-8">
                            <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
                                <img src="/logo192.png" alt="NextManager" className="h-10 w-auto mx-auto lg:mx-0" />
                            </Link>
                        </div>

                        <div className="mb-8">
                            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                                <ShieldCheck className="w-6 h-6" />
                            </span>
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                Nueva Contraseña
                            </h1>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">
                                Tu seguridad es primero. Define una clave robusta.
                            </p>
                        </div>

                        <form onSubmit={handleResetPassword} className="space-y-6">
                            
                            {/* Input: Nueva Contraseña */}
                            <div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className={`h-5 w-5 transition-colors ${criteria.length ? 'text-blue-500' : 'text-gray-400'}`} />
                                    </div>
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Nueva contraseña"
                                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                                    >
                                        {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                
                                {/* Criterios Visuales */}
                                <div className="mt-3 grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700/50">
                                    <PasswordCriteriaItem valid={criteria.length} label="8+ caracteres" />
                                    <PasswordCriteriaItem valid={criteria.uppercase} label="Una Mayúscula" />
                                    <PasswordCriteriaItem valid={criteria.lowercase} label="Una minúscula" />
                                    <PasswordCriteriaItem valid={criteria.number} label="Un número" />
                                </div>
                            </div>

                            {/* Input: Confirmar Contraseña */}
                            <div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className={`h-5 w-5 transition-colors ${criteria.match ? 'text-green-500' : 'text-gray-400'}`} />
                                    </div>
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirmar contraseña"
                                        className={`block w-full pl-10 pr-10 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm ${
                                            password && !criteria.match ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                                    >
                                        {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {password && !criteria.match && (
                                    <p className="mt-1 text-xs text-red-500 ml-1">Las contraseñas no coinciden</p>
                                )}
                            </div>
                            
                            {/* Botón de Acción */}
                            <button
                                type="submit"
                                disabled={!isFormValid || isLoading}
                                className={`w-full flex justify-center items-center py-3.5 px-4 font-bold rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                                    ${isFormValid 
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl' 
                                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                        Actualizando...
                                    </>
                                ) : (
                                    <>
                                        Guardar y Acceder
                                        <ArrowRight className="ml-2 h-5 w-5 opacity-70" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* --- Panel Derecho: Branding --- */}
                <motion.div 
                    className="hidden lg:block relative overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554042312-42bad586f4a3?q=80&w=1974&auto=format&fit=crop')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-gray-900/80"></div>
                    
                    <div className="relative h-full flex flex-col justify-center p-16 max-w-2xl">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
                                Casi listo.
                            </h2>
                            <p className="text-xl text-gray-200 font-light">
                                "La única manera de hacer un gran trabajo es amar lo que haces." <br/>
                                <span className="text-sm mt-2 block text-gray-400">— Steve Jobs</span>
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}

export default ResetPasswordPage;