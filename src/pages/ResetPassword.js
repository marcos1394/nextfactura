// src/pages/ResetPasswordPage.js
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { LockClosedIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

// Reutilizamos el componente de criterios de contraseña de la página de registro
const PasswordCriteria = ({ criteria }) => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-4">
        {Object.entries(criteria).map(([key, { valid, label }]) => (
            <div key={key} className={`flex items-center gap-1.5 transition-colors ${valid ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                {valid ? <CheckCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />}
                <span>{label}</span>
            </div>
        ))}
    </div>
);

/**
 * ResetPasswordPage - El paso final del flujo de recuperación.
 * * Estrategia de UX/UI:
 * 1.  Reutilización de Componentes de Confianza: Se importa el validador de fortaleza de contraseña
 * de la página de registro. Esto no solo ahorra código, sino que crea una experiencia consistente
 * y ayuda al usuario a elegir una contraseña segura.
 * 2.  Validación en Tiempo Real: El botón de "Guardar" permanece deshabilitado hasta que la nueva
 * contraseña cumpla todos los criterios Y coincida con la confirmación. Esto previene errores.
 * 3.  Diseño Seguro y Tranquilizador: El layout familiar de dos paneles y la guía visual clara
 * le dan al usuario la confianza de que está en el lugar correcto y su acción es segura.
 */
function ResetPasswordPage() {
    const { darkMode } = useThemeContext();
    const { token } = useParams(); // El token viene de la URL
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: { valid: false, label: '8+ caracteres' },
        uppercase: { valid: false, label: 'Una mayúscula' },
        lowercase: { valid: false, label: 'Una minúscula' },
        number: { valid: false, label: 'Un número' },
    });

    const validatePassword = (pass) => {
        setPasswordCriteria({
            length: { ...passwordCriteria.length, valid: pass.length >= 8 },
            uppercase: { ...passwordCriteria.uppercase, valid: /[A-Z]/.test(pass) },
            lowercase: { ...passwordCriteria.lowercase, valid: /[a-z]/.test(pass) },
            number: { ...passwordCriteria.number, valid: /\d/.test(pass) },
        });
    };
    
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
    };

    const isFormValid = () => {
        const allCriteriaMet = Object.values(passwordCriteria).every(c => c.valid);
        return allCriteriaMet && password === confirmPassword && password !== '';
    };

    // --- MANEJADOR SIMULADO ---
    const handleResetPassword = (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            alert('Por favor, asegúrate de que la contraseña cumpla todos los criterios y que ambas coincidan.');
            return;
        }
        console.log('Simulando restablecimiento de contraseña con token:', token);
        console.log('Nueva contraseña:', password);
        alert('¡Tu contraseña ha sido actualizada con éxito!');
        navigate('/login');
    };

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
            <div className="grid lg:grid-cols-2 min-h-screen">
                
                {/* --- Panel Izquierdo: Formulario --- */}
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
                        
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Crea tu Nueva Contraseña
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Asegúrate de que sea segura y fácil de recordar para ti.
                        </p>

                        <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
                            <div>
                                <div className="relative">
                                    <LockClosedIcon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Nueva contraseña"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                                    </button>
                                </div>
                                <PasswordCriteria criteria={passwordCriteria} />
                            </div>

                            <div className="relative">
                                <LockClosedIcon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="Confirmar nueva contraseña"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    required
                                />
                            </div>
                            
                            <button
                                type="submit"
                                disabled={!isFormValid()}
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Guardar y Continuar
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* --- Panel Derecho: Branding --- */}
                <div className="hidden lg:block relative">
                    {/* Reutilizamos la misma imagen que en la página de solicitud para mantener la consistencia del flujo */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554042312-42bad586f4a3?q=80&w=1974&auto=format&fit=crop')" }}
                    >
                         <div className="absolute inset-0 bg-gray-900 bg-opacity-50"></div>
                    </div>
                     <div className="relative h-full flex flex-col justify-center p-12">
                        <h2 className="text-3xl font-bold text-white leading-tight">
                           Casi listo. Un último paso para asegurar tu cuenta.
                        </h2>
                        <p className="mt-4 text-lg text-gray-300">
                           Tu tranquilidad es parte de nuestro servicio.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ResetPasswordPage;
