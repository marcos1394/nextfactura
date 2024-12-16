// ResetPasswordPage.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ResetPasswordPage() {
  const { darkMode } = useContext(ThemeContext);
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/reset-password`,
        { token, newPassword: password }
      );
      toast.success(
        'Contraseña actualizada. Redirigiendo a inicio de sesión...'
      );
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Error al restablecer la contraseña';
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
          Restablecer Contraseña
        </h2>
        <input
          type="password"
          placeholder="Nueva Contraseña"
          className={`block w-full px-3 py-2 border ${
            darkMode
              ? 'border-gray-600 bg-gray-700 text-white'
              : 'border-gray-300 bg-gray-100 text-black'
          } rounded-lg mb-4`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirmar Nueva Contraseña"
          className={`block w-full px-3 py-2 border ${
            darkMode
              ? 'border-gray-600 bg-gray-700 text-white'
              : 'border-gray-300 bg-gray-100 text-black'
          } rounded-lg mb-4`}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          onClick={handleResetPassword}
          className="w-full bg-blue-600 dark:bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-900 transition duration-300"
        >
          Restablecer Contraseña
        </button>
        <ToastContainer />
      </div>
    </div>
  );
}

export default ResetPasswordPage;
