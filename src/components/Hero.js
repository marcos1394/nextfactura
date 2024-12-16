import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckBadgeIcon, 
  CloudIcon, 
  DevicePhoneMobileIcon, 
  DocumentTextIcon,
  SparklesIcon,
  ChartBarIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ArchiveBoxIcon  // Replaced DatabaseIcon with ArchiveBoxIcon

} from '@heroicons/react/24/solid';

const NextFacturaHero = () => {
  const [activePhrase, setActivePhrase] = useState(0);
  const [currentPlan, setCurrentPlan] = useState('mensual');
  const [selectedProduct, setSelectedProduct] = useState('NEXFACTURA');

  const typingPhrases = [
    "Automatiza tu facturación con NextFactura",
    "Solución integral para restaurantes",
    "Conexión perfecta con SoftRestaurant",
    "Simplifica tu gestión de facturas"
  ];

  const planDetails = {
    'NEXFACTURA': {
      mensual: { 
        precio: 450, 
        descripcion: [
          "Hasta 200 facturas mensuales",
          "Soporte básico por correo",
          "Integración básica con SoftRestaurant",
          "Generación de reportes simples"
        ]
      },
      semestral: { 
        precio: 2300, 
        descripcion: [
          "Hasta 1,500 facturas en 6 meses",
          "Soporte prioritario",
          "Integración completa con SoftRestaurant",
          "Reportes avanzados",
          "Ahorro de $400"
        ]
      },
      anual: { 
        precio: 4150, 
        descripcion: [
          "Facturación ilimitada",
          "Soporte premium 24/7",
          "Actualizaciones gratuitas",
          "Integración personalizada",
          "Consultoría trimestral",
          "Mayor ahorro del año"
        ]
      }
    },
    'NEXTMANAGER': {
      mensual: { 
        precio: 430, 
        descripcion: [
          "Panel de administración básico",
          "Seguimiento de ventas",
          "Exportación de datos",
          "Alertas básicas"
        ]
      },
      semestral: { 
        precio: 2200, 
        descripcion: [
          "Panel de administración completo",
          "Análisis de tendencias",
          "Exportación avanzada",
          "Alertas personalizadas",
          "Ahorro de $380"
        ]
      },
      anual: { 
        precio: 3950, 
        descripcion: [
          "Gestión financiera avanzada",
          "Reportes ejecutivos",
          "Predicción de ventas",
          "Integración con contabilidad",
          "Asesoría financiera",
          "Mayor flexibilidad"
        ]
      }
    },
    'COMBINADO': {
      anual: { 
        precio: 7500, 
        descripcion: [
          "NextFactura + NextManager",
          "Facturación ilimitada",
          "Soporte técnico prioritario",
          "Sesión de capacitación especial",
          "Consultoría semestral",
          "Ahorro de $600",
          "Integración total",
          "Actualizaciones premium"
        ]
      }
    }
  };

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setActivePhrase((prev) => (prev + 1) % typingPhrases.length);
    }, 3000);

    return () => clearInterval(phraseInterval);
  }, []);

  const renderPlanPricing = (product) => {
    if (product === 'COMBINADO') {
      const plan = planDetails[product]['anual'];
      return (
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white p-6 rounded-xl shadow-2xl">
          <h3 className="text-2xl font-bold mb-4 flex items-center">
            <SparklesIcon className="w-8 h-8 mr-2 text-yellow-300" />
            Paquete Anual Combinado
          </h3>
          <p className="text-3xl font-extrabold mb-4">${plan.precio} MXN</p>
          <ul className="space-y-2 text-sm">
            {plan.descripcion.map((item, index) => (
              <li key={index} className="flex items-center">
                <CheckBadgeIcon className="w-5 h-5 mr-2 text-yellow-300" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="space-y-3">
          {['mensual', 'semestral', 'anual'].map((period) => (
            <div 
              key={period} 
              className={`p-4 rounded-lg transition-all ${
                currentPlan === period 
                  ? 'bg-blue-100 dark:bg-blue-900' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setCurrentPlan(period)}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="capitalize font-bold text-lg">{period.charAt(0).toUpperCase() + period.slice(1)}</span>
                <span className="font-extrabold text-xl">
                  ${planDetails[product][period].precio} MXN
                </span>
              </div>
              <ul className="space-y-1 text-sm">
                {planDetails[product][period].descripcion.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckBadgeIcon className="w-4 h-4 mr-2 text-blue-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const beneficios = [
    { 
      icon: CheckBadgeIcon, 
      title: "Facturación Automática", 
      description: "Genera facturas instantáneamente con un solo clic, eliminando procesos manuales tediosos." 
    },
    { 
      icon: CloudIcon, 
      title: "Integración SoftRestaurant", 
      description: "Sincronización perfecta y en tiempo real con tu sistema de punto de venta." 
    },
    { 
      icon: DevicePhoneMobileIcon, 
      title: "Gestión Móvil", 
      description: "Administra tus facturas y ventas desde cualquier dispositivo, en cualquier momento." 
    },
    { 
      icon: ChartBarIcon, 
      title: "Análisis Financiero", 
      description: "Obtén insights detallados sobre tus ventas, tendencias y rendimiento financiero." 
    },
    { 
      icon: LightBulbIcon, 
      title: "Soluciones Inteligentes", 
      description: "Recomendaciones personalizadas para optimizar tu facturación y gestión." 
    },
    { 
      icon: ShieldCheckIcon, 
      title: "Seguridad Certificada", 
      description: "Protección de datos de última generación y cumplimiento de normativas fiscales." 
    },
    { 
      icon: CreditCardIcon, 
      title: "Pagos Integrados", 
      description: "Facilita el cobro con múltiples métodos de pago y seguimiento de transacciones." 
    },
    { 
      icon: ArchiveBoxIcon, 
      title: "Respaldos Automáticos", 
      description: "Almacenamiento seguro y recuperación instantánea de todos tus documentos fiscales." 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-black text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side: Hero Content */}
        <div className="space-y-8">
          <motion.h1 
            key={activePhrase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold"
          >
            {typingPhrases[activePhrase]}
          </motion.h1>

          <p className="text-xl text-gray-600 dark:text-gray-300">
            Solución completa de facturación electrónica diseñada específicamente para restaurantes que utilizan SoftRestaurant.
          </p>

          <div className="flex space-x-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
              Comenzar Ahora
            </button>
            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-full hover:bg-blue-50 transition">
              Solicitar Demo
            </button>
          </div>
        </div>

        {/* Right Side: Plans */}
        <div className="space-y-6">
          <div className="flex space-x-4 mb-6">
            {['NEXFACTURA', 'NEXTMANAGER', 'COMBINADO'].map((product) => (
              <button 
                key={product}
                onClick={() => setSelectedProduct(product)}
                className={`px-4 py-2 rounded-full transition ${
                  selectedProduct === product 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}
              >
                {product}
              </button>
            ))}
          </div>

          {renderPlanPricing(selectedProduct)}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Beneficios de NextFactura</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {beneficios.map(({ icon: Icon, title, description }, index) => (
              <motion.div 
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition"
              >
                <Icon className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
                <h3 className="text-xl font-bold text-center mb-3">{title}</h3>
                <p className="text-center text-gray-600 dark:text-gray-300">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextFacturaHero;