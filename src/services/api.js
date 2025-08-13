// src/services/api.js
import axios from 'axios';

const api = axios.create({
  // La URL base de tu backend. El '/api' es manejado por el reverse proxy de Nginx.
  // Cuando llamas a api.post('/auth/login'), en realidad se llama a /api/auth/login
  baseURL: '/api', 
});

// Este "interceptor" es una función que se ejecuta ANTES de cada petición.
// Su trabajo es revisar si tenemos un token en localStorage y añadirlo al encabezado.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Tu backend espera el token en el formato 'Bearer <token>'
      config.headers['Authorization'] = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
