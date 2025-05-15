// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css'; // Asegúrate que la ruta a tus estilos sea correcta
import App from './App';
import reportWebVitals from './reportWebVitals';

// --- Importaciones de Amplify ---
import { Amplify } from 'aws-amplify';
// Importa la configuración autogenerada (que puede tener el dominio incorrecto)
import awsExports from './aws-exports';
// --- Fin Importaciones Amplify ---


// --- INICIO: Workaround para Dominio Personalizado Cognito ---
// Creamos una copia modificable de la configuración exportada
const updatedAwsExports = {
  ...awsExports, // Copiamos toda la configuración original
  oauth: {
    ...awsExports.oauth, // Copiamos la configuración original de oauth
    // ¡Sobrescribimos SOLAMENTE el dominio aquí!
    domain: "auth.nextmanager.com.mx" // Asegúrate que este sea tu dominio personalizado ACTIVO
  }
};
// --- FIN: Workaround ---


// --- Configurar Amplify usando la configuración MODIFICADA ---
Amplify.configure(updatedAwsExports);
// --- Fin Configuración Amplify ---


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();