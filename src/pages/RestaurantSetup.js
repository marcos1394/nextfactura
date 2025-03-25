import React, { useState, useRef, useContext, useCallback } from 'react';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
import { ToastContainer, toast } from 'react-toastify';
import {
  FaPlus,
  FaTrash,
  FaKey,
  FaCertificate,
  FaFileUpload,
  FaServer,
  FaLink,
} from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import InputField from '../components/InputField';
import ColorPicker from '../components/ColorPicker';
import FileUploadButton from '../components/FileUploadButton';

function RestaurantSetup() {
  const { darkMode } = useContext(ThemeContext);

  // Estado para la configuración general del “portal”
  const [portalConfig, setPortalConfig] = useState({
    portalName: '',
    customDomain: '',
    primaryColor: '#1c64f2',
    secondaryColor: '#f3f4f6',
  });

  const [restaurants, setRestaurants] = useState([
    {
      id: Date.now(), // Añadir ID único
      name: '',
      address: '',
      rfc: '',
      fiscal_address: '',
      csd_password: '',
      csd_certificate: null,
      csd_key: null,
      logo: null,
    },
  ]);

  const csdCertificateInputRefs = useRef({});
  const csdKeyInputRefs = useRef({});
  const logoInputRefs = useRef({});

  const [error, setError] = useState(null);

  // Manejo de cambios de la sección "Portal Config"
  const handlePortalChange = (e) => {
    const { name, value } = e.target;
    setPortalConfig((prev) => ({ ...prev, [name]: value }));
  };

  // Manejo de selección de color
  const handlePortalColorChange = (name, value) => {
    setPortalConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleRestaurantChange = useCallback((id, e) => {
    const { name, value } = e.target;
    setRestaurants(prev => prev.map(rest => 
      rest.id === id ? { ...rest, [name]: value } : rest
    ));
  }, []);
  

  const handleFileChange = (id, e) => {
    setRestaurants(prev => prev.map(rest => 
      rest.id === id ? { ...rest, [e.target.name]: e.target.files[0] } : rest
    ));
  };

 // Función para agregar restaurante modificada
const handleAddRestaurant = () => {
  setRestaurants((prev) => [
    ...prev,
    {
      id: Date.now(), // Nuevo ID único
      name: '',
      address: '',
      rfc: '',
      fiscal_address: '',
      csd_password: '',
      csd_certificate: null,
      csd_key: null,
      logo: null,
    },
  ]);
};

const handleRemoveRestaurant = (id) => {
  setRestaurants(prev => prev.filter(rest => rest.id !== id));
  // Limpiar refs
  delete csdCertificateInputRefs.current[id];
  delete csdKeyInputRefs.current[id];
  delete logoInputRefs.current[id];
};

  // Submit final
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Revisar si hay restaurantes sin datos fiscales
    const anyMissingFiscal = restaurants.some((rest) => {
      return !rest.csd_certificate || !rest.csd_key;
    });
    if (anyMissingFiscal) {
      toast.warn('Sin información fiscal completa, no podrás facturar. Completa más tarde.', {
        position: 'top-right',
        autoClose: 5000,
      });
    }

    // 1. FormData para subir archivos + datos
    const formData = new FormData();

    // Sección Portal
    formData.append('portalConfig', JSON.stringify(portalConfig));

    // Múltiples restaurantes
    restaurants.forEach((restaurant, index) => {
      formData.append(`restaurants[${index}][name]`, restaurant.name);
      formData.append(`restaurants[${index}][address]`, restaurant.address);
      formData.append(`restaurants[${index}][rfc]`, restaurant.rfc);
      formData.append(`restaurants[${index}][fiscal_address]`, restaurant.fiscal_address);
      formData.append(`restaurants[${index}][csd_password]`, restaurant.csd_password);

      if (restaurant.csd_certificate) {
        formData.append(`restaurants[${index}][csd_certificate]`, restaurant.csd_certificate);
      }
      if (restaurant.csd_key) {
        formData.append(`restaurants[${index}][csd_key]`, restaurant.csd_key);
      }
      if (restaurant.logo) {
        formData.append(`restaurants[${index}][logo]`, restaurant.logo);
      }
    });

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/portal-and-restaurants-setup`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setError(null);
      toast.success('Portal y Restaurantes configurados exitosamente', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error al configurar:', error);
      setError('Error al configurar el portal y restaurantes');
    }
  };
  return (
    <div
      className={`
        min-h-screen flex flex-col items-center p-4
        ${
          darkMode
            ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'
            : 'bg-gradient-to-br from-blue-100 to-white text-black'
        }
      `}
    >
      <div
        className={`
          max-w-5xl w-full p-8 rounded-3xl shadow-2xl transition-all duration-300
          ${darkMode ? 'bg-gray-800 border-2 border-gray-700' : 'bg-white border border-gray-200'}
        `}
      >
        <h2
          className={`
            text-4xl font-extrabold mb-8 text-center
            bg-clip-text text-transparent
            ${
              darkMode
                ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                : 'bg-gradient-to-r from-blue-600 to-blue-800'
            }
          `}
        >
          Configuración de Portal & Restaurantes
        </h2>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 animate-pulse rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección de Configuración de Portal */}
          <div
            className={`
              p-6 rounded-2xl
              ${darkMode ? 'bg-gray-700 border-2 border-gray-600' : 'bg-gray-50 border border-gray-200'}
              hover:shadow-lg
            `}
          >
            <h3
              className={`
                text-2xl font-semibold mb-4
                ${darkMode ? 'text-white' : 'text-blue-800'}
              `}
            >
              Configuración del Portal
            </h3>

            <InputField
              label="Nombre del portal"
              name="portalName"
              value={portalConfig.portalName}
              onChange={handlePortalChange}
              placeholder="Ej. Portal Facturación VIP"
              icon={FaServer}
            />
            <InputField
              label="Dominio/Subdominio"
              name="customDomain"
              value={portalConfig.customDomain}
              onChange={handlePortalChange}
              placeholder="ej. mirestaurante.nextfactura.com.mx"
              icon={FaLink}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <ColorPicker
                label="Color Primario"
                name="primaryColor"
                value={portalConfig.primaryColor}
                onChange={handlePortalColorChange}
              />
              <ColorPicker
                label="Color Secundario"
                name="secondaryColor"
                value={portalConfig.secondaryColor}
                onChange={handlePortalColorChange}
              />
            </div>
          </div>

          {/* Sección de Restaurantes */}
       {/* Sección de Restaurantes */}
{restaurants.map((restaurant, index) => (
  <div
    key={restaurant.id}
    className={`
      p-6 rounded-2xl transition-all duration-300 mt-4
      ${darkMode ? 'bg-gray-700 border-2 border-gray-600' : 'bg-gray-50 border border-gray-200'}
      hover:shadow-lg
    `}
  >
    <div className="flex justify-between items-center mb-6">
      <h3
        className={`
          text-2xl font-semibold
          ${darkMode ? 'text-white' : 'text-blue-800'}
        `}
      >
        Restaurante {index + 1}
      </h3>
      {restaurants.length > 1 && (
        <button
          type="button"
          onClick={() => handleRemoveRestaurant(restaurant.id)}
          className="
            text-red-500 hover:text-red-700
            bg-transparent hover:bg-red-100
            p-2 rounded-full transition-all duration-300
          "
        >
          <FaTrash />
        </button>
      )}
    </div>

    {/* Campos de texto */}
    <div className="grid md:grid-cols-2 gap-4">
      <InputField
        label="Nombre del Restaurante"
        name="name"
        value={restaurant.name}
        onChange={(e) => handleRestaurantChange(restaurant.id, e)}
        placeholder="Nombre del restaurante"
        icon={FaServer}
      />
      <InputField
        label="Dirección"
        name="address"
        value={restaurant.address}
        onChange={(e) => handleRestaurantChange(restaurant.id, e)}
        placeholder="Dirección"
        icon={FaServer}
      />
      <InputField
        label="RFC"
        name="rfc"
        value={restaurant.rfc}
        onChange={(e) => handleRestaurantChange(restaurant.id, e)}
        placeholder="RFC"
        icon={FaCertificate}
      />
      <InputField
        label="Dirección Fiscal"
        name="fiscal_address"
        value={restaurant.fiscal_address}
        onChange={(e) => handleRestaurantChange(restaurant.id, e)}
        placeholder="Dirección fiscal"
        icon={FaServer}
      />
    </div>

    {/* Subida de archivos */}
    <div className="grid md:grid-cols-3 gap-4 mt-4">
      <FileUploadButton
        name="csd_certificate"
        fileName={restaurant.csd_certificate?.name}
        onClickHandlerRef={(el) => (csdCertificateInputRefs.current[restaurant.id] = el)}
        onChangeFile={(e) => handleFileChange(restaurant.id, e)}
        icon={FaCertificate}
        label="Certificado CSD (.cer)"
      />
      <FileUploadButton
        name="csd_key"
        fileName={restaurant.csd_key?.name}
        onClickHandlerRef={(el) => (csdKeyInputRefs.current[restaurant.id] = el)}
        onChangeFile={(e) => handleFileChange(restaurant.id, e)}
        icon={FaKey}
        label="Llave privada CSD (.key)"
      />
      <FileUploadButton
        name="logo"
        fileName={restaurant.logo?.name}
        onClickHandlerRef={(el) => (logoInputRefs.current[restaurant.id] = el)}
        onChangeFile={(e) => handleFileChange(restaurant.id, e)}
        icon={FaFileUpload}
        label="Logo del Restaurante"
      />
    </div>

    <InputField
      label="Contraseña CSD"
      name="csd_password"
      value={restaurant.csd_password}
      onChange={(e) => handleRestaurantChange(restaurant.id, e)}
      placeholder="Contraseña CSD"
      type="password"
      icon={FaKey}
    />
  </div>
))}

<div className="grid md:grid-cols-2 gap-6 mt-8">
  <button
    type="button"
    className="
      w-full bg-gradient-to-r from-green-500 to-green-600
      text-white px-4 py-3 rounded-lg
      hover:from-green-600 hover:to-green-700
      transition-all duration-300
      flex items-center justify-center
      shadow-md hover:shadow-lg
    "
    onClick={handleAddRestaurant}
  >
    <FaPlus className="mr-2" />
    Agregar Restaurante
  </button>

  <button
    type="submit"
    className="
      w-full bg-gradient-to-r from-blue-600 to-blue-700
      text-white px-4 py-3 rounded-lg
      hover:from-blue-700 hover:to-blue-800
      transition-all duration-300
      flex items-center justify-center
      disabled:opacity-50 disabled:cursor-not-allowed
      shadow-md hover:shadow-lg
    "
    disabled={
      !portalConfig.portalName ||
      !portalConfig.customDomain ||
      restaurants.some((rest) => !rest.name || !rest.address)
    }
  >
    Guardar Configuración
  </button>
</div>
        </form>

        <hr className="my-8" />

        {/* Sección para descargar el ejecutable */}
        <div className="mt-4 text-center">
          <h3 className="text-xl font-semibold mb-2">
            Agente de Conexión SoftRestaurant
          </h3>
          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Descarga e instala este programa en la PC donde corre SoftRestaurant
            para configurar la conexión automáticamente sin ingresar datos técnicos.
          </p>
          <a
            href="https://my-restaurant-agent.s3.us-east-1.amazonaws.com/InstaladorSoftrestaurant.msi"
            download
            className="
              inline-block bg-blue-600 text-white 
              px-4 py-2 rounded-lg 
              shadow hover:bg-blue-700 
              transition-all
            "
          >
            Descargar Ejecutable
          </a>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
      />
    </div>
  );
}

export default RestaurantSetup;
