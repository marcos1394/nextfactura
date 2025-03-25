import React, { useContext, useState, useEffect } from 'react';
import { FaHourglassHalf, FaCheckCircle } from 'react-icons/fa'; 
import { useThemeContext } from '../context/ThemeContext';

function PaymentPending() {
  const { darkMode } = useThemeContext();
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

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
          relative 
          overflow-hidden
          transform 
          transition-all 
          duration-500 
          ${darkMode 
            ? 'bg-gray-800 text-gray-100 border border-gray-700' 
            : 'bg-white text-gray-900 border border-gray-200'}
        `}
      >
        {/* Animated Background Elements */}
        <div 
          className={`
            absolute 
            -top-10 
            -right-10 
            w-32 
            h-32 
            rounded-full 
            opacity-20 
            ${darkMode 
              ? 'bg-yellow-600' 
              : 'bg-yellow-300'}
          `}
        />
        <div 
          className={`
            absolute 
            -bottom-10 
            -left-10 
            w-32 
            h-32 
            rounded-full 
            opacity-20 
            ${darkMode 
              ? 'bg-yellow-600' 
              : 'bg-yellow-300'}
          `}
        />

        <div className="relative z-10 text-center">
          <div className="relative inline-block mb-6">
            <FaHourglassHalf 
              className={`
                mx-auto 
                text-7xl 
                mb-4 
                animate-pulse 
                ${darkMode 
                  ? 'text-yellow-500' 
                  : 'text-yellow-600'}
              `} 
            />
            <div 
              className={`
                absolute 
                bottom-0 
                right-0 
                w-8 
                h-8 
                rounded-full 
                flex 
                items-center 
                justify-center 
                ${darkMode 
                  ? 'bg-gray-700 text-yellow-400' 
                  : 'bg-yellow-100 text-yellow-600'}
              `}
            >
              <FaCheckCircle className="text-sm" />
            </div>
          </div>
          
          <h2 
            className={`
              text-4xl 
              font-extrabold 
              mb-4 
              ${darkMode 
                ? 'text-yellow-300' 
                : 'text-yellow-600'}
            `}
          >
            Pago en Proceso
          </h2>
          
          <p 
            className={`
              text-xl 
              mb-4 
              ${darkMode 
                ? 'text-gray-300' 
                : 'text-gray-700'}
            `}
          >
            Tu pago está siendo procesado{dots}
          </p>
          
          <p 
            className={`
              text-lg 
              mb-6 
              ${darkMode 
                ? 'text-gray-400' 
                : 'text-gray-600'}
            `}
          >
            Por favor, no cierres esta página. Serás redirigido una vez confirmado.
          </p>

          <div 
            className={`
              w-full 
              h-2 
              rounded-full 
              overflow-hidden 
              ${darkMode 
                ? 'bg-gray-700' 
                : 'bg-gray-200'}
            `}
          >
            <div 
              className={`
                h-full 
                w-1/2 
                animate-pulse 
                ${darkMode 
                  ? 'bg-yellow-600' 
                  : 'bg-yellow-500'}
              `}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPending;