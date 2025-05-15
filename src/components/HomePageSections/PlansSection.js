// src/components/HomePageSections/PlansSection.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckBadgeIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

// Datos de planes (mantenidos aquí por simplicidad)
const planDetails = {
  'NEXFACTURA': { /* ... (datos como antes) ... */ },
  'NEXTMANAGER': { /* ... (datos como antes) ... */ },
  'COMBINADO': { /* ... (datos como antes) ... */ }
};
// Rellena los detalles de los planes aquí exactamente como los tenías en Hero.js
planDetails['NEXFACTURA'] = {
    mensual: { precio: 450, descripcion: ["Hasta 200 facturas mensuales", "Soporte básico por correo", "Integración básica con SoftRestaurant", "Generación de reportes simples"] },
    semestral: { precio: 2300, descripcion: ["Hasta 1,500 facturas en 6 meses", "Soporte prioritario", "Integración completa con SoftRestaurant", "Reportes avanzados", "Ahorro de $400"] },
    anual: { precio: 4150, descripcion: ["Facturación ilimitada", "Soporte premium 24/7", "Actualizaciones gratuitas", "Integración personalizada", "Consultoría trimestral", "Mayor ahorro del año"] }
};
planDetails['NEXTMANAGER'] = {
    mensual: { precio: 430, descripcion: ["Panel de administración básico", "Seguimiento de ventas", "Exportación de datos", "Alertas básicas"] },
    semestral: { precio: 2200, descripcion: ["Panel de administración completo", "Análisis de tendencias", "Exportación avanzada", "Alertas personalizadas", "Ahorro de $380"] },
    anual: { precio: 3950, descripcion: ["Gestión financiera avanzada", "Reportes ejecutivos", "Predicción de ventas", "Integración con contabilidad", "Asesoría financiera", "Mayor flexibilidad"] }
};
planDetails['COMBINADO'] = {
    anual: { precio: 7500, descripcion: ["NextFactura + NextManager", "Facturación ilimitada", "Soporte técnico prioritario", "Sesión de capacitación especial", "Consultoría semestral", "Ahorro de $600", "Integración total", "Actualizaciones premium"] }
};
// --- Fin datos de planes ---


const PlansSection = () => {
  const [selectedProduct, setSelectedProduct] = useState('NEXFACTURA');
  const [currentPlan, setCurrentPlan] = useState('mensual'); // Plan seleccionado dentro del producto
  const navigate = useNavigate();

  const handleSelectPlan = () => {
    // Aquí decides qué hacer al seleccionar un plan.
    // Podría ser guardar la selección y redirigir a registro/pago,
    // o simplemente redirigir para que el usuario se registre/loguee primero.
    // Por ahora, redirigimos a /dashboard para iniciar el flujo de auth.
    console.log(`Plan seleccionado: ${selectedProduct} - ${currentPlan}`);
    navigate('/dashboard'); // O a '/plans' si tienes esa ruta protegida específica
  };


  const renderPlanPricing = (product) => {
    if (!planDetails[product]) return null; // Manejo por si el producto no existe

    if (product === 'COMBINADO') {
      const plan = planDetails[product]['anual']; // Combinado solo tiene anual
      return (
        <motion.div
          key="combinado"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8 rounded-xl shadow-2xl mt-6 border-4 border-yellow-300"
        >
          <h3 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <SparklesIcon className="w-8 h-8 mr-2 text-yellow-300" />
            Paquete Anual Combinado
          </h3>
          <p className="text-4xl font-extrabold mb-6 text-center">${plan.precio} MXN</p>
          <ul className="space-y-3 text-lg mb-8">
            {plan.descripcion.map((item, index) => (
              <li key={index} className="flex items-center">
                <CheckBadgeIcon className="w-6 h-6 mr-2 text-yellow-300 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <button
             onClick={handleSelectPlan}
            className="w-full bg-white text-blue-700 font-bold py-3 px-6 rounded-full hover:bg-gray-200 transition duration-300"
          >
            Seleccionar Plan Combinado
          </button>
        </motion.div>
      );
    }

    // Renderizado para NEXFACTURA y NEXTMANAGER
    return (
      <motion.div
        key={product}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mt-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['mensual', 'semestral', 'anual'].map((period) => (
            <div
              key={period}
              className={`p-5 rounded-lg border-2 cursor-pointer transition-all ${
                currentPlan === period
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'
              }`}
              onClick={() => setCurrentPlan(period)}
            >
              <div className="flex justify-between items-baseline mb-3">
                <span className="capitalize font-bold text-xl">{period}</span>
                <span className="font-extrabold text-2xl text-blue-600 dark:text-blue-400">
                  ${planDetails[product][period].precio}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/mes*</span>
                </span>
              </div>
              <ul className="space-y-2 text-sm mb-4 text-gray-600 dark:text-gray-300">
                {planDetails[product][period].descripcion.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckBadgeIcon className="w-4 h-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {currentPlan === period && (
                <button
                  onClick={handleSelectPlan}
                  className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300 mt-4"
                >
                  Seleccionar Plan {period}
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-center mt-4 text-gray-500 dark:text-gray-400">
          *Precios en MXN. El precio mensual se muestra como referencia en planes semestrales y anuales.
        </p>
      </motion.div>
    );
  };

  return (
    <div id="plans" className="bg-gray-50 dark:bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Planes Flexibles para Tu Negocio</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          Elige el plan que mejor se adapte a tus necesidades de facturación y gestión. Comienza hoy mismo a optimizar tu restaurante.
        </p>

        {/* Botones de selección de producto */}
        <div className="flex justify-center space-x-2 sm:space-x-4 mb-8">
          {['NEXFACTURA', 'NEXTMANAGER', 'COMBINADO'].map((product) => (
            <button
              key={product}
              onClick={() => {setSelectedProduct(product); setCurrentPlan(product === 'COMBINADO' ? 'anual' : 'mensual');}} // Reset plan on product change
              className={`px-3 py-2 sm:px-6 sm:py-2 rounded-full text-sm sm:text-base font-medium transition ${
                selectedProduct === product
                  ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-md'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {product}
            </button>
          ))}
        </div>

        {/* Renderizado de precios del plan seleccionado */}
        {renderPlanPricing(selectedProduct)}

      </div>
    </div>
  );
};

export default PlansSection;