import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { loginUser, getAccountDetails, logoutUser } from '../services/api';
import api from '../services/api';

// 1. CREACIÓN DEL CONTEXTO
export const AuthContext = createContext(null);

// 2. PROVEEDOR DEL CONTEXTO
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Valida una sesión existente y devuelve los datos del usuario.
    const verifySession = useCallback(async () => {
        try {
            const response = await getAccountDetails();
            if (response.success) {
                setUser(response.data);
                return response.data; // Devolvemos los datos para usarlos inmediatamente
            }
            setUser(null);
            return null;
        } catch (error) {
            console.log("No hay sesión activa.");
            setUser(null);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Al cargar la app, intenta verificar la sesión.
    useEffect(() => {
        verifySession();
    }, [verifySession]);

    // Función de login que decide a dónde redirigir al usuario.
    const login = async (email, password) => {
        try {
            // 1. Llama a la API de login. El backend establece la cookie.
            await loginUser(email, password);
    
            // 2. Llama a verifySession para obtener la estructura completa del usuario
            //    y, a su vez, actualizar el estado global.
            const userData = await verifySession();
    
            if (!userData) {
                throw new Error("No se pudo verificar la sesión después del login.");
            }

            // 3. Usa los datos recién obtenidos para la lógica de redirección.
            if (!userData.plan?.name || userData.plan.name === 'Sin Plan Activo') {
                return '/plans';
            }
            if (!userData.restaurants || userData.restaurants.length === 0) {
                return '/restaurant-config';
            }
            return '/dashboard';
    
        } catch (error) {
            setUser(null);
            throw error;
        }
    };

    // La función logout no cambia.
    const logout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Error en el logout del backend:", error);
        } finally {
            setUser(null);
        }
    };

    // El valor que será accesible por toda la aplicación.
    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        verifySession // Exportamos verifySession para usarlo en el registro
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. HOOK PERSONALIZADO
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};