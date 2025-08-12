import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Este componente ahora es mucho más simple
const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        // Si no está autenticado, lo mandamos a la página de login
        return <Navigate to="/login" replace />;
    }

    // Lógica opcional para roles (si la necesitas)
    // if (allowedRoles && !allowedRoles.includes(user.role)) {
    //     // Si no tiene el rol permitido, lo mandamos a una página de "No autorizado"
    //     return <Navigate to="/unauthorized" replace />;
    // }

    // Si está autenticado (y tiene el rol), mostramos el contenido de la ruta
    return <Outlet />;
};

export default ProtectedRoute;
