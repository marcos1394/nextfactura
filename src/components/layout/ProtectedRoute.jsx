import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Ruta corregida
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute - Guardián de seguridad de la aplicación.
 * 1. Espera a que el AuthContext termine de cargar.
 * 2. Si no hay usuario, redirige a Login guardando la ubicación actual.
 * 3. Si hay usuario pero no tiene el rol, redirige a Unauthorized.
 * 4. Si todo ok, muestra la página (Outlet).
 */
const ProtectedRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // 1. Estado de Carga (Spinner elegante)
    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-sm text-gray-500 font-medium animate-pulse">Verificando credenciales...</p>
            </div>
        );
    }

    // 2. No Autenticado -> Login
    if (!isAuthenticated) {
        // 'state' permite que el Login sepa a dónde redirigir después del éxito
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Sin Permisos (Roles) -> Unauthorized
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 4. Acceso Permitido
    return <Outlet />;
};

export default ProtectedRoute;