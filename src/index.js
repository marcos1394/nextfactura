// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css'; // La ruta a tus estilos principales
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Si quieres empezar a medir el rendimiento en tu app, puedes pasar una función
// para registrar los resultados (por ejemplo: reportWebVitals(console.log))
// o enviar a un punto de análisis. Más información: https://bit.ly/CRA-vitals
reportWebVitals();
