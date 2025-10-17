import axios from 'axios';

// 1. CONFIGURACIÓN INICIAL DE AXIOS
// =======================================================
const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Permite que axios envíe y reciba cookies seguras.
});


// 2. INTERCEPTOR DE RESPUESTA (MANEJO AUTOMÁTICO DE SESIÓN EXPIRADA)
// =======================================================
api.interceptors.response.use(
  // Si la respuesta es exitosa (status 2xx), simplemente la devuelve.
  (response) => response,
  
  // Si la respuesta es un error, este código se ejecuta.
  async (error) => {
    const originalRequest = error.config;
    
    // Verificamos si el error es un 401 por token expirado y que no sea ya un reintento.
    if (error.response?.status === 401 && error.response.data.message === 'Token de acceso expirado.' && !originalRequest._retry) {
      originalRequest._retry = true; // Marcamos la petición para evitar bucles infinitos
      
      console.log('[API Interceptor] Token de acceso expirado. Intentando refrescar...');

      try {
        // Hacemos la llamada al endpoint de refresco. El navegador enviará la cookie 'refreshToken'.
        await api.post('/auth/refresh-token');
        
        console.log('[API Interceptor] Token refrescado. Reintentando petición original...');
        
        // Reintentamos la petición original que había fallado.
        return api(originalRequest);

      } catch (refreshError) {
        console.error("[API Interceptor] No se pudo refrescar el token. Sesión terminada.");
        // Si el refresh token también falla, es momento de redirigir al login.
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }
    
    // Para cualquier otro tipo de error, simplemente lo propagamos.
    return Promise.reject(error);
  }
);



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

export const getFiscalRegimes = async (personType = null) => {
    try {
        // Prepara los parámetros de consulta
        const config = {
            params: {}
        };
        
        // Si se especifica un tipo ('F' o 'M'), lo añade a la petición
        if (personType) {
            config.params.type = personType;
        }

        const response = await api.get('/restaurants/catalogs/fiscal-regimes', config);
        
        if (response.data.success) {
            return response.data.regimes; // Devuelve solo el array de regímenes
        } else {
            throw new Error('No se pudo cargar el catálogo de regímenes.');
        }
    } catch (error) {
        throw error.response?.data || new Error('Error al obtener el catálogo de regímenes.');
    }
};

export const checkSubdomainAvailability = async (subdomainName) => {
    try {
        // Hacemos un GET a la nueva ruta, pasando el nombre como parámetro de consulta
        const response = await api.get('/restaurants/subdomain/check', { 
            params: { name: subdomainName } 
        });
        return response.data; // Devuelve { success: true, available: true/false }
    } catch (error) {
        // Si el backend devuelve un 400 (formato inválido), lo capturamos aquí
        throw error.response?.data || new Error('Error al verificar el subdominio.');
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