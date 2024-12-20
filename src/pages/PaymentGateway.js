import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { 
  CreditCardIcon, 
  ShieldCheckIcon, 
  InfoIcon, 
  CheckCircle2Icon 
} from 'lucide-react';

function PaymentGateway() {
  const location = useLocation();
  const { selectedPlan } = location.state || {};
  const { darkMode } = useContext(ThemeContext);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!selectedPlan) {
      console.error('No hay un plan seleccionado.');
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No se encontró el token de autenticación.');
        setIsProcessing(false);
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payment/create-payment`,
        { plan: selectedPlan },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const initPoint = response.data.init_point;
      console.log('Init Point:', initPoint);

      // Redirecciona al checkout de Mercado Pago en producción
      window.location.href = initPoint;
    } catch (error) {
      console.error('Error al crear la preferencia de pago:', error);
      setIsProcessing(false);
      alert('Hubo un error al intentar crear la preferencia de pago. Por favor, inténtalo nuevamente.');
    }
  };

  if (!selectedPlan) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
        <div className="text-center">
          <p className="text-xl mb-4">No se seleccionó ningún plan.</p>
          <Link 
            to="/planes" 
            className={`inline-block px-6 py-2 rounded-lg ${
              darkMode 
                ? 'bg-yellow-500 text-black hover:bg-yellow-600' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } transition-colors`}
          >
            Volver a Planes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`flex items-center justify-center min-h-screen p-4 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-blue-50 to-white'
      }`}
    >
      <div 
        className={`
          w-full max-w-md rounded-2xl shadow-2xl overflow-hidden
          ${darkMode 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
            : 'bg-white border border-gray-200'}
          transform transition-all duration-300 hover:scale-105
        `}
      >
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <CreditCardIcon 
              className={`w-16 h-16 ${
                darkMode ? 'text-yellow-400' : 'text-blue-600'
              }`} 
            />
          </div>

          <h2 
            className={`
              text-3xl font-bold mb-2 text-center 
              ${darkMode 
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent' 
                : 'text-gray-800'}
            `}
          >
            Confirmar Pago
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            Estás a un paso de activar tu plan
          </p>

          <div 
            className={`
              mb-6 p-4 rounded-lg flex items-center 
              ${darkMode 
                ? 'bg-gray-700' 
                : 'bg-gray-100'}
            `}
          >
            <div className="flex-grow">
              <h3 className="font-semibold text-lg">{selectedPlan.product}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedPlan.name}</p>
            </div>
            <span 
              className={`
                text-2xl font-bold 
                ${darkMode ? 'text-yellow-400' : 'text-blue-600'}
              `}
            >
              ${selectedPlan.price} MXN
            </span>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center">
              <CheckCircle2Icon 
                className={`w-5 h-5 mr-3 ${
                  darkMode ? 'text-yellow-400' : 'text-green-500'
                }`} 
              />
              <span className="text-sm">Plan seleccionado</span>
            </div>
            <div className="flex items-center">
              <ShieldCheckIcon 
                className={`w-5 h-5 mr-3 ${
                  darkMode ? 'text-yellow-400' : 'text-blue-500'
                }`} 
              />
              <span className="text-sm">Pago seguro con MercadoPago</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`
              w-full py-3 rounded-lg font-semibold transition-all duration-300
              flex items-center justify-center
              ${isProcessing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : `
                  ${darkMode 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'}
                `}
            `}
          >
            {isProcessing ? 'Procesando...' : 'Pagar con MercadoPago'}
          </button>

          <p className="text-xs text-center mt-4 text-gray-500 dark:text-gray-400 flex items-center justify-center">
            <InfoIcon className="w-4 h-4 mr-2" />
            Al continuar, aceptas nuestros{' '}
            <Link 
              to="/terminos" 
              className={`ml-1 underline ${
                darkMode ? 'text-yellow-400' : 'text-blue-600'
              }`}
            >
              términos y condiciones
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentGateway;
