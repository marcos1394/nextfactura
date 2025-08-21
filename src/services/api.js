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
    const token = localStorage.getItem('token');
    if (token) {
      // Corregido: Se añade 'Bearer ' que es el formato estándar JWT esperado por el backend.
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// 2. FUNCIONES DE LA API PARA RESTAURANTES Y PORTAL
// =======================================================

/**
 * Crea un nuevo restaurante junto con sus datos fiscales y archivos.
 * @param {object} restaurantData - Datos generales del restaurante.
 * @param {object} fiscalData - Datos fiscales del restaurante.
 * @param {object} files - Objeto con los archivos { csdCertificate, csdKey }.
 * @returns {Promise<object>} - El restaurante creado.
 */
export const createRestaurant = async (restaurantData, fiscalData, files) => {
  const formData = new FormData();

  // Adjuntar datos JSON como texto plano
  formData.append('restaurantData', JSON.stringify(restaurantData));
  formData.append('fiscalData', JSON.stringify(fiscalData));

  // Adjuntar archivos si existen
  if (files.csdCertificate) {
    formData.append('csdCertificate', files.csdCertificate);
  }
  if (files.csdKey) {
    formData.append('csdKey', files.csdKey);
  }

  try {
    const response = await api.post('/restaurant', formData, {
      // No es necesario 'Content-Type', Axios lo maneja con FormData
    });
    return response.data;
  } catch (error) {
    // Lanza el error para que el componente que llama lo pueda capturar
    throw new Error(error.response?.data?.message || 'Error al crear el restaurante');
  }
};

/**
 * Actualiza la configuración del portal de un restaurante, incluyendo el logo y fondo.
 * @param {string} restaurantId - ID del restaurante al que se asocia el portal.
 * @param {object} portalData - Datos de configuración del portal.
 * @param {object} files - Objeto con los archivos { logo, backgroundImage }.
 * @returns {Promise<object>} - La configuración del portal actualizada.
 */
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
        // Asumiendo que el endpoint en el backend es PUT /api/restaurant/:id/portal
        const response = await api.put(`/restaurant/${restaurantId}/portal`, formData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al actualizar el portal');
    }
};

/**
 * Prueba la conexión a la base de datos de SoftRestaurant.
 * @param {string} restaurantId - ID del restaurante a probar.
 * @returns {Promise<object>} - El resultado de la prueba de conexión.
 */
export const testPOSConnection = async (restaurantId) => {
    try {
        const response = await api.post(`/restaurant/${restaurantId}/test-connection`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Fallo en la prueba de conexión');
    }
};

/**
 * Obtiene la lista de todos los restaurantes del usuario autenticado.
 * @returns {Promise<Array>} - Un array de objetos de restaurante.
 */
export const getRestaurants = async () => {
    try {
        const response = await api.get('/restaurant');
        return response.data.restaurants; // Devuelve directamente el array
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al obtener los restaurantes');
    }
};

/**
 * Obtiene un restaurante específico por su ID.
 * @param {string} restaurantId - El ID del restaurante a obtener.
 * @returns {Promise<object>} - El objeto del restaurante.
 */
export const getRestaurant = async (restaurantId) => {
    try {
        const response = await api.get(`/restaurant/${restaurantId}`);
        return response.data.restaurant; // Devuelve directamente el objeto
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al obtener el restaurante');
    }
};

/**
 * Elimina (desactiva) un restaurante por su ID.
 * @param {string} restaurantId - El ID del restaurante a eliminar.
 * @returns {Promise<object>} - Mensaje de confirmación.
 */
export const deleteRestaurant = async (restaurantId) => {
    try {
        const response = await api.delete(`/restaurant/${restaurantId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al eliminar el restaurante');
    }
};

// 3. EXPORTACIÓN POR DEFECTO
// =======================================================
// Exportamos la instancia de axios por si necesitas hacer llamadas más genéricas
// en otras partes de tu aplicación.
export default api;