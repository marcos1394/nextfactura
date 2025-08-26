import React, { createContext, useState, useEffect, useCallback } from 'react';
// Importamos las funciones de nuestro servicio de API
import { loginUser, getAccountDetails, logoutUser } from '../services/api';

// --- EXPORTAMOS EL CONTEXTO ---
export const AuthContext = createContext(null);

// --- EXPORTAMOS EL PROVEEDOR ---
export const AuthProvider = ({ children }) => {
    // Un solo estado para guardar toda la información del usuario (perfil, plan, restaurantes, etc.)
    const [user, setUser] = useState(null);
    // Estado para saber si estamos verificando la sesión inicial
    const [isLoading, setIsLoading] = useState(true);

    // Esta función valida una sesión existente al cargar o recargar la página.
    const verifySession = useCallback(async () => {
        const token = localStorage.getItem('authToken'); // Usamos 'authToken' consistentemente
        if (!token) {
            setIsLoading(false);
            return;
        }
        
        try {
            // Hacemos UNA SOLA llamada al endpoint que nos da toda la información.
            const response = await getAccountDetails();
            if (response.success) {
                setUser(response.data); // Guardamos el objeto completo { profile, plan, restaurants, billing }
            } else {
                throw new Error("La sesión no es válida.");
            }
        } catch (error) {
            console.error("Fallo la verificación de la sesión:", error.message);
            // Si el token es inválido o la API falla, limpiamos todo.
            localStorage.removeItem('authToken');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Al cargar la aplicación por primera vez, intentamos verificar la sesión.
    useEffect(() => {
        verifySession();
    }, [verifySession]);

    // Función de login, ahora centraliza toda la lógica.
    const login = async (email, password) => {
        try {
            const data = await loginUser(email, password);
            
            if (data.token) {
                // 1. Guardamos el token en localStorage.
                localStorage.setItem('authToken', data.token);
                
                // 2. Inmediatamente después de guardar el token, recargamos
                //    toda la información de la cuenta para que el estado sea consistente.
                await verifySession();
            }
            return data; // Devolvemos la data por si el componente la necesita (ej. para 2FA)
        } catch (error) {
            // Si el login falla, nos aseguramos de que todo esté limpio.
            localStorage.removeItem('authToken');
            setUser(null);
            throw error; // Lanzamos el error para que LoginPage pueda mostrar un mensaje.
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        logoutUser(); // Notificamos al backend (sin esperar respuesta)
    };

    // El valor que será accesible por toda la aplicación.
    const value = {
        user,
        isAuthenticated: !!user, // true si hay un objeto de usuario, false si es null
        isLoading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};