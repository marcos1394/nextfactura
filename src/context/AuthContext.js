import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { loginUser, getAccountDetails, logoutUser } from '../services/api';

// 1. CREACIÓN DEL CONTEXTO
// =======================================================
export const AuthContext = createContext(null);

// 2. PROVEEDOR DEL CONTEXTO
// =======================================================
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Esta función valida una sesión existente.
    // La cookie HttpOnly se envía automáticamente gracias a la configuración de api.js.
    const verifySession = useCallback(async () => {
        try {
            const response = await getAccountDetails();
            if (response.success) {
                setUser(response.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            // Un error 401/403 aquí significa que no hay una cookie válida o ha expirado.
            // El interceptor en api.js ya intentó refrescarla. Si aún falla, no hay sesión.
            console.log("No hay sesión activa o el token de refresco expiró.");
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Al cargar la aplicación por primera vez, intentamos verificar la sesión.
    useEffect(() => {
        verifySession();
    }, [verifySession]);

    // La función login llama al endpoint. El backend establece la cookie.
    const login = async (email, password) => {
        try {
            await loginUser(email, password);
            // Si el login fue exitoso, el backend ya estableció la cookie.
            // Ahora, verificamos la sesión para cargar los datos del usuario en nuestro estado de React.
            await verifySession();
        } catch (error) {
            setUser(null); // Nos aseguramos de que el estado esté limpio si el login falla.
            throw error; // Lanzamos el error para que el componente LoginPage lo pueda mostrar al usuario.
        }
    };

    // La función logout llama al endpoint que limpia la cookie en el backend.
    const logout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Error en el logout del backend:", error);
        } finally {
            // Limpiamos el estado del usuario en el frontend independientemente del resultado.
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
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. HOOK PERSONALIZADO PARA USAR EL CONTEXTO
// =======================================================
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};