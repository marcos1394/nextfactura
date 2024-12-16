import React, { useContext } from 'react';
import { 
  CheckCircleIcon, 
  ArrowRightIcon, 
  RocketIcon, 
  SparklesIcon 
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

function PaymentSuccess() {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  return (
    <div 
      className={`
        min-h-screen flex items-center justify-center p-4 
        ${darkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-blue-50 to-white'}
      `}
    >
      <div 
        className={`
          relative max-w-md w-full rounded-2xl shadow-2xl overflow-hidden
          transform transition-all duration-300 hover:scale-105
          ${darkMode 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
            : 'bg-white border border-gray-200'}
        `}
      >
        <div 
          className={`
            absolute top-0 left-0 right-0 h-2 
            ${darkMode 
              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600'}
          `}
        />
        <div className="p-8 text-center relative">
          <div className="relative inline-block mb-6">
            <CheckCircleIcon 
              className={`
                w-24 h-24 mx-auto mb-4 
                ${darkMode ? 'text-yellow-400' : 'text-green-500'}
                animate-bounce
              `} 
            />
            <SparklesIcon 
              className={`
                absolute top-0 right-0 w-12 h-12 
                ${darkMode ? 'text-yellow-300' : 'text-blue-400'}
                animate-pulse
              `} 
            />
            <SparklesIcon 
              className={`
                absolute bottom-0 left-0 w-12 h-12 
                ${darkMode ? 'text-yellow-300' : 'text-blue-400'}
                animate-pulse
              `} 
            />
          </div>

          <h2 
            className={`
              text-4xl font-bold mb-4 
              ${darkMode 
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent' 
                : 'text-gray-800'}
            `}
          >
            Pago Exitoso
          </h2>

          <p className="text-xl mb-4 text-gray-600 dark:text-gray-400">
            Gracias por tu compra. Tu plan ha sido activado correctamente.
          </p>

          <div 
            className={`
              mb-6 p-4 rounded-lg flex items-center 
              ${darkMode 
                ? 'bg-gray-700' 
                : 'bg-gray-100'}
            `}
          >
            <RocketIcon 
              className={`
                w-12 h-12 mr-4 
                ${darkMode ? 'text-yellow-400' : 'text-blue-600'}
              `} 
            />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Ahora puedes configurar tu restaurante para empezar a facturar.
            </p>
          </div>

          <button
            onClick={() => navigate('/restaurantconfig')}
            className={`
              w-full py-3 rounded-lg font-semibold flex items-center justify-center transition-all duration-300
              ${darkMode 
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'}
            `}
          >
            Configurar Restaurante
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>

          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            ¿Necesitas ayuda? Contáctanos al soporte
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;