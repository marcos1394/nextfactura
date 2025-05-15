// src/pages/PaymentGateway.js
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useLocation, Link, useNavigate } from 'react-router-dom'; // Añadido useNavigate
import { useThemeContext } from '../context/ThemeContext';
import { CreditCardIcon, ShieldCheckIcon, InfoIcon, CheckCircle2Icon } from 'lucide-react';
// import Cookies from 'js-cookie'; // <--- Eliminado: Ya no usamos cookies para el token
import { fetchAuthSession } from 'aws-amplify/auth'; // <--- Añadido: Para obtener la sesión/token de Cognito
import { toast } from 'react-toastify'; // Para mostrar errores

function PaymentGateway() {
  const location = useLocation();
  const navigate = useNavigate(); // Hook para redirección en caso de error
  const { selectedPlan } = location.state || {}; // Asegúrate que PlanSelection pase el state correctamente
  const { darkMode } = useThemeContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!selectedPlan) {
      console.error('PaymentGateway: No hay un plan seleccionado.');
      toast.error('No se ha seleccionado ningún plan.');
      return;
    }

    setIsProcessing(true);
    console.log('[PaymentGateway] Iniciando creación de pago para plan:', selectedPlan);

    try {
        // --- Obtener Token de Cognito ---
        console.log('[PaymentGateway] Obteniendo sesión de Cognito...');
        let idToken;
        try {
            const session = await fetchAuthSession({ forceRefresh: false }); // Obtiene la sesión actual
            idToken = session.tokens?.idToken?.toString(); // Extrae el token JWT ID
            if (!idToken) {
                throw new Error('Token ID no encontrado en la sesión.');
            }
             console.log('[PaymentGateway] Token ID obtenido.');
        } catch (authError) {
             console.error('[PaymentGateway] Error al obtener la sesión/token de Cognito:', authError);
             toast.error('Error de autenticación. Por favor, inicia sesión de nuevo.');
             setIsProcessing(false);
             navigate('/'); // O a la página de login si tienes una ruta específica
             return;
        }
        // --- Fin Obtener Token ---

        console.log('[PaymentGateway] Llamando a /api/payment/create-payment...');
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/payment/create-payment`,
            { plan: selectedPlan }, // Envía la información del plan en el body
            {
                headers: {
                    // ¡Usa el token ID de Cognito!
                    Authorization: `Bearer ${idToken}`,
                    'Content-Type': 'application/json' // Especificar content type
                },
            }
        );

        const initPoint = response.data.init_point;
        console.log('[PaymentGateway] Init Point recibido:', initPoint);

        if (initPoint) {
             console.log('[PaymentGateway] Redirigiendo a Mercado Pago...');
            window.location.href = initPoint; // Redirigir a Mercado Pago
        } else {
             console.error('[PaymentGateway] No se recibió init_point del backend.');
             toast.error('No se pudo iniciar el proceso de pago. Falta punto de inicio.');
             setIsProcessing(false);
        }

    } catch (error) {
        console.error('Error al crear la preferencia de pago (llamada API):', error.response?.data || error.message || error);
        setIsProcessing(false);
        // Mostrar error más específico si viene del backend
        const errorMessage = error.response?.data?.message || 'Hubo un error al iniciar el pago. Inténtalo de nuevo.';
        toast.error(errorMessage);
        // alert(errorMessage); // Considera usar toast en lugar de alert
    }
    // No poner setIsProcessing(false) aquí si hay redirección exitosa
};

  // --- Renderizado (sin cambios significativos, solo añadí validación más robusta) ---
  if (!selectedPlan || !selectedPlan.product || !selectedPlan.name || !selectedPlan.price) {
     console.warn("PaymentGateway: Faltan datos del plan en location.state", location.state);
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
        <div className="text-center">
          <p className="text-xl mb-4">Error: No se recibieron los datos del plan correctamente.</p>
          <Link
            to="/plans" // Asegúrate que /plans sea la ruta correcta
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
    <div className={`flex items-center justify-center min-h-screen p-4 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-white'}`}>
      <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-white border border-gray-200'} transform transition-all duration-300 hover:scale-105`}>
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <CreditCardIcon className={`w-16 h-16 ${darkMode ? 'text-yellow-400' : 'text-blue-600'}`} />
          </div>
          <h2 className={`text-3xl font-bold mb-2 text-center ${darkMode ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent' : 'text-gray-800'}`}>
            Confirmar Pago
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">Estás a un paso de activar tu plan</p>
          <div className={`mb-6 p-4 rounded-lg flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex-grow">
              <h3 className="font-semibold text-lg">{selectedPlan.product}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedPlan.name}</p>
            </div>
            <span className={`text-2xl font-bold ${darkMode ? 'text-yellow-400' : 'text-blue-600'}`}>
              {selectedPlan.price} MXN
            </span>
          </div>
          <div className="space-y-4 mb-6">
            <div className="flex items-center">
              <CheckCircle2Icon className={`w-5 h-5 mr-3 ${darkMode ? 'text-yellow-400' : 'text-green-500'}`} />
              <span className="text-sm">Plan seleccionado</span>
            </div>
            <div className="flex items-center">
              <ShieldCheckIcon className={`w-5 h-5 mr-3 ${darkMode ? 'text-yellow-400' : 'text-blue-500'}`} />
              <span className="text-sm">Pago seguro con MercadoPago</span>
            </div>
          </div>
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : `${darkMode ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700' : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'}`}`}
          >
            {isProcessing ? 'Procesando...' : 'Pagar con MercadoPago'}
          </button>
          <p className="text-xs text-center mt-4 text-gray-500 dark:text-gray-400 flex items-center justify-center">
            <InfoIcon className="w-4 h-4 mr-2" />
            Al continuar, aceptas nuestros{' '}
            <Link to="/terms" className={`ml-1 underline ${darkMode ? 'text-yellow-400' : 'text-blue-600'}`}>
              términos y condiciones
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentGateway;