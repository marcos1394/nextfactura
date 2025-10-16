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

    const login = async (email, password) => {
    try {
        // 1. Llama a la API de login. El backend establece la cookie y devuelve el 'status'.
        const loginResponse = await loginUser(email, password);

        // --- CORRECCIÓN CLAVE ---
        // 2. Inmediatamente después, llama a verifySession.
        //    Esta función llamará a /account-details y establecerá el
        //    estado 'user' con la estructura anidada correcta ({ profile, ... }).
        await verifySession();

        // 3. Usa el objeto 'status' que devolvió la respuesta del login para la redirección.
        const status = loginResponse.status;
        if (!status.hasPlan) {
            return '/plans';
        }
        if (!status.hasRestaurant) {
            return '/restaurant-config';
        }
        return '/dashboard';

    } catch (error) {
        setUser(null);
        throw error;
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