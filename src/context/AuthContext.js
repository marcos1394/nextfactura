// src/context/AuthContext.js (Versión Web Profesional con Cookies)

import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { loginUser, getAccountDetails, logoutUser } from '../services/api';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Esta función verifica si hay una sesión activa pidiendo los datos de la cuenta.
    // El navegador se encarga de enviar la cookie automáticamente.
    const verifySession = useCallback(async () => {
        try {
            const response = await getAccountDetails();
            if (response.success) {
                setUser(response.data);
            } else {
                // Esto puede pasar si la cookie es inválida pero aún existe
                setUser(null);
            }
        } catch (error) {
            // Un error 401/403 aquí significa que no hay una cookie válida.
            console.log("No hay sesión activa.");
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Al cargar la aplicación, intentamos verificar la sesión.
    useEffect(() => {
        verifySession();
    }, [verifySession]);

    // La función login llama al endpoint. El backend se encarga de establecer la cookie.
    const login = async (email, password) => {
        try {
            await loginUser(email, password);
            // Si el login es exitoso, la cookie ya está en el navegador.
            // Ahora, verificamos la sesión para cargar los datos del usuario en el estado de React.
            await verifySession();
        } catch (error) {
            setUser(null); // Nos aseguramos de que el estado esté limpio si el login falla
            throw error; // Lanzamos el error para que el componente LoginPage lo muestre
        }
    };

    // La función logout llama al endpoint que limpia la cookie en el backend.
    const logout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Error en el logout del backend:", error);
        } finally {
            setUser(null); // Limpiamos el estado del usuario en el frontend
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// El hook no cambia
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};