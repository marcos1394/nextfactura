import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import { 
  CheckIcon, 
  ChevronDownIcon, 
  StarIcon, 
  CreditCardIcon, 
  TrendingUpIcon 
} from 'lucide-react';

function PlanSelection() {
  const [activeSection, setActiveSection] = useState('individual');
  const { darkMode } = useThemeContext();
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const plans = {
    individual: [
      {
        product: 'NEXFACTURA',
        options: [
          { name: 'Plan Mensual', price: 450, period: 'mes', savings: null },
          { name: 'Plan Semestral', price: 2300, period: 'semestre', savings: 400 },
          { name: 'Plan Anual', price: 4150, period: 'año', savings: null },
        ],
      },
      {
        product: 'NEXTMANAGER',
        options: [
          { name: 'Plan Mensual', price: 430, period: 'mes', savings: null },
          { name: 'Plan Semestral', price: 2200, period: 'semestre', savings: 380 },
          { name: 'Plan Anual', price: 3950, period: 'año', savings: null },
        ],
      },
    ],
    combined: [
      {
        product: 'Paquete Anual Combinado',
        options: [
          {
            name: 'NEXFACTURA + NEXTMANAGER',
            price: 7500,
            period: 'año',
            savings: 600,
            additionalBenefits: [
              'Soporte técnico prioritario',
              'Una sesión de capacitación adicional sin costo',
            ],
            recommended: true,
          },
        ],
      },
    ],
  };

  const handlePlanSelect = (option, product) => {
    navigate('/payment', {
      state: {
        selectedPlan: {
          product,
          name: option.name,
          price: option.price,
          period: option.period,
          savings: option.savings,
          additionalBenefits: option.additionalBenefits || [],
        },
      },
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'} py-12 px-4 font-sans`}>
      <div className="container mx-auto max-w-6xl text-center">
        <div className="mb-12">
          <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Elige tu Plan Perfecto
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Soluciones flexibles diseñadas para impulsar el crecimiento de tu negocio
          </p>
        </div>

        {/* Section Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-200 dark:bg-gray-700 rounded-full p-1 shadow-inner">
            {['individual', 'combined'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  activeSection === section
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {section === 'individual' ? 'Planes Individuales' : 'Paquete Combinado'}
              </button>
            ))}
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
          {plans[activeSection].map(({ product, options }) => (
            <div
              key={product}
              className={`w-full h-full relative rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 
                ${darkMode 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                  : 'bg-white border border-gray-200'}
                hover:scale-105 hover:shadow-2xl`}
            >
              <div className="p-8 relative">
                {options.some(option => option.recommended) && (
                  <div className="absolute top-0 right-0 m-4 flex items-center bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                    <StarIcon className="w-4 h-4 mr-1" />
                    Recomendado
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-6 text-center">{product}</h3>
                {options.map((option) => (
                  <div 
                    key={option.name} 
                    className={`mb-6 p-4 rounded-lg transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-semibold">{option.name}</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ${option.price.toLocaleString()} 
                        <span className="text-sm ml-1 text-gray-500">/{option.period}</span>
                      </span>
                    </div>
                    {option.savings && (
                      <div className="text-green-600 text-sm flex items-center mb-3">
                        <TrendingUpIcon className="w-4 h-4 mr-2" />
                        Ahorro: ${option.savings.toLocaleString()} MXN
                      </div>
                    )}
                    {option.additionalBenefits && (
                      <ul className="mt-2 space-y-2">
                        {option.additionalBenefits.map((benefit) => (
                          <li 
                            key={benefit} 
                            className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                          >
                            <CheckIcon className="w-4 h-4 mr-2 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    )}
                    <button
                      onClick={() => handlePlanSelect(option, product)}
                      className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg 
                        hover:from-blue-700 hover:to-purple-700 transition-all duration-300 
                        transform hover:scale-105 flex items-center justify-center"
                    >
                      <CreditCardIcon className="w-5 h-5 mr-2" />
                      Seleccionar Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: TrendingUpIcon,
              title: 'Flexibilidad',
              description: 'Comience con un plan mensual o semestral, y evolucione de acuerdo con las necesidades de su negocio.',
            },
            {
              icon: CreditCardIcon,
              title: 'Ahorro Significativo',
              description: 'Los planes anuales y combinados ofrecen precios con descuento que le permiten ahorrar y obtener el mayor valor.',
            },
            {
              icon: CheckIcon,
              title: 'Soporte Total',
              description: 'Con cualquiera de nuestros planes, garantizamos soporte técnico y asistencia continua.',
            },
          ].map((benefit) => (
            <div
              key={benefit.title}
              className={`p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 flex flex-col items-center text-center
                ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}
            >
              <benefit.icon className="w-12 h-12 mb-4 text-blue-600" />
              <h4 className="text-xl font-bold mb-3">{benefit.title}</h4>
              <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Preguntas Frecuentes
          </h3>
          <div className="space-y-4">
            {[
              {
                question: '¿Puedo cambiar de plan en cualquier momento?',
                answer: 'Sí, puede actualizar o bajar su plan en cualquier momento desde su panel de usuario.',
              },
              {
                question: '¿Qué métodos de pago aceptan?',
                answer: 'Aceptamos tarjetas de crédito, débito y pagos a través de Mercado Pago.',
              },
              {
                question: '¿Hay algún cargo adicional?',
                answer: 'No, todos los costos están claramente especificados en los planes.',
              },
            ].map((faq, index) => (
              <div
                key={faq.question}
                className={`border-b ${
                  darkMode ? 'border-gray-700' : 'border-gray-300'
                } overflow-hidden`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center text-left py-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-4 transition-colors"
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  <ChevronDownIcon
                    className={`w-6 h-6 text-blue-600 transition-transform ${
                      expandedFAQ === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFAQ === index && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
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

export default PlanSelection;