import React, { createContext, useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { loginUser, getAccountDetails, logoutUser } from '../services/api';
// --- CONTEXTO ---
export const AuthContext = createContext(null);

// --- HELPER: Calcular Estado del Usuario ---
// Esto convierte el objeto de usuario crudo en banderas lógicas fáciles de usar
const deriveUserStatus = (userData) => {
    if (!userData) return null;

    return {
        isSuperAdmin: userData.role === 'SuperAdmins',
        // Un usuario tiene plan si existe el objeto y no se llama "Sin Plan Activo" (o la lógica que uses en backend)
        hasPlan: !!userData.plan && userData.plan?.name !== 'Sin Plan Activo', 
        // Un usuario tiene restaurante si el array existe y tiene al menos uno
        hasRestaurant: Array.isArray(userData.restaurants) && userData.restaurants.length > 0,
        emailVerified: userData.emailVerified || false,
    };
};

// --- PROVEEDOR ---
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState(null); // Estado derivado (hasPlan, hasRestaurant, etc.)
    const [isLoading, setIsLoading] = useState(true);

    // 1. VERIFICAR SESIÓN (Función Central)
    const verifySession = useCallback(async () => {
        try {
            const response = await getAccountDetails();
            
            if (response.success && response.data) {
                const userData = response.data;
                setUser(userData);
                setStatus(deriveUserStatus(userData));
                return userData;
            } else {
                // Si la respuesta es success:false, limpiamos
                setUser(null);
                setStatus(null);
                return null;
            }
        } catch (error) {
            // Error silencioso: Probablemente el token expiró o no existe
            console.warn("Sesión no activa o expirada."); 
            setUser(null);
            setStatus(null);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 2. EFECTO INICIAL
    useEffect(() => {
        verifySession();
    }, [verifySession]);

    // 3. HELPER DE REDIRECCIÓN INTELIGENTE
    // Determina la mejor ruta basada en el estado actual del usuario
    const getRedirectPath = (userData) => {
        const currentStatus = deriveUserStatus(userData);

        if (currentStatus.isSuperAdmin) return '/admin/dashboard';
        if (!currentStatus.hasPlan) return '/plans';
        if (!currentStatus.hasRestaurant) return '/restaurant-config';
        
        return '/dashboard';
    };

    // 4. LOGIN
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            // A. Llamada a API (Cookie set)
            await loginUser(email, password);
            
            // B. Verificar Sesión inmediatamente para actualizar estado
            const userData = await verifySession();
            
            if (!userData) {
                throw new Error("Credenciales correctas, pero error al recuperar perfil.");
            }

            // C. Devolver la ruta a la que debe ir el usuario
            return getRedirectPath(userData);

        } catch (error) {
            setUser(null);
            setStatus(null);
            setIsLoading(false);
            throw error; // Re-lanzamos el error para que el LoginPage lo muestre en el Toast
        }
    };

    // 5. LOGOUT
    const logout = async () => {
        setIsLoading(true);
        try {
            await logoutUser();
        } catch (error) {
            console.error("Error al cerrar sesión en servidor:", error);
        } finally {
            // Limpieza total del estado cliente
            setUser(null);
            setStatus(null);
            setIsLoading(false);
            // Opcional: Limpiar LocalStorage si guardas algo ahí
            // localStorage.clear(); 
        }
    };

    // 6. MEMOIZACIÓN DEL VALOR
    // Evita re-renders innecesarios en componentes hijos
    const value = useMemo(() => ({
        user,
        status,          // Exportamos el estado calculado (CRÍTICO para AuthRedirector)
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        verifySession
    }), [user, status, isLoading, verifySession]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- HOOK ---
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};