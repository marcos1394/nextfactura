// ForgotPasswordPage.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPasswordPage() {
  const { darkMode } = useContext(ThemeContext);
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
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
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      <div
        className={`max-w-lg w-full p-8 ${
          darkMode
            ? 'bg-gray-800 text-white'
            : 'bg-gray-100 text-black'
        } rounded-lg shadow-lg`}
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          Recuperar Contraseña
        </h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          className={`block w-full px-3 py-2 border ${
            darkMode
              ? 'border-gray-600 bg-gray-700 text-white'
              : 'border-gray-300 bg-gray-100 text-black'
          } rounded-lg mb-4`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleForgotPassword}
          className="w-full bg-blue-600 dark:bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-900 transition duration-300"
        >
          Enviar enlace de recuperación
        </button>
        <ToastContainer />
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
