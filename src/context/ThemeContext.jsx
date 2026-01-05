import React, { createContext, useEffect, useState, useContext } from 'react';

// 1. Crear contexto
const ThemeContext = createContext();

// 2. Crear provider
export const ThemeProvider = ({ children }) => {
  // ESTRATEGIA: "Lazy Initialization"
  // En lugar de iniciar en false, ejecutamos una función para determinar el estado inicial.
  // Esto evita el parpadeo de luz al recargar la página.
  const [darkMode, setDarkMode] = useState(() => {
    // Si no hay ventana (server-side rendering), default false
    if (typeof window === 'undefined') return false;

    // A. Revisar LocalStorage primero (Preferencia manual del usuario)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }

    // B. Si no hay nada guardado, revisar la preferencia del Sistema Operativo
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Efecto: Sincronizar el DOM y LocalStorage cada vez que 'darkMode' cambie
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Hook personalizado
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext debe usarse dentro de un ThemeProvider');
  }
  return context;
};

export default ThemeContext;