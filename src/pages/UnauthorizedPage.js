// src/pages/UnauthorizedPage.js

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Página que se muestra cuando un usuario autenticado intenta acceder
 * a una ruta para la que su rol no tiene los permisos necesarios.
 */
const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      {/* Puedes usar un ícono o imagen aquí si lo deseas */}
      <div className="text-7xl mb-4">🚫</div>
      
      <h1 className="text-4xl font-bold text-gray-800 mb-3">
        Acceso Denegado
      </h1>
      
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Lo sentimos, no tienes los permisos requeridos para acceder a esta sección. Si crees que esto es un error, por favor contacta al administrador.
      </p>
      
      <Link
        to="/dashboard" // Enlace para volver a una página segura
        className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
      >
        Volver al Dashboard
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
