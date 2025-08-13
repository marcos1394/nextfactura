// src/hooks/useAuth.js

import { useContext } from 'react';

// Fíjate cómo este archivo importa el "cable de alta tensión" (AuthContext)
// desde la "planta de energía" (el otro archivo).
import { AuthContext } from '../context/AuthContext';

// Y aquí, este archivo crea y exporta el "enchufe de pared" (el hook useAuth)
// que todos tus otros componentes van a usar para conectarse.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Esto es un seguro para que no intentes usar el enchufe si no hay electricidad.
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
