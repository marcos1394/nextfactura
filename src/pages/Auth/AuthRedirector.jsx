import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// --- COMPONENTE VISUAL: PANTALLA DE CARGA ---
// Mantiene al usuario tranquilo mientras decidimos a dónde enviarlo.
const RedirectLoader = ({ message }) => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
        >
            {/* Logo o Icono de Carga */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <div className="relative bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
            </div>
            
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                NextManager
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                {message || 'Analizando perfil...'}
            </p>
        </motion.div>
    </div>
);

/**
 * AuthRedirector - El "Cerebro" de la navegación post-login.
 * Analiza el estado del usuario (Plan, Restaurante, Rol) y lo envía
 * a la pantalla exacta que necesita ver.
 */
const AuthRedirector = () => {
    const { status, user, isLoading } = useAuth();
    const [longLoad, setLongLoad] = useState(false);

    // Efecto estético: Si tarda más de 200ms, mostramos mensaje diferente
    // para que el usuario sepa que seguimos trabajando.
    useEffect(() => {
        const timer = setTimeout(() => setLongLoad(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    // 1. ESTADO DE CARGA: Mostramos la pantalla bonita
    if (isLoading) {
        return <RedirectLoader message={longLoad ? "Sincronizando datos..." : "Verificando sesión..."} />;
    }

    // 2. SEGURIDAD: Si no hay status (error raro), intentamos salvar al usuario
    if (!status) {
      if (user) return <Navigate to="/dashboard" replace />;
      return <RedirectLoader message="Recuperando estado..." />;
    }

    // --- LÓGICA DE TRÁFICO ---

    // A. Super Administradores
    if (user?.role === 'SuperAdmins') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // B. Usuarios Nuevos: Sin Plan
    if (status.hasPlan === false) {
        return <Navigate to="/plans" replace />;
    }

    // C. Usuarios con Plan pero Sin Configuración de Restaurante
    if (status.hasPlan === true && status.hasRestaurant === false) {
        // Ajuste: Usamos kebab-case para URLs más limpias
        return <Navigate to="/restaurant-config" replace />;
    }

    // D. Usuarios Listos: Al Dashboard Principal
    return <Navigate to="/dashboard" replace />;
};

export default AuthRedirector;