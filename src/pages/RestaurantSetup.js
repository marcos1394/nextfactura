// src/pages/RestaurantSetup.js
import React, { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import { ToastContainer, toast } from 'react-toastify';
import {
  FaPlus, FaTrash, FaKey, FaCertificate, FaFileUpload, FaServer, FaLink,
  FaCheckCircle, FaTimesCircle, FaSpinner, FaArrowLeft, FaArrowRight, FaSave
} from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import InputField from '../components/InputField';
import ColorPicker from '../components/ColorPicker';
import FileUploadButton from '../components/FileUploadButton'; // Importa el corregido
import { fetchAuthSession } from 'aws-amplify/auth';

// --- Componente de Vista Previa del Micrositio (Sin cambios respecto a tu última versión) ---
const MicrositePreview = ({ config, logoFile }) => {
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(null);
  const { darkMode } = useThemeContext();
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    let objectUrl = null; setPreviewError(false);
    if (logoFile instanceof File) {
      try { objectUrl = URL.createObjectURL(logoFile); setLogoPreviewUrl(objectUrl); }
      catch (error) { console.error("Error creating object URL for preview:", error); setPreviewError(true); setLogoPreviewUrl(null); }
    } else if (config.existingLogoUrl) { setLogoPreviewUrl(config.existingLogoUrl); }
    else { setLogoPreviewUrl(null); }
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [logoFile, config.existingLogoUrl]);

  const fullDomain = config.customDomain ? `${config.customDomain.toLowerCase().replace(/[^a-z0-9_-]/g, '')}.nextmanager.com.mx` : '[subdominio].nextmanager.com.mx';
  const headerStyle = { backgroundColor: config.primaryColor || '#3B82F6', color: '#FFFFFF', padding: '20px', textAlign: 'center', borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit' };
  const bodyStyle = { backgroundColor: config.secondaryColor || '#F9FAFB', padding: '30px', minHeight: '180px', textAlign: 'center', color: darkMode ? '#E5E7EB' : '#374151' };

  return (
    <div className={`border-2 border-dashed rounded-lg mt-6 mb-4 ${darkMode ? 'border-gray-600' : 'border-gray-300'} p-4`}>
      <h4 className={`text-lg font-semibold mb-3 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Vista Previa del Micrositio</h4>
      <p className={`text-sm text-center mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>URL: <strong className={darkMode ? 'text-blue-400' : 'text-blue-700'}>{fullDomain}</strong></p>
      <div className={`border rounded-lg shadow-md max-w-md mx-auto overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div style={headerStyle}>
          <div className="h-12 flex items-center justify-center mb-2">{logoPreviewUrl ? (<img src={logoPreviewUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain" onError={() => { setPreviewError(true); setLogoPreviewUrl(null); }} />) : (<span className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>{previewError ? 'Error Logo' : 'Logo'}</span>)}</div>
          <h3 className="text-xl font-bold truncate" style={{ color: '#FFFFFF' }}>{config.portalName || '[Nombre del Portal]'}</h3>
        </div>
        <div style={bodyStyle}><p className="font-semibold">Buscar Ticket</p><div className="mt-3 space-y-2"><div className={`h-8 rounded ${darkMode ? 'bg-gray-600/50' : 'bg-gray-200'}`}></div> <div className={`h-8 rounded ${darkMode ? 'bg-gray-600/50' : 'bg-gray-200'}`}></div> <div className={`h-8 rounded ${darkMode ? 'bg-gray-600/50' : 'bg-gray-200'}`}></div> <div className={`h-10 rounded ${darkMode ? 'bg-blue-700/50' : 'bg-blue-500/80'}`}></div></div></div>
      </div>
      {previewError && (<p className="text-red-500 text-sm text-center mt-2">No se pudo cargar la vista previa del logo.</p>)}
    </div>
  );
};
// --- Fin Componente Vista Previa ---


function RestaurantSetup() {
  const { darkMode } = useThemeContext();
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(1);
  const [portalConfig, setPortalConfig] = useState({ portalName: '', customDomain: '', primaryColor: '#1c64f2', secondaryColor: '#f3f4f6', existingLogoUrl: null });
  const [portalLogoFile, setPortalLogoFile] = useState(null);
  const [fileErrors, setFileErrors] = useState({ portalLogo: null, restaurants: {} });
  const [subdomainStatus, setSubdomainStatus] = useState({ loading: false, available: null, checked: false, message: '' });
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [restaurants, setRestaurants] = useState([{
    id: Date.now(), name: '', address: '', rfc: '', fiscal_address: '', csd_password: '',
    csd_certificate: null, csd_key: null, logo: null,
    connection_host: '', connection_port: '', connection_user: '',
    connection_password: '', connection_db_name: '',
    vpn_username: '', vpn_password: ''
  }]);

  // --- Declaración de Refs ---
  const fileInputRefs = useRef({});
  const portalLogoInputRef = useRef(); // <<< ¡Estaba aquí!
 // Para todos los inputs de archivo dinámicos
  // --- Fin Declaración Refs ---

  const [stage1Loading, setStage1Loading] = useState(false);
  const [finalSubmitLoading, setFinalSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Función de Validación de Archivos ---
  const validateFile = (file, type) => {
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (!file) return "Archivo no seleccionado.";
    if (file.size > maxSize) return `Archivo grande (Máx: 2MB).`;

    if (type === 'image') {
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'].includes(file.type)) {
        return `Formato de imagen no válido.`;
      }
    } else if (type === 'cer') {
      if (!file.name.toLowerCase().endsWith('.cer')) return `Debe ser archivo .cer`;
    } else if (type === 'key') {
      if (!file.name.toLowerCase().endsWith('.key')) return `Debe ser archivo .key`;
    }
    return null; // Sin error
  };

  // --- Handlers Portal ---
  const handlePortalColorChange = (name, colorValue) => {
    setPortalConfig(prev => ({ ...prev, [name]: colorValue }));
  };

  const handlePortalLogoChange = (e) => {
    const file = e.target.files[0];
    setFileErrors(prev => ({ ...prev, portalLogo: null }));
    if (file) {
      const fileError = validateFile(file, 'image');
      if (fileError) {
        setFileErrors(prev => ({ ...prev, portalLogo: fileError }));
        toast.error(`Logo Portal: ${fileError}`);
        if(e.target) e.target.value = null;
        setPortalLogoFile(null);
        return;
      }
      setPortalLogoFile(file);
    } else {
      setPortalLogoFile(null);
    }
  };

  const checkSubdomainAvailability = useCallback(async (subdomainValue) => {
    if (!subdomainValue || !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(subdomainValue)) {
      setSubdomainStatus({ loading: false, available: false, checked: true, message: 'Formato inválido.' });
      return;
    }
    setSubdomainStatus({ loading: true, available: null, checked: false, message: 'Verificando...' });
    try {
      const session = await fetchAuthSession(); const idToken = session.tokens?.idToken?.toString(); if (!idToken) throw new Error('Token no disponible');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/portal/check-subdomain?subdomain=${subdomainValue}`, { headers: { Authorization: `Bearer ${idToken}` } });
      setSubdomainStatus({ loading: false, available: response.data.available, checked: true, message: response.data.message });
      toast[response.data.available ? 'success' : 'error'](response.data.message || "Disponibilidad verificada");
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error verificando.';
      setSubdomainStatus({ loading: false, available: false, checked: true, message: errorMsg }); toast.error(errorMsg);
    }
  }, []); // <-- Asegúrate que REACT_APP_API_URL esté en .env

  const handlePortalChange = (e) => {
    const { name, value } = e.target; let processedValue = value;
    if (name === 'customDomain') {
      processedValue = value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
      setSubdomainStatus({ loading: false, available: null, checked: false, message: '' });
      if (debounceTimeout) clearTimeout(debounceTimeout);
      setPortalConfig(prev => ({ ...prev, [name]: processedValue }));
      if (processedValue === '') return;
      const newTimeout = setTimeout(() => checkSubdomainAvailability(processedValue), 800);
      setDebounceTimeout(newTimeout);
    } else { setPortalConfig(prev => ({ ...prev, [name]: processedValue })); }
  };

  useEffect(() => { return () => { if (debounceTimeout) clearTimeout(debounceTimeout); }; }, [debounceTimeout]);

  // --- Handlers Restaurantes (Completos) ---
  const handleRestaurantChange = useCallback((id, e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value; // Manejar checkboxes si los hubiera
    setRestaurants(prev => prev.map(rest => rest.id === id ? { ...rest, [name]: val } : rest ));
  }, []);

  const handleFileChange = (id, e) => {
    const file = e.target.files[0];
    const name = e.target.name; // 'csd_certificate', 'csd_key', 'logo'

    // Crear una clave única para los errores de este input específico
    const fileErrorKey = `${id}-${name}`;
    setFileErrors(prev => {
        const newRestaurantErrors = { ...(prev.restaurants[id] || {}) };
        delete newRestaurantErrors[name]; // Limpiar error anterior para este input
        return { ...prev, restaurants: { ...prev.restaurants, [id]: newRestaurantErrors } };
    });

    if (file) {
      let fileType = 'document';
      let friendlyLabel = name; // Para el mensaje de error
      if (name === 'logo') { fileType = 'image'; friendlyLabel = 'Logo Restaurante'; }
      else if (name === 'csd_certificate') { fileType = 'cer'; friendlyLabel = 'Certificado CSD'; }
      else if (name === 'csd_key') { fileType = 'key'; friendlyLabel = 'Llave CSD'; }

      const errorMsg = validateFile(file, fileType);
      if (errorMsg) {
        // Guardar error específico
        setFileErrors(prev => ({
            ...prev,
            restaurants: { ...prev.restaurants, [id]: { ...(prev.restaurants?.[id] || {}), [name]: errorMsg } }
        }));
        toast.error(`Restaurante ${restaurants.findIndex(r=>r.id===id)+1} - ${friendlyLabel}: ${errorMsg}`);
        if(e.target) e.target.value = null; // Limpiar input visualmente
        // Asegurar que el archivo erróneo no se quede en el estado principal
        setRestaurants(prev => prev.map(rest => rest.id === id ? { ...rest, [name]: null } : rest));
        return;
      }
      // Si no hay error, guardar el archivo en el estado principal
      setRestaurants(prev => prev.map(rest => rest.id === id ? { ...rest, [name]: file } : rest));
    } else {
      // Si el usuario cancela la selección, limpiar el archivo del estado
      setRestaurants(prev => prev.map(rest => rest.id === id ? { ...rest, [name]: null } : rest));
    }
  };

  const handleAddRestaurant = () => {
     setRestaurants(prev => [...prev, {
       id: Date.now(), name: '', address: '', rfc: '', fiscal_address: '', csd_password: '',
       csd_certificate: null, csd_key: null, logo: null,
       connection_host: '', connection_port: '', connection_user: '',
       connection_password: '', connection_db_name: '',
       vpn_username: '', vpn_password: ''
     }]);
  };

  const handleRemoveRestaurant = (id) => {
     setRestaurants(prev => prev.filter(rest => rest.id !== id));
     // Limpiar errores asociados a este restaurante
     setFileErrors(prev => {
         const newErrors = { ...prev };
         delete newErrors.restaurants[id];
         return newErrors;
     });
  };

  // --- Navegación y Submit por Etapas ---
  const handleSavePortalConfigAndNext = async () => {
    // ... (Código completo como en la respuesta anterior, validando y llamando a POST /api/portal/setup) ...
    setError(null);
    if (!portalConfig.portalName.trim()) { toast.error("Nombre del portal es requerido."); return; }
    if (!portalConfig.customDomain.trim()) { toast.error("Subdominio es requerido."); return; }
    if (!subdomainStatus.checked || !subdomainStatus.available) { toast.error("Subdominio no disponible/verificado."); return; }
    if (fileErrors.portalLogo) { toast.error("Corrige el error del logo del portal."); return; }
    setStage1Loading(true);
    const formData = new FormData();
    const portalDataToSend = { portalName: portalConfig.portalName, customDomain: portalConfig.customDomain, primaryColor: portalConfig.primaryColor, secondaryColor: portalConfig.secondaryColor };
    formData.append('portalConfig', JSON.stringify(portalDataToSend));
    if (portalLogoFile) formData.append('portalLogo', portalLogoFile, portalLogoFile.name);
    let idToken; try { const session = await fetchAuthSession(); idToken = session.tokens?.idToken?.toString(); if (!idToken) throw new Error('Token no disponible'); } catch (authError) { setError("Error autenticación."); toast.error("Error autenticación."); setStage1Loading(false); return; }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/portal/setup`, formData, { headers: { Authorization: `Bearer ${idToken}` } });
      toast.success(response.data.message || 'Portal guardado.');
      if(response.data.portalConfig?.portal_logo_url){ setPortalConfig(prev => ({...prev, existingLogoUrl: response.data.portalConfig.portal_logo_url})); }
      setPortalLogoFile(null); setCurrentStage(2); window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) { const errorMsg = error.response?.data?.message || 'Error guardando portal.'; setError(errorMsg); toast.error(errorMsg); }
    finally { setStage1Loading(false); }
  };

  const handlePreviousStage = () => { setCurrentStage(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleSubmitAllConfig = async () => {
    // ... (Código completo como en la respuesta anterior, validando, creando FormData para restaurantes y llamando a POST /api/portal-and-restaurants-setup) ...
    setError(null); setFinalSubmitLoading(true);
    if (restaurants.some(r => !r.name || !r.address || !r.rfc || !r.fiscal_address || !r.csd_password || !r.csd_certificate || !r.csd_key)) {
        toast.error("Completa todos los campos requeridos para cada restaurante (Nombre, Dirección, RFC, Dir. Fiscal, CSD .cer, .key y Contraseña).");
        setFinalSubmitLoading(false); return;
    }
    // Validar errores de archivos
    const hasFileErrors = Object.values(fileErrors.restaurants).some(restErrors => Object.values(restErrors).some(e => e !== null));
    if (hasFileErrors) { toast.error("Corrige los errores en los archivos subidos."); setFinalSubmitLoading(false); return; }

    const formData = new FormData();
    // El backend necesita saber a qué portal asociar estos restaurantes.
    // Podemos pasar el portalConfig.customDomain o el backend puede buscar el portal del user_id.
    // Vamos a asumir que el backend obtiene el portalConfig del usuario autenticado.
    const restaurantsPayload = restaurants.map(r => { const { csd_certificate, csd_key, logo, ...restData } = r; return restData; });
    formData.append('restaurantsData', JSON.stringify(restaurantsPayload));
    restaurants.forEach((restaurant, index) => {
        if (restaurant.csd_certificate) formData.append(`restaurants[${index}][csd_certificate]`, restaurant.csd_certificate, restaurant.csd_certificate.name);
        if (restaurant.csd_key) formData.append(`restaurants[${index}][csd_key]`, restaurant.csd_key, restaurant.csd_key.name);
        if (restaurant.logo) formData.append(`restaurants[${index}][logo]`, restaurant.logo, restaurant.logo.name);
    });

    let idToken; try { const session = await fetchAuthSession(); idToken = session.tokens?.idToken?.toString(); if (!idToken) throw new Error('Token no disponible'); } catch (authError) { setError("Error autenticación."); toast.error("Error autenticación."); setFinalSubmitLoading(false); return; }
    try {
      // Llamada al endpoint original, asumiendo que puede manejar solo restaurantes si el portal ya existe
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/portal-and-restaurants-setup`, formData, { headers: { Authorization: `Bearer ${idToken}` } });
      toast.success(response.data.message || '¡Configuración guardada!');
      setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
    } catch (error) { const errorMsg = error.response?.data?.message || 'Error guardando restaurantes.'; setError(errorMsg); toast.error(errorMsg); }
    finally { setFinalSubmitLoading(false); }
  };


  // --- Renderizado con Etapas (Completo) ---
  return (
    <div className={`min-h-screen flex flex-col items-center p-2 sm:p-4 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-blue-100 to-white text-black'}`}>
      <div className={`w-full max-w-5xl p-3 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl shadow-xl sm:shadow-2xl ${darkMode ? 'bg-gray-800 border-2 border-gray-700' : 'bg-white border border-gray-200'}`}>
        {/* Indicador de etapa */}
        <div className="w-full flex justify-center items-center mb-4"> <div className="flex items-center"> <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStage === 1 ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-gray-300 text-gray-700'}`}>1</div> <div className={`h-1 w-8 sm:w-10 mx-1 transition-all duration-300 ${currentStage === 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div> <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStage === 2 ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-gray-300 text-gray-700'}`}>2</div> </div> </div>
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6 md:mb-8 text-center bg-clip-text text-transparent ${darkMode ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-blue-600 to-blue-800'}`}> Configuración Inicial <span className="text-base md:text-lg">({isMobile ? `Paso ${currentStage}` : `Paso ${currentStage} de 2`})</span> </h2>
        {error && (<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg">{error}</div>)}

        <div className="space-y-6 sm:space-y-8">
          {/* --- ETAPA 1: Configuración del Portal --- */}
          {currentStage === 1 && (
            <section aria-labelledby="portal-config-heading">
              <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl ${darkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50/80 border border-gray-200'} hover:shadow-lg transition-shadow duration-300`}>
                <h3 id="portal-config-heading" className={`text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-blue-800'}`}>Datos del Portal de Clientes</h3>
                <p className={`mb-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Define la apariencia y el acceso a tu micrositio.</p>
                <InputField label="Nombre del Portal" name="portalName" value={portalConfig.portalName} onChange={handlePortalChange} placeholder="Ej. Facturación Restaurante El Sol" icon={FaServer} required />
                <div className="relative mt-4">
                   <InputField label="Subdominio (Prefijo)" name="customDomain" value={portalConfig.customDomain} onChange={handlePortalChange} placeholder="ej. restaurante-sol" icon={FaLink} required
                     className={`pr-10 ${subdomainStatus.checked && subdomainStatus.available === true ? 'border-green-500 focus:ring-green-500' : ''} ${subdomainStatus.checked && subdomainStatus.available === false ? 'border-red-500 focus:ring-red-500' : ''}`} />
                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none" style={{top: '1.875rem'}}> {subdomainStatus.loading && <FaSpinner className="animate-spin text-gray-400" />}{subdomainStatus.checked && subdomainStatus.available === true && <FaCheckCircle className="text-green-500" />}{subdomainStatus.checked && subdomainStatus.available === false && <FaTimesCircle className="text-red-500" />}</div>
                 </div>
                 <p className={`text-xs mt-1 ${subdomainStatus.loading ? 'text-gray-500' : subdomainStatus.available ? 'text-green-600' : 'text-red-600'}`}> {subdomainStatus.message || '\u00A0'} </p>
                 <p className={`text-xs mt-1 mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}> URL final: <strong>{portalConfig.customDomain || '[subdominio]'}.nextmanager.com.mx</strong> </p>
                 <FileUploadButton name="portalLogo" fileName={portalLogoFile?.name} inputRef={portalLogoInputRef} onChangeFile={handlePortalLogoChange} icon={FaFileUpload} label="Logo del Portal (Opcional)" accept="image/*" error={fileErrors.portalLogo} helpText="PNG, JPG, GIF, SVG, WebP. Máx: 2MB"/>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                   <ColorPicker label="Color Primario" name="primaryColor" value={portalConfig.primaryColor} onChange={(name, color) => handlePortalColorChange(name, color)} />
                   <ColorPicker label="Color Secundario (Fondo)" name="secondaryColor" value={portalConfig.secondaryColor} onChange={(name, color) => handlePortalColorChange(name, color)} />
                 </div>
              </div>
              <MicrositePreview config={portalConfig} logoFile={portalLogoFile} />
              <div className="mt-6 text-right">
                 <button type="button" onClick={handleSavePortalConfigAndNext}
                   disabled={stage1Loading || !portalConfig.portalName || !portalConfig.customDomain || !subdomainStatus.available || !!fileErrors.portalLogo}
                   className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center sm:justify-start">
                   {stage1Loading ? <FaSpinner className="animate-spin mr-2" /> : null}
                   {stage1Loading ? 'Guardando Portal...' : (<><span>Siguiente: Datos Restaurante</span> <FaArrowRight className="ml-2" /></>)}
                 </button>
               </div>
            </section>
          )}

          {/* --- ETAPA 2: Configuración de Restaurantes y Fiscal --- */}
          {currentStage === 2 && (
            <section aria-labelledby="restaurant-config-heading">
              <h3 id="restaurant-config-heading" className={`text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-blue-800'}`}>Datos del Restaurante y Facturación</h3>
              <p className={`mb-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Ingresa la información fiscal y de conexión (si aplica) para cada sucursal.</p>
              {restaurants.map((restaurant, index) => (
                <div key={restaurant.id} className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 mt-4 ${darkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50/80 border border-gray-200'} hover:shadow-md relative`}>
                   {restaurants.length > 1 && ( <button type="button" onClick={() => handleRemoveRestaurant(restaurant.id)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-100/50 dark:hover:bg-red-900/30 transition-colors" aria-label="Eliminar restaurante"><FaTrash size={14} /></button> )}
                   <h4 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Restaurante {index + 1}</h4>
                   {/* Campos Restaurante */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 mb-4">
                     <InputField label="Nombre Comercial" name="name" value={restaurant.name} onChange={(e) => handleRestaurantChange(restaurant.id, e)} required icon={FaServer} />
                     <InputField label="Dirección (Calle, No, Colonia)" name="address" value={restaurant.address} onChange={(e) => handleRestaurantChange(restaurant.id, e)} required icon={FaServer} placeholder="Av. Principal #123, Col. Centro"/>
                   </div>
                   {/* Datos Fiscales */}
                   <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                      <h5 className={`text-base font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Datos Fiscales</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                        <InputField label="RFC" name="rfc" value={restaurant.rfc} onChange={(e) => handleRestaurantChange(restaurant.id, e)} required icon={FaCertificate} maxLength={13} placeholder="XAXX010101000"/>
                        <InputField label="Dirección Fiscal (CP, Ciudad, Estado)" name="fiscal_address" value={restaurant.fiscal_address} onChange={(e) => handleRestaurantChange(restaurant.id, e)} required icon={FaServer} placeholder="06000, Ciudad de México, CDMX"/>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                         <FileUploadButton name="csd_certificate" fileName={restaurant.csd_certificate?.name} inputRef={(el) => fileInputRefs.current[`${restaurant.id}-csd_certificate`] = el} onChangeFile={(e) => handleFileChange(restaurant.id, e)} icon={FaCertificate} label="Certificado CSD (.cer)" accept=".cer" error={fileErrors.restaurants?.[restaurant.id]?.csd_certificate} helpText="Archivo .cer del SAT" required/>
                         <FileUploadButton name="csd_key" fileName={restaurant.csd_key?.name} inputRef={(el) => fileInputRefs.current[`${restaurant.id}-csd_key`] = el} onChangeFile={(e) => handleFileChange(restaurant.id, e)} icon={FaKey} label="Llave CSD (.key)" accept=".key" error={fileErrors.restaurants?.[restaurant.id]?.csd_key} helpText="Archivo .key del SAT" required/>
                         <FileUploadButton name="logo" fileName={restaurant.logo?.name} inputRef={(el) => fileInputRefs.current[`${restaurant.id}-logo`] = el} onChangeFile={(e) => handleFileChange(restaurant.id, e)} icon={FaFileUpload} label="Logo Restaurante" accept="image/*" error={fileErrors.restaurants?.[restaurant.id]?.logo} helpText="Opcional, Máx 2MB"/>
                      </div>
                      <div className="mt-3">
                         <InputField label="Contraseña CSD" name="csd_password" value={restaurant.csd_password} onChange={(e) => handleRestaurantChange(restaurant.id, e)} type="password" icon={FaKey} required />
                      </div>
                   </div>
                   {/* Conexión SoftRestaurant */}
                   <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600">
                     <h5 className={`text-base sm:text-lg font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Datos Conexión SoftRestaurant (Opcional)</h5>
                     <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Solo si deseas sincronización con el punto de venta.</p>
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
                       <InputField label="Host/IP Servidor SR" name="connection_host" value={restaurant.connection_host} onChange={(e) => handleRestaurantChange(restaurant.id, e)} placeholder="192.168.1.100" />
                       <InputField label="Puerto SR" name="connection_port" value={restaurant.connection_port} onChange={(e) => handleRestaurantChange(restaurant.id, e)} placeholder="1433" type="number" />
                       <InputField label="Usuario BD SR" name="connection_user" value={restaurant.connection_user} onChange={(e) => handleRestaurantChange(restaurant.id, e)} placeholder="sa" />
                       <InputField label="Contraseña BD SR" name="connection_password" value={restaurant.connection_password} onChange={(e) => handleRestaurantChange(restaurant.id, e)} type="password" />
                       <InputField label="Nombre BD SR" name="connection_db_name" value={restaurant.connection_db_name} onChange={(e) => handleRestaurantChange(restaurant.id, e)} placeholder="softrestaurant10" />
                       {/* VPN Fields */}
                       {/* <InputField label="Usuario VPN (Opcional)" name="vpn_username" value={restaurant.vpn_username} onChange={(e) => handleRestaurantChange(restaurant.id, e)} /> */}
                       {/* <InputField label="Contraseña VPN (Opcional)" name="vpn_password" value={restaurant.vpn_password} onChange={(e) => handleRestaurantChange(restaurant.id, e)} type="password"/> */}
                     </div>
                   </div>
                 </div>
              ))}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
                <button type="button" className="w-full md:w-auto order-last md:order-first bg-gray-500 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center" onClick={handlePreviousStage}> <FaArrowLeft className="mr-2" /> Anterior </button>
                <button type="button" className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center" onClick={handleAddRestaurant}> <FaPlus className="mr-2" /> Agregar Restaurante </button>
                <button type="button" onClick={handleSubmitAllConfig} className="w-full md:w-auto order-first md:order-last bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  disabled={finalSubmitLoading || restaurants.some(r => !r.name || !r.address || !r.rfc || !r.fiscal_address || !r.csd_password || !r.csd_certificate || !r.csd_key)}>
                  {finalSubmitLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
                  Finalizar y Guardar Todo
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
      <ToastContainer theme={darkMode ? 'dark' : 'light'} position="top-right" autoClose={4000} />
    </div>
  );
}

export default RestaurantSetup;