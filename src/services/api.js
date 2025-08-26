import axios from 'axios';

// 1. CONFIGURACIÓN INICIAL DE AXIOS
// =======================================================
const api = axios.create({
  // La URL base que apunta a tu Nginx reverse proxy.
  baseURL: '/api', 
});

// Interceptor para añadir automáticamente el token de autenticación a cada petición.
api.interceptors.request.use(
  (config) => {
    // --- CORRECCIÓN CLAVE AQUÍ ---
    // Cambiamos 'token' por 'authToken' para que sea consistente con AuthContext y UserProfile.
    const token = localStorage.getItem('authToken'); 
    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// 2. FUNCIONES DE LA API PARA RESTAURANTES Y PORTAL
// =======================================================

export const createRestaurant = async (restaurantData, fiscalData, files) => {
  const formData = new FormData();
  formData.append('restaurantData', JSON.stringify(restaurantData));
  formData.append('fiscalData', JSON.stringify(fiscalData));
  if (files.csdCertificate) {
    formData.append('csdCertificate', files.csdCertificate);
  }
  if (files.csdKey) {
    formData.append('csdKey', files.csdKey);
  }
  try {
    const response = await api.post('/restaurants/', formData); // Ruta corregida para consistencia
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al crear el restaurante');
  }
};

export const updatePortalConfig = async (restaurantId, portalData, files) => {
    const formData = new FormData();
    formData.append('portalData', JSON.stringify(portalData));
    if (files.logo) {
        formData.append('logo', files.logo);
    }
    if (files.backgroundImage) {
        formData.append('backgroundImage', files.backgroundImage);
    }
    try {
        const response = await api.put(`/restaurants/${restaurantId}/portal`, formData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al actualizar el portal');
    }
};

export const testPOSConnection = async (restaurantId) => {
    try {
        const response = await api.post(`/restaurants/${restaurantId}/test-connection`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Fallo en la prueba de conexión');
    }
};

export const getRestaurants = async () => {
    try {
        const response = await api.get('/restaurants/');
        return response.data.restaurants; 
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al obtener los restaurantes');
    }
};

export const getRestaurant = async (restaurantId) => {
    try {
        const response = await api.get(`/restaurants/${restaurantId}`);
        return response.data.restaurant;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al obtener el restaurante');
    }
};

export const deleteRestaurant = async (restaurantId) => {
    try {
        const response = await api.delete(`/restaurants/${restaurantId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al eliminar el restaurante');
    }
};


// --- NUEVO: FUNCIONES DE LA API PARA AUTENTICACIÓN ---
// =======================================================

export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Error de conexión o credenciales inválidas.');
    }
};

export const getAccountDetails = async () => {
    try {
        const response = await api.get('/auth/account-details');
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('No se pudieron cargar los datos de la cuenta.');
    }
};

export const logoutUser = async () => {
    try {
        await api.post('/auth/logout');
    } catch (error) {
        console.error("Error notificando al backend sobre el logout:", error);
    }
};

// 3. EXPORTACIÓN POR DEFECTO
// =======================================================
export default api;