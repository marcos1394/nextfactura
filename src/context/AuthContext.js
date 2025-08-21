// src/context/AuthContext.js (Versión Final)
import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const verifyAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      // Para validar una sesión, sí necesitamos las dos llamadas
      const userResponse = await api.get('/auth/me');
      // NOTA: Tu '/me' no devuelve el status. Lo ideal es que lo hiciera.
      // Por ahora, el status solo se actualizará al hacer login.
      if (userResponse.data.success) {
        setUser(userResponse.data.user);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error("Fallo la verificación de la sesión:", error.message);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user, status } = response.data;
    
    localStorage.setItem('token', token);
    setUser(user);
    setStatus(status); // Guardamos el status que nos da el login
  };

  const logout = async () => {
    // ... tu función de logout sin cambios ...
  };

  const value = {
    user,
    status,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};