import api from '../config/axios';

// ==========================================
// 1. SERVICIOS DE AUTENTICACIÓN (Auth)
// ==========================================

// --- ESTA ES LA FUNCIÓN QUE FALTABA ---
export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Error al registrar usuario.');
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Credenciales inválidas.');
    }
};

export const logoutUser = async () => {
    try {
        await api.post('/auth/logout');
        return true;
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        return false;
    }
};

export const getAccountDetails = async () => {
    try {
        const response = await api.get('/auth/account-details');
        return response.data;
    } catch (error) {
        return { success: false, data: null };
    }
};

// ==========================================
// 2. SERVICIOS DE RESTAURANTES
// ==========================================

export const getRestaurants = async () => {
    try {
        const response = await api.get('/restaurants/');
        return response.data.restaurants || [];
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al obtener restaurantes');
    }
};

export const getRestaurant = async (restaurantId) => {
    try {
        const response = await api.get(`/restaurants/${restaurantId}`);
        return response.data.restaurant;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al obtener detalles del restaurante');
    }
};

export const createRestaurant = async (restaurantData, fiscalData, files) => {
    const formData = new FormData();
    formData.append('restaurantData', JSON.stringify(restaurantData));
    formData.append('fiscalData', JSON.stringify(fiscalData));
    
    if (files.csdCertificate) formData.append('csdCertificate', files.csdCertificate);
    if (files.csdKey) formData.append('csdKey', files.csdKey);

    try {
        const response = await api.post('/restaurants/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al crear el restaurante');
    }
};

export const updatePortalConfig = async (restaurantId, portalData, files) => {
    const formData = new FormData();
    formData.append('portalData', JSON.stringify(portalData));
    
    if (files.logo) formData.append('logo', files.logo);
    if (files.backgroundImage) formData.append('backgroundImage', files.backgroundImage);

    try {
        const response = await api.put(`/restaurants/${restaurantId}/portal`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al actualizar el portal');
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

// ==========================================
// 3. UTILIDADES Y CONFIGURACIONES
// ==========================================

export const checkSubdomainAvailability = async (subdomainName) => {
    try {
        const response = await api.get('/restaurants/subdomain/check', { 
            params: { name: subdomainName } 
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Error al verificar el subdominio.');
    }
};

export const getFiscalRegimes = async (personType = null) => {
    try {
        const config = { params: {} };
        if (personType) config.params.type = personType;

        const response = await api.get('/restaurants/catalogs/fiscal-regimes', config);
        
        if (response.data.success) {
            return response.data.regimes;
        }
        throw new Error('Formato de respuesta inválido');
    } catch (error) {
        throw error.response?.data || new Error('Error al cargar regímenes fiscales.');
    }
};

export const generateAgentKey = async (restaurantId) => {
    try {
        const response = await api.post(`/restaurants/${restaurantId}/generate-agent-key`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al generar clave de agente');
    }
};

export const testPOSConnection = async (restaurantId) => {
    try {
        const response = await api.post(`/restaurants/${restaurantId}/test-connection`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Sin conexión con el punto de venta');
    }
};

export const getFullRestaurantConfig = async () => {
    try {
        const response = await api.get('/restaurants/full-config');
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Error al cargar la configuración global.');
    }
};

// ==========================================
// 4. PAGOS Y PLANES
// ==========================================

export const getPlans = async () => {
    try {
        const response = await api.get('/payments/plans');
        return response.data.plans || [];
    } catch (error) {
        throw new Error('Error al cargar los planes.');
    }
};

export const createPaymentSession = async (priceId) => {
    try {
        const response = await api.post('/payments/create-checkout-session', { priceId });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al iniciar el pago.');
    }
};

export const getPurchaseStatus = async (purchaseId) => {
    try {
        const response = await api.get(`/payments/purchase-status/${purchaseId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error verificando el estado del pago.');
    }
};

export default api;