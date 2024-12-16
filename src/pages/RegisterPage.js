import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import TermsModal from './TermsModal';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
    phoneNumber: '',
  });
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'password') {
      validatePassword(value);
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validatePassword = (password) => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordCriteria(criteria);
  };

  const isPasswordValid = () => {
    return Object.values(passwordCriteria).every((value) => value === true);
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid()) {
      toast.error('La contraseña no cumple con los criterios de seguridad.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    if (!termsAccepted) {
      toast.error('Debes aceptar los términos y condiciones.');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/register`,
        formData
      );
      toast.success('Registro exitoso. Verifica tu correo electrónico para activar tu cuenta.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Error en el registro. Por favor, intenta nuevamente.';
      toast.error(errorMessage);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/google-login`,
        { token: credentialResponse.credential }
      );
      toast.success('Inicio de sesión con Google exitoso.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error al iniciar sesión con Google.');
    }
  };

  const handleGoogleError = () => {
    toast.error('Error al conectar con Google.');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleTermsClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalAccept = () => {
    setIsModalOpen(false);
    setTermsAccepted(true);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div 
          className="w-full max-w-2xl p-8 space-y-8 bg-white dark:bg-gray-800 shadow-2xl rounded-xl transition-all duration-300 ease-in-out transform hover:scale-[1.01]"
        >
          <div className="text-center">
            <h2 className="text-3xl font-extrabold mb-2 text-gray-800 dark:text-white">
              Registro de usuario
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Crea tu cuenta para comenzar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre completo <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:ring-2 focus:outline-none 
                  bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                  focus:ring-blue-500 text-black dark:text-white"
                required
                placeholder="Ingresa tu nombre completo"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:ring-2 focus:outline-none 
                  bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                  focus:ring-blue-500 text-black dark:text-white"
                required
                placeholder="tu.correo@ejemplo.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre del restaurante <span className="text-red-500">*</span>
              </label>
              <input
                id="restaurantName"
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:ring-2 focus:outline-none 
                  bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                  focus:ring-blue-500 text-black dark:text-white"
                required
                placeholder="Nombre de tu restaurante"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Número de teléfono
              </label>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:ring-2 focus:outline-none 
                  bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                  focus:ring-blue-500 text-black dark:text-white"
                placeholder="Opcional"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:ring-2 focus:outline-none 
                    bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                    focus:ring-blue-500 text-black dark:text-white"
                  required
                  placeholder="Contraseña segura"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                <p className={`flex items-center ${passwordCriteria.length ? 'text-green-500' : 'text-red-500'}`}>
                  {passwordCriteria.length ? '✓' : '✗'} Mínimo 8 caracteres
                </p>
                <p className={`flex items-center ${passwordCriteria.uppercase ? 'text-green-500' : 'text-red-500'}`}>
                  {passwordCriteria.uppercase ? '✓' : '✗'} Una mayúscula
                </p>
                <p className={`flex items-center ${passwordCriteria.lowercase ? 'text-green-500' : 'text-red-500'}`}>
                  {passwordCriteria.lowercase ? '✓' : '✗'} Una minúscula
                </p>
                <p className={`flex items-center ${passwordCriteria.number ? 'text-green-500' : 'text-red-500'}`}>
                  {passwordCriteria.number ? '✓' : '✗'} Un número
                </p>
                <p className={`col-span-2 flex items-center ${passwordCriteria.specialChar ? 'text-green-500' : 'text-red-500'}`}>
                  {passwordCriteria.specialChar ? '✓' : '✗'} Un carácter especial
                </p>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirmar contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:ring-2 focus:outline-none 
                    bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                    focus:ring-blue-500 text-black dark:text-white"
                  required
                  placeholder="Repite tu contraseña"
                />
                <button
                  type="button"
                  onClick={toggleShowConfirmPassword}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="md:col-span-2 flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={handleTermsChange}
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                Acepto los{' '}
                <span 
                  className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer" 
                  onClick={handleTermsClick}
                >
                  términos y condiciones
                </span>
              </label>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg 
                  hover:bg-blue-700 transition-colors duration-300 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Registrar
              </button>
            </div>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                O regístrate con
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </div>

          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              ¿Ya tienes una cuenta?{' '}
              <span 
                className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer" 
                onClick={handleLoginClick}
              >
                Inicia sesión
              </span>
            </p>
          </div>

          <ToastContainer />
          <TermsModal isOpen={isModalOpen} onClose={handleModalClose} onAccept={handleModalAccept} />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default RegisterPage;