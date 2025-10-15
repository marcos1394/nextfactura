import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { loginUser, getAccountDetails, logoutUser } from '../services/api';

// 1. CREACIÓN DEL CONTEXTO
export const AuthContext = createContext(null);

// 2. PROVEEDOR DEL CONTEXTO
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Valida una sesión existente al cargar la página
    const verifySession = useCallback(async () => {
        try {
            const response = await getAccountDetails();
            if (response.success) {
                setUser(response.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.log("No hay sesión activa.");
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Al cargar la app por primera vez, intenta verificar la sesión
    useEffect(() => {
        verifySession();
    }, [verifySession]);

    // Función de login que ahora decide a dónde redirigir al usuario
    const login = async (email, password) => {
        try {
            const response = await loginUser(email, password);
            
            // Después de un login exitoso, el backend nos devuelve los datos del usuario.
            // Actualizamos el estado del usuario en el contexto.
            const userData = response.user;
            setUser(userData);
            
            // --- LÓGICA DE REDIRECCIÓN INTELIGENTE ---
            // Decidimos a dónde debe ir el usuario basándonos en su estado.
            
            // Caso 1: El usuario no tiene un plan o su plan no está activo.
            if (!userData.subscription || userData.subscription.status !== 'active') {
                return '/plans'; // Destino: página de planes
            }
            
            // Caso 2: El usuario tiene plan activo, pero no ha configurado su restaurante.
            if (!userData.restaurants || userData.restaurants.length === 0) {
                return '/restaurant-config'; // Destino: página de configuración de restaurante
            }
            
            // Caso 3: El usuario tiene todo en orden.
            return '/dashboard'; // Destino: el dashboard principal

        } catch (error) {
            setUser(null); // Nos aseguramos de que el estado esté limpio si el login falla.
            throw error; // Lanzamos el error para que LoginPage lo muestre.
        }
    };

    // La función logout no cambia
    const logout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Error en el logout del backend:", error);
        } finally {
            setUser(null);
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

// 3. HOOK PERSONALIZADO
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};