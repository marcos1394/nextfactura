import React, { useContext } from 'react';
import { FaTimesCircle, FaArrowLeft } from 'react-icons/fa'; 
import { ThemeContext } from '../context/ThemeContext';

function PaymentFailure() {
  const { darkMode } = useContext(ThemeContext);

  const handleRetryPayment = () => {
    window.location.href = '/plans';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div 
      className={`
        min-h-screen 
        flex 
        items-center 
        justify-center 
        p-4 
        ${darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
          : 'bg-gradient-to-br from-blue-100 to-white'}
      `}
    >
      <div 
        className={`
          max-w-md 
          w-full 
          p-8 
          rounded-2xl 
          shadow-2xl 
          transform 
          transition-all 
          duration-500 
          hover:scale-105
          ${darkMode 
            ? 'bg-gray-800 text-gray-100 border border-gray-700' 
            : 'bg-white text-gray-900 border border-gray-200'}
        `}
      >
        <div className="relative mb-6">
          <button 
            onClick={handleGoBack}
            className={`
              absolute 
              left-0 
              top-0 
              p-2 
              rounded-full 
              hover:bg-opacity-20 
              transition 
              duration-300
              ${darkMode 
                ? 'text-gray-300 hover:bg-white hover:bg-opacity-10' 
                : 'text-gray-600 hover:bg-black hover:bg-opacity-10'}
            `}
          >
            <FaArrowLeft className="text-2xl" />
          </button>
        </div>

        <div className="text-center">
          <FaTimesCircle 
            className={`
              mx-auto 
              mb-6 
              text-7xl 
              ${darkMode 
                ? 'text-red-600 animate-pulse' 
                : 'text-red-500'}
            `} 
          />
          
          <h2 
            className={`
              text-4xl 
              font-extrabold 
              mb-4 
              ${darkMode 
                ? 'text-red-300' 
                : 'text-red-600'}
            `}
          >
            Pago Fallido
          </h2>
          
          <p 
            className={`
              text-xl 
              mb-6 
              ${darkMode 
                ? 'text-gray-300' 
                : 'text-gray-700'}
            `}
          >
            Hubo un problema al procesar tu pago. Por favor, verifica tus datos e inténtalo nuevamente.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleRetryPayment}
              className={`
                w-full 
                py-3 
                rounded-lg 
                font-semibold 
                transition 
                duration-300 
                transform 
                hover:scale-105 
                focus:outline-none 
                focus:ring-2
                ${darkMode
                  ? 'bg-blue-700 text-white hover:bg-blue-600 focus:ring-blue-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400'}
              `}
            >
              Reintentar Pago
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className={`
                w-full 
                py-3 
                rounded-lg 
                font-semibold 
                transition 
                duration-300 
                transform 
                hover:scale-105 
                focus:outline-none 
                focus:ring-2
                ${darkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-500'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400'}
              `}
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailure;