// EnableTwoFactorPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useThemeContext } from '../context/ThemeContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EnableTwoFactorPage() {
  const { darkMode } = useThemeContext();
  const [method, setMethod] = useState('email'); // Método de 2FA
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [loading, setLoading] = useState(false); // Indicador de carga

  const handleEnable2FA = async () => {
    setLoading(true);
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
          Habilitar 2FA
        </h2>

        {is2FAEnabled ? (
          <div
            className={`p-4 mb-4 text-center rounded-lg ${
              darkMode
                ? 'bg-green-700 text-green-200'
                : 'bg-green-100 text-green-800'
            }`}
          >
            ¡2FA habilitado con éxito!
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label
                htmlFor="method"
                className="block text-sm font-medium"
              >
                Selecciona el método de 2FA
              </label>
              <select
                id="method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className={`block w-full px-4 py-2 border focus:outline-none focus:ring-2 ${
                  darkMode
                    ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500'
                    : 'border-gray-300 bg-gray-100 text-black focus:ring-blue-400'
                } rounded-lg transition duration-300`}
                aria-label="Seleccionar método de 2FA"
              >
                <option value="email">Correo Electrónico</option>
                <option value="sms">SMS</option>
              </select>
            </div>
            <button
              onClick={handleEnable2FA}
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
                'Habilitar 2FA'
              )}
            </button>
          </>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}

export default EnableTwoFactorPage;
