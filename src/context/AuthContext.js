import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// 1. Creamos el Contexto
const AuthContext = createContext(null);

// 2. Creamos el "Proveedor" que envolverá nuestra App
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    // Efecto para verificar el token al cargar la app
    useEffect(() => {
        if (token) {
            // Aquí deberías verificar que el token sea válido contra tu backend
            // Por ahora, asumiremos que si hay token, hay un usuario (simplificación)
            // En un caso real, harías una llamada a /api/auth/me para obtener los datos del usuario
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Simulación de datos de usuario
            setUser({ email: 'usuario@cargado.com' }); // Reemplazar con datos reales del backend
        }
    }, [token]);

    // Función para iniciar sesión
    const login = async (email, password) => {
        try {
            // Llamada a tu NUEVO backend para autenticar
            const response = await axios.post('/api/auth/login', { email, password });
            const { token, userData } = response.data;

            localStorage.setItem('token', token);
            setToken(token);
            setUser(userData);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
            console.error("Error en el login:", error);
            // Aquí puedes manejar el error, por ejemplo, con toast.error()
            throw error;
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    // Valor que proveerá el contexto
    const value = {
        user,
        token,
        isAuthenticated: !!user, // Booleano para saber si está autenticado
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Creamos un "Hook" personalizado para usar el contexto fácilmente
export const useAuth = () => {
    return useContext(AuthContext);
};
