import axios from 'axios';

// 1. CONFIGURACIÓN INICIAL DE AXIOS
// =======================================================
const api = axios.create({
  // La URL base que apunta a tu Nginx reverse proxy.
  baseURL: '/api',
  // ¡CRÍTICO! Esta opción le permite a axios enviar y recibir las cookies
  // seguras (HttpOnly) que establece tu backend.
  withCredentials: true,
});

// El interceptor de request que añadía el 'Authorization' header desde localStorage
// se elimina. El navegador ahora maneja el envío de la cookie automáticamente.


// 2. FUNCIONES DE LA API (Sin cambios en su lógica interna)
// =======================================================

// --- Funciones de Autenticación ---

export const loginUser = async (email, password) => {
    try {
        // Esta petición hará que el backend establezca la cookie en el navegador.
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Error de conexión o credenciales inválidas.');
    }
};

export const getAccountDetails = async () => {
    try {
        // El navegador adjuntará la cookie automáticamente a esta petición.
        const response = await api.get('/auth/account-details');
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('No se pudieron cargar los datos de la cuenta.');
    }
};

export const logoutUser = async () => {
    try {
        // Esta petición le dirá al backend que elimine la cookie.
        const response = await api.post('/auth/logout');
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Error al cerrar la sesión.');
    }
};


// --- Funciones de Restaurantes y Portal ---

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
    const response = await api.post('/restaurants/', formData);
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

// 3. EXPORTACIÓN POR DEFECTO
// =======================================================
export default api;