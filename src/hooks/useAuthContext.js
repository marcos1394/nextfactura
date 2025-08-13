// src/context/AuthContext.js

import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api'; // Importamos nuestro cliente API centralizado

// --- EXPORTAMOS EL CONTEXTO ---
// Este 'export' es crucial para que otros archivos puedan importarlo.
export const AuthContext = createContext(null);

// --- EXPORTAMOS EL PROVEEDOR ---
// Este es el componente que envolverá tu aplicación.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Para manejar el estado de carga inicial

  // Función para validar un token y obtener los datos del usuario
  const verifyAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // Hacemos una llamada a tu endpoint '/me' para validar el token
      const response = await api.get('/auth/me'); 
      
      if (response.data.success) {
        setUser(response.data.user); // Guardamos los datos del usuario
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error("Fallo la verificación de la sesión:", error.response?.data?.message || error.message);
      // Si el token es inválido o expirado, lo limpiamos
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Al cargar la aplicación, verificamos si existe una sesión válida
  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  // Función para iniciar sesión
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token } = response.data;
    
    localStorage.setItem('token', token);
    
    // Después de guardar el token, verificamos la sesión para obtener los datos del usuario
    await verifyAuth(); 
  };

  // Función para cerrar sesión (backend y frontend)
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Error al hacer logout en el backend:", error.response?.data?.message || error.message);
    } finally {
      // Limpiamos todo en el lado del cliente, sin importar si el backend falló
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // El valor que será accesible por toda la aplicación
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
