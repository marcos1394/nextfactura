import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://nextmanager.com.mx/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 1. Evitar bucles: Si el error viene de refresh-token o login, no reintentar
        if (
            originalRequest.url.includes('/auth/refresh-token') || 
            originalRequest.url.includes('/auth/login')
        ) {
            return Promise.reject(error);
        }

        // 2. Si es error 401 y no hemos reintentado esta petición aún
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Intentamos el refresh
                await api.post('/auth/refresh-token');
                
                // Si el refresh funciona, reintentamos la petición original
                return api(originalRequest);
            } catch (refreshError) {
                // 3. Si el refresh falla, la sesión es irrecuperable
                console.error("Refresh token falló o expiró.");
                
                // Opcional: Redirigir al login solo si estamos en el cliente
                if (typeof window !== 'undefined') {
                    // Limpiar localstorage si guardas algo ahí
                    // window.location.href = '/login'; 
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;