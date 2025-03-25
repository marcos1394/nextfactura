import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import { 
  CheckCircleIcon, 
  ArrowRightIcon, 
  RocketIcon, 
  SparklesIcon,
  PhoneIcon,
  FileTextIcon,
  MailIcon,
  ChevronDownIcon
} from 'lucide-react';

function PaymentSuccess() {
  const { darkMode } = useThemeContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Controla el FAQ desplegable
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  // Mensaje opcional para mostrar tras la confirmación en backend
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    // 1. Leer los query params al volver de Mercado Pago
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status'); 
    const paymentId = queryParams.get('payment_id');
    const preferenceId = queryParams.get('preference_id');
    
    console.log('Status:', status);
    console.log('Payment ID:', paymentId);
    console.log('Preference ID:', preferenceId);
  
    // 2. Si el pago es aprobado y tenemos el paymentId, confirmar en el backend
    if (status === 'approved' && paymentId) {
      fetch('/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId })
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('Error confirmando pago');
          const data = await res.json();
          console.log('Respuesta confirmación de pago:', data);
  
          // Si el backend confirma el pago con éxito
          if (data.success) {
            setConfirmationMessage('El pago se confirmó correctamente.');
  
            // Redirigir a /restaurantconfig después de 3 segundos
            setTimeout(() => {
              navigate('/restaurantconfig');
            }, 3000);
          } else {
            setConfirmationMessage('El servidor no pudo confirmar el pago.');
          }
        })
        .catch((err) => {
          console.error('Error al confirmar pago:', err);
          setConfirmationMessage('Hubo un error al confirmar el pago en el servidor.');
        });
    }
  }, [location, navigate]);
  
  return (
    <div 
      className={`
        min-h-screen 
        ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'} 
        py-12 px-4 font-sans
      `}
    >
      <div className="container mx-auto max-w-4xl">
        {/* Main Success Card */}
        <div 
          className={`
            relative rounded-2xl shadow-2xl overflow-hidden mb-12
            transform transition-all duration-300 hover:scale-105
            ${darkMode 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
              : 'bg-white border border-gray-200'}
          `}
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-purple-600" />
          <div className="p-8 text-center">
            <div className="relative inline-block mb-6">
              <CheckCircleIcon className="w-24 h-24 mx-auto mb-4 text-green-500 animate-bounce" />
              <SparklesIcon className="absolute top-0 right-0 w-12 h-12 text-blue-400 animate-pulse" />
              <SparklesIcon className="absolute bottom-0 left-0 w-12 h-12 text-blue-400 animate-pulse" />
            </div>

            <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ¡Pago Exitoso!
            </h2>
            <p className="text-xl mb-8 text-gray-600 dark:text-gray-400">
              Gracias por confiar en nosotros. Tu plan ha sido activado correctamente.
            </p>

            {/* Next Steps Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className={`
                p-6 rounded-xl 
                ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}
              `}>
                <RocketIcon className="w-12 h-12 mb-4 text-blue-600 mx-auto" />
                <h3 className="text-lg font-bold mb-2">Configura tu Restaurante</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Personaliza tu perfil y configura los detalles de tu negocio.
                </p>
                <button
                  onClick={() => navigate('/restaurantconfig')}
                  className={`
                    w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg
                    hover:from-blue-700 hover:to-purple-700 transition-all duration-300
                    transform hover:scale-105 flex items-center justify-center
                  `}
                >
                  Comenzar Configuración
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </button>
              </div>

              <div className={`
                p-6 rounded-xl 
                ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}
              `}>
                <FileTextIcon className="w-12 h-12 mb-4 text-blue-600 mx-auto" />
                <h3 className="text-lg font-bold mb-2">Revisa tu Documentación</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Accede a tus documentos de compra y facturación.
                </p>
                <button
                  onClick={() => navigate('/documents')}
                  className={`
                    w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg
                    hover:from-blue-700 hover:to-purple-700 transition-all duration-300
                    transform hover:scale-105 flex items-center justify-center
                  `}
                >
                  Ver Documentos
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>

            {/* Mensaje opcional tras confirmar en el servidor */}
            {confirmationMessage && (
              <div className="mt-4 text-sm text-center text-gray-700 dark:text-gray-300">
                {confirmationMessage}
              </div>
            )}
          </div>
        </div>

        {/* Support Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Estamos para Ayudarte
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: PhoneIcon,
                title: 'Soporte Telefónico',
                description: 'Llámanos al 800-123-4567',
              },
              {
                icon: MailIcon,
                title: 'Correo Electrónico',
                description: 'soporte@nexfactura.com',
              },
              {
                icon: RocketIcon,
                title: 'Centro de Ayuda',
                description: 'Consulta nuestra documentación',
              },
            ].map((support) => (
              <div
                key={support.title}
                className={`
                  p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105
                  ${darkMode ? 'bg-gray-800' : 'bg-white'}
                `}
              >
                <support.icon className="w-12 h-12 mb-4 text-blue-600 mx-auto" />
                <h4 className="text-lg font-bold mb-2">{support.title}</h4>
                <p className="text-gray-600 dark:text-gray-400">{support.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Preguntas Frecuentes
          </h3>
          <div className="space-y-4">
            {[
              {
                question: '¿Cuándo puedo empezar a usar mi plan?',
                answer: 'Tu plan está activo inmediatamente. Puedes comenzar a configurar tu restaurante y emitir facturas ahora mismo.',
              },
              {
                question: '¿Dónde encuentro mi factura de compra?',
                answer: 'Tu factura será enviada al correo electrónico registrado y también estará disponible en la sección de documentos.',
              },
              {
                question: '¿Necesito hacer algo más para activar mi cuenta?',
                answer: 'No, tu cuenta está completamente activada. Solo necesitas completar la configuración de tu restaurante para comenzar.',
              },
            ].map((faq, index) => (
              <div
                key={faq.question}
                className={`
                  border 
                  ${darkMode ? 'border-gray-700' : 'border-gray-200'} 
                  rounded-lg overflow-hidden
                `}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center text-left p-4 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDownIcon
                    className={`
                      w-5 h-5 text-blue-600 transition-transform 
                      ${expandedFAQ === index ? 'rotate-180' : ''}
                    `}
                  />
                </button>
                {expandedFAQ === index && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800">
                    <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
