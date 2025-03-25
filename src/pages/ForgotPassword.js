// ForgotPasswordPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useThemeContext } from '../context/ThemeContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPasswordPage() {
  const { darkMode } = useThemeContext();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // Indicador de carga

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Por favor, ingresa tu correo electrónico.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/forgot-password`,
        { email }
      );
      toast.success(
        'Correo de recuperación enviado. Verifica tu bandeja de entrada.'
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error al enviar el correo';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      } transition-colors duration-300`}
    >
      <div
        className={`max-w-lg w-full p-8 ${
          darkMode
            ? 'bg-gray-800 text-white'
            : 'bg-gray-100 text-black'
        } rounded-2xl shadow-lg transition-all duration-300`}
      >
        <h2 className="text-3xl font-extrabold text-center mb-6">
          Recuperar Contraseña
        </h2>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-2"
          >
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            placeholder="Ingresa tu correo"
            className={`block w-full px-4 py-2 border focus:outline-none focus:ring-2 ${
              darkMode
                ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500'
                : 'border-gray-300 bg-gray-100 text-black focus:ring-blue-400'
            } rounded-lg transition duration-300`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Correo electrónico"
          />
        </div>
        <button
          onClick={handleForgotPassword}
          disabled={loading}
          className={`w-full flex justify-center items-center bg-blue-600 text-white py-3 rounded-lg transition duration-300 ${
            loading
              ? 'opacity-70 cursor-not-allowed'
              : 'hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : (
            'Enviar enlace de recuperación'
          )}
        </button>
        <ToastContainer />
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
