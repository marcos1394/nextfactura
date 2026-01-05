import React from 'react';
import ReactDOM from 'react-dom/client';

// Estilos Globales (Tailwind + Custom CSS)
import './styles/index.css';

// Componente Principal
import App from './App';

// Contextos Globales
// Nota: Aquí envolvemos la aplicación con proveedores esenciales
import { AuthProvider } from './context/AuthContext';

// 1. Seleccionamos el nodo raíz del DOM
const rootElement = document.getElementById('root');

// 2. Validación de seguridad (Best Practice)
if (!rootElement) {
  throw new Error("Error crítico: No se encontró el elemento raíz 'root' en el HTML.");
}

// 3. Inicializamos la raíz de React 18
const root = ReactDOM.createRoot(rootElement);

// 4. Renderizamos la aplicación
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);