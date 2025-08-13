// src/pages/ProtectedRoute.js

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Importamos nuestro hook personalizado

/**
 * Componente de orden superior para proteger rutas. Se encarga de:
 * 1. Verificar si la sesión del usuario se está cargando.
 * 2. Verificar si el usuario está autenticado.
 * 3. Verificar si el rol del usuario tiene permiso para acceder a la ruta.
 * * @param {{ allowedRoles?: string[] }} props - Un array opcional de strings con los roles permitidos para la ruta.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // --- 1. Manejo del Estado de Carga ---
  // Mientras isLoading es true, significa que estamos verificando el token
  // en el AuthContext. Mostramos un estado de carga para evitar
  // redirigir al usuario prematuramente.
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Cargando sesión...</div>
      </div>
    );
  }

  // --- 2. Verificación de Autenticación ---
  // Si ya no está cargando y el usuario NO está autenticado,
  // lo redirigimos a la página de login. Guardamos la ruta a la que
  // intentaba acceder para poder redirigirlo de vuelta después del login.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // --- 3. Verificación de Autorización (Roles) ---
  // Si la ruta requiere roles específicos y el rol del usuario no está en la lista...
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // ...lo redirigimos a una página de "Acceso Denegado".
    // Esto previene que un usuario normal acceda a paneles de administrador.
    return <Navigate to="/unauthorized" replace />;
  }

  // Si todas las verificaciones pasan, renderizamos el componente de la ruta solicitada.
  return <Outlet />;
};

export default ProtectedRoute;
