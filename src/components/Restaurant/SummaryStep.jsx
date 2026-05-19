import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Pencil, CheckCircle, AlertCircle, ChevronLeft, Loader2 } from 'lucide-react';

/**
 * Componente SummaryStep
 * Muestra el resumen final del pedido, calcula totales y maneja el envío.
 */
const SummaryStep = ({
  formData,
  onEditStep,
  onBack,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // --- Lógica de Cálculos ---
  // Usamos optional chaining (?.) y valores por defecto para evitar crashes
  const items = formData.items || [];
  
  const subtotal = items.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0);

  // Ejemplo de lógica de envío: Si es 'express' cuesta 15, si no, 0.
  const shippingCost = formData.shipping?.method === 'express' ? 15.00 : 0.00;
  
  // Cálculo de impuestos (ejemplo 16%)
  const tax = subtotal * 0.16;
  
  const total = subtotal + shippingCost + tax;

  // Formateador de moneda para mostrar precios bonitos (Ej: $1,200.50)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  // --- Manejadores ---
  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Ejecutamos la función de envío que viene del padre
      await onSubmit();
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al procesar tu pedido. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sub-componente interno para los encabezados de sección
  const SectionHeader = ({ title, stepIndex }) => (
    <div className="flex justify-between items-center mb-3 border-b pb-2 border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <button
        onClick={() => onEditStep(stepIndex)}
        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors font-medium"
        type="button"
      >
        <Pencil size={14} /> Editar
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg animate-fade-in border border-gray-100">
      
      {/* --- Título Principal --- */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Resumen del Pedido</h2>
        <p className="text-gray-500 mt-1">Revisa que toda la información sea correcta.</p>
      </div>

      {/* --- Grid de Información Principal --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        {/* Paso 0: Datos Personales */}
        <div>
          <SectionHeader title="Datos de Contacto" stepIndex={0} />
          <div className="text-gray-600 space-y-1 text-sm">
            <p><span className="font-semibold text-gray-800">Nombre:</span> {formData.personalInfo?.fullName || 'N/A'}</p>
            <p><span className="font-semibold text-gray-800">Email:</span> {formData.personalInfo?.email || 'N/A'}</p>
            <p><span className="font-semibold text-gray-800">Teléfono:</span> {formData.personalInfo?.phone || 'N/A'}</p>
          </div>
        </div>

        {/* Paso 1: Envío */}
        <div>
          <SectionHeader title="Dirección de Envío" stepIndex={1} />
          <div className="text-gray-600 space-y-1 text-sm">
            <p className="font-medium text-gray-800">{formData.shipping?.address || 'Sin dirección'}</p>
            <p>{formData.shipping?.city}, {formData.shipping?.zip}</p>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                {formData.shipping?.method || 'Estándar'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Lista de Productos (Paso 2) --- */}
      <div className="mb-8">
         <SectionHeader title="Productos Seleccionados" stepIndex={2} />
         <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200">
            {items.length === 0 ? (
              <p className="text-center text-gray-500 italic">No hay productos en el carrito.</p>
            ) : (
              items.map((item, index) => (
                <div key={item.id || index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white border border-gray-300 rounded flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm">
                      {item.quantity}x
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{item.name}</p>
                      <p className="text-gray-500 text-xs">Unitario: {formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <span className="text-gray-900 font-semibold">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))
            )}
         </div>
      </div>

      {/* --- Desglose de Totales --- */}
      <div className="border-t border-gray-200 pt-6 mb-8">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Envío</span>
            <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
              {shippingCost === 0 ? 'Gratis' : formatCurrency(shippingCost)}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Impuestos (IVA 16%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-300">
          <span className="text-lg font-bold text-gray-900">Total a Pagar</span>
          <span className="text-2xl font-bold text-blue-600">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* --- Mensaje de Error (si falla el submit) --- */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r flex items-start gap-3 animate-pulse">
          <AlertCircle className="mt-0.5 flex-shrink-0" size={18} />
          <div>
            <p className="font-bold text-sm">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* --- Botones de Navegación --- */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 mt-6">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          <ChevronLeft size={20} />
          Volver
        </button>

        <button
          onClick={handleConfirm}
          disabled={isSubmitting || items.length === 0}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:bg-blue-300 disabled:cursor-not-allowed"
          type="button"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Procesando...
            </>
          ) : (
            <>
              Confirmar y Pagar
              <CheckCircle size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// --- Definición de PropTypes ---
// Esto sustituye a TypeScript para validar que recibimos los datos correctos
SummaryStep.propTypes = {
  formData: PropTypes.shape({
    personalInfo: PropTypes.shape({
      fullName: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
    }),
    shipping: PropTypes.shape({
      address: PropTypes.string,
      city: PropTypes.string,
      zip: PropTypes.string,
      method: PropTypes.string,
    }),
    payment: PropTypes.shape({
      method: PropTypes.string,
      last4Digits: PropTypes.string,
    }),
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        price: PropTypes.number,
        quantity: PropTypes.number,
      })
    ),
  }).isRequired,
  onEditStep: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SummaryStep;