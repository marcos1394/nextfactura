// src/context/AuthContext.js

import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

// --- EXPORTAMOS EL CONTEXTO ---
export const AuthContext = createContext(null);

// --- EXPORTAMOS EL PROVEEDOR ---
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(null); // <-- AÑADIDO: para guardar el estado del usuario
  const [isLoading, setIsLoading] = useState(true);

  // Esta función se encarga de validar una sesión existente al recargar la página
  const verifyAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      // Para una sesión existente, hacemos dos llamadas para obtener toda la información
      const userResponse = await api.get('/auth/me'); 
      // NOTA: Lo ideal es que tu backend tuviera un endpoint como '/users/status'
      // o que el endpoint '/auth/me' también devolviera el estado del plan/restaurante.
      // Por ahora, el status solo se cargará al hacer login.
      if (userResponse.data.success) {
        setUser(userResponse.data.user);
      } else {
        // Limpiamos si la respuesta del backend no es exitosa
        localStorage.removeItem('token');
        setUser(null);
        setStatus(null);
      }
    } catch (error) {
      console.error("Fallo la verificación de la sesión:", error.message);
      // Limpiamos si el token es inválido o la petición falla
      localStorage.removeItem('token');
      setUser(null);
      setStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  // Función de login que ahora recibe y guarda el 'status'
  const login = async (email, password) => {
    // La llamada al backend ahora devuelve token, user y status
    const response = await api.post('/auth/login', { email, password });
    
    const { token, user, status } = response.data;
    
    // Guardamos toda la información en el estado y localStorage
    localStorage.setItem('token', token);
    setUser(user);
    setStatus(status); // <-- AÑADIDO: guardamos el status
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Error al hacer logout en el backend:", error.message);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setStatus(null); // <-- AÑADIDO: limpiamos el status al salir
    }
  };

  // El valor que será accesible por toda la aplicación
  const value = {
    user,
    status, // <-- AÑADIDO: exponemos el status para que AuthRedirector lo use
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};