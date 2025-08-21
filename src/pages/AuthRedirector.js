// src/pages/AuthRedirector.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AuthRedirector = () => {
    const { status, user, isLoading } = useAuth();

    // Mientras se verifica la sesión, mostramos un mensaje de carga
    if (isLoading) {
        return <div>Verificando sesión...</div>;
    }

    // Si no hay 'status' (puede pasar al recargar la página),
    // no podemos decidir. Si hay un usuario, lo enviamos al dashboard
    // como una opción segura.
    if (!status) {
      if (user) return <Navigate to="/dashboard" replace />;
      // Si no hay usuario, el ProtectedRoute ya lo habrá enviado al login.
      return <div>Cargando estado del usuario...</div>;
    }

    // --- LÓGICA DE REDIRECCIÓN ---
    if (user?.role === 'SuperAdmins') {
        return <Navigate to="/admindashboard" replace />;
    }

    // Como viste en tu login, "hasPlan" es false
    if (status.hasPlan === false) {
        return <Navigate to="/plans" replace />;
    }

    if (status.hasPlan === true && status.hasRestaurant === false) {
        return <Navigate to="/restaurantconfig" replace />;
    }

    // Si todo está en orden, el destino por defecto es el dashboard
    return <Navigate to="/dashboard" replace />;
};

export default AuthRedirector;