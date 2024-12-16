import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, X, CheckCircle } from 'lucide-react';

const TermsModal = ({ isOpen, onClose, onAccept }) => {
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const modalRef = useRef(null);

  const handleScroll = () => {
    if (modalRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = modalRef.current;
      const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(scrollPercentage);

      if (scrollTop + clientHeight >= scrollHeight - 5) {
        setIsScrolledToEnd(true);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsScrolledToEnd(false);
      setScrollProgress(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="relative">
          {/* Header with progress indicator */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-6 pb-0">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Términos y Condiciones de Uso de NEXFACTURA
              </h2>
              <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700 dark:hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="h-1 bg-gray-200 dark:bg-gray-700">
              <div 
                className="h-1 bg-blue-500 transition-all duration-200" 
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>

          {/* Scrollable Content */}
          <div
            className="h-[500px] overflow-y-auto px-6 py-4 text-justify text-gray-900 dark:text-white scroll-smooth space-y-4"
            ref={modalRef}
            onScroll={handleScroll}
          >
            <p>
              Te pedimos leer cuidadosamente los siguientes Términos y Condiciones antes de utilizar
              la aplicación web <strong>NEXFACTURA</strong> (en adelante, la "Aplicación"), un panel de
              autofacturación diseñado para restaurantes y otros establecimientos de consumo. Al
              utilizar NEXFACTURA, aceptas voluntariamente estos Términos y Condiciones. Si no estás
              de acuerdo, te pedimos que no utilices la Aplicación.
            </p>

            <h3 className="font-bold text-xl mt-4">I. Propiedad Intelectual</h3>
            <p>
              Todos los derechos de propiedad intelectual relacionados con el contenido, diseño y
              desarrollo de NEXFACTURA son propiedad exclusiva de <strong>NEXTECH</strong>. Ningún usuario
              podrá reproducir, modificar o distribuir el contenido de la Aplicación sin autorización
              previa y por escrito de NEXTECH.
            </p>

            <h3 className="font-bold text-xl mt-4">II. Uso del Servicio</h3>
            <p>
              NEXFACTURA está diseñada para que los clientes de restaurantes puedan generar sus
              facturas de manera sencilla. Al utilizar la Aplicación, te comprometes a:
            </p>
            <ul className="list-disc ml-6">
              <li>No realizar modificaciones no autorizadas en el sistema o en la base de datos.</li>
              <li>No utilizar la Aplicación con fines fraudulentos o para actividades contrarias a la ley.</li>
              <li>Proporcionar datos verídicos para la generación de facturas.</li>
            </ul>

            <h3 className="font-bold text-xl mt-4">III. Cuentas de Usuario</h3>
            <p>
              Para utilizar NEXFACTURA, es posible que debas crear una cuenta de usuario (en adelante,
              la "Cuenta"). Al crear una Cuenta, te comprometes a proporcionar información precisa y
              mantener la confidencialidad de tu contraseña. Cualquier actividad realizada desde tu
              Cuenta es tu responsabilidad.
            </p>

            <h3 className="font-bold text-xl mt-4">XIV. Misceláneos</h3>
            <p>
              NEXFACTURA no podrá ser licenciada, transferida ni cedida a terceros sin la previa
              autorización por escrito de NEXTECH. Solo los distribuidores autorizados por NEXTECH
              podrán comercializar y distribuir la Aplicación. Cualquier intento de licenciamiento o
              cesión no autorizado será considerado una violación de estos Términos y Condiciones.
            </p>
            <p>
              Si tienes alguna duda sobre estos Términos y Condiciones, puedes contactarnos a través
              de <strong>soporte@nextechsolutions.com.mx</strong> o al teléfono <strong>614-215-20-82</strong>.
            </p>
          </div>
        </div>

        {/* Footer with Accept/Close buttons */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-end space-x-4">
            <button
              className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition flex items-center"
              onClick={onClose}
            >
              <X size={20} className="mr-2" /> Cerrar
            </button>
            <button
              className={`
                px-4 py-2 rounded-lg transition flex items-center
                ${
                  isScrolledToEnd
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }
              `}
              onClick={onAccept}
              disabled={!isScrolledToEnd}
            >
              <CheckCircle size={20} className="mr-2" /> 
              Aceptar
            </button>
          </div>
        </div>
        
        {/* Scroll hint */}
        {!isScrolledToEnd && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="text-gray-500" size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsModal;