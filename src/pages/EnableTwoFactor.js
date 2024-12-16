// EnableTwoFactorPage.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EnableTwoFactorPage() {
  const { darkMode } = useContext(ThemeContext);
  const [method, setMethod] = useState('email'); // Método de 2FA
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const handleEnable2FA = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/enable-2fa`,
        { method },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(
        'Código 2FA enviado al correo. Activa el 2FA ingresando el código recibido.'
      );
      setIs2FAEnabled(true);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error al activar 2FA';
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
          Habilitar 2FA
        </h2>
        <div className="mb-4">
          <label htmlFor="method" className="block text-sm font-medium">
            Método de 2FA
          </label>
          <select
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className={`block w-full px-3 py-2 border ${
              darkMode
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-300 bg-gray-100 text-black'
            } rounded-lg`}
          >
            <option value="email">Correo Electrónico</option>
            <option value="sms">SMS</option>
          </select>
        </div>
        <button
          onClick={handleEnable2FA}
          className="w-full bg-blue-600 dark:bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-900 transition duration-300"
        >
          Habilitar 2FA
        </button>
        <ToastContainer />
      </div>
    </div>
  );
}

export default EnableTwoFactorPage;
