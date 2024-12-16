import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
import {
  FaFileUpload,
  FaPlus,
  FaTrash,
  FaKey,
  FaCertificate,
  FaServer
} from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RestaurantSetup() {
  const [restaurants, setRestaurants] = useState([
    {
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

  const { darkMode } = useContext(ThemeContext);
  const [error, setError] = useState(null);
  const csdCertificateInputRefs = useRef([]);
  const csdKeyInputRefs = useRef([]);
  const logoInputRefs = useRef([]);

  const handleRestaurantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRestaurants = [...restaurants];
    updatedRestaurants[index][name] = value;
    setRestaurants(updatedRestaurants);
  };

  const handleFileChange = (index, e) => {
    const updatedRestaurants = [...restaurants];
    updatedRestaurants[index][e.target.name] = e.target.files[0];
    setRestaurants(updatedRestaurants);
  };

  const handleAddRestaurant = () => {
    setRestaurants([
      ...restaurants,
      {
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

  const handleRemoveRestaurant = (index) => {
    const updatedRestaurants = restaurants.filter((_, i) => i !== index);
    setRestaurants(updatedRestaurants);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    restaurants.forEach((restaurant, index) => {
      // Append restaurant details
      Object.keys(restaurant)
        .filter(key => key !== 'csd_certificate' && key !== 'csd_key' && key !== 'logo')
        .forEach(key => {
          formData.append(`restaurants[${index}][${key}]`, restaurant[key]);
        });

      // Append files
      if (restaurant.csd_certificate) {
        formData.append(
          `restaurants[${index}][csd_certificate]`,
          restaurant.csd_certificate
        );
      }
      if (restaurant.csd_key) {
        formData.append(
          `restaurants[${index}][csd_key]`,
          restaurant.csd_key
        );
      }
      if (restaurant.logo) {
        formData.append(
          `restaurants[${index}][logo]`,
          restaurant.logo
        );
      }
    });

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/restaurants`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setError(null);
      toast.success('Restaurantes configurados exitosamente', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error al configurar los restaurantes:', error);
      setError('Error al configurar los restaurantes');
    }
  };

  const InputField = ({ 
    name, 
    value, 
    onChange, 
    placeholder, 
    type = 'text', 
    icon: Icon = null, 
    required = true 
  }) => (
    <div className="relative mb-4">
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Icon size={20} />
        </div>
      )}
      <input
        type={type}
        name={name}
        className={`
          w-full p-3 pl-${Icon ? '10' : '3'} rounded-lg border-2 transition-all duration-300
          ${darkMode 
            ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500' 
            : 'bg-white text-black border-gray-300 focus:border-blue-400'}
          focus:outline-none focus:ring-2 ${
            darkMode 
              ? 'focus:ring-blue-600' 
              : 'focus:ring-blue-400'
          }
        `}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );

  const FileUploadButton = ({ 
    name, 
    fileName, 
    onClickHandler, 
    icon: Icon, 
    label 
  }) => (
    <div className="mb-4">
      <label className="block mb-2 font-medium">{label}:</label>
      <div className="flex items-center">
        <input
          type="file"
          name={name}
          className="hidden"
          ref={onClickHandler}
          onChange={null}
        />
        <button
          type="button"
          onClick={() => onClickHandler.current.click()}
          className="
            w-full bg-gradient-to-r 
            from-blue-500 to-blue-600 
            text-white px-4 py-3 rounded-lg 
            hover:from-blue-600 hover:to-blue-700 
            transition-all duration-300 
            flex items-center justify-center
            shadow-md hover:shadow-lg
          "
        >
          <Icon className="mr-2" />
          {fileName || `Subir ${label}`}
        </button>
      </div>
    </div>
  );

  return (
    <div 
      className={`
        min-h-screen flex items-center justify-center p-4 
        ${darkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' 
          : 'bg-gradient-to-br from-blue-100 to-white text-black'}
      `}
    >
      <div 
        className={`
          max-w-4xl w-full p-8 rounded-3xl shadow-2xl transition-all duration-300
          ${darkMode 
            ? 'bg-gray-800 border-2 border-gray-700' 
            : 'bg-white border border-gray-200'}
        `}
      >
        <h2 
          className={`
            text-4xl font-extrabold mb-8 text-center 
            bg-clip-text text-transparent 
            ${darkMode 
              ? 'bg-gradient-to-r from-blue-400 to-blue-600' 
              : 'bg-gradient-to-r from-blue-600 to-blue-800'}
          `}
        >
          Configuración de Restaurantes
        </h2>

        {error && (
          <div 
            className="
              bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 
              animate-pulse rounded-lg
            "
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {restaurants.map((restaurant, index) => (
            <div 
              key={index} 
              className={`
                p-6 rounded-2xl transition-all duration-300 
                ${darkMode 
                  ? 'bg-gray-700 border-2 border-gray-600' 
                  : 'bg-gray-50 border border-gray-200'}
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
                    onClick={() => handleRemoveRestaurant(index)}
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

              <div className="grid md:grid-cols-2 gap-4">
                <InputField
                  name="name"
                  value={restaurant.name}
                  onChange={(e) => handleRestaurantChange(index, e)}
                  placeholder="Nombre del restaurante"
                  icon={FaServer}
                />
                <InputField
                  name="address"
                  value={restaurant.address}
                  onChange={(e) => handleRestaurantChange(index, e)}
                  placeholder="Dirección"
                  icon={FaServer}
                />
                <InputField
                  name="rfc"
                  value={restaurant.rfc}
                  onChange={(e) => handleRestaurantChange(index, e)}
                  placeholder="RFC"
                  icon={FaCertificate}
                />
                <InputField
                  name="fiscal_address"
                  value={restaurant.fiscal_address}
                  onChange={(e) => handleRestaurantChange(index, e)}
                  placeholder="Dirección fiscal"
                  icon={FaServer}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <FileUploadButton
                  name="csd_certificate"
                  fileName={restaurant.csd_certificate?.name}
                  onClickHandler={el => csdCertificateInputRefs.current[index] = el}
                  icon={FaCertificate}
                  label="Certificado CSD (.cer)"
                />
                
                <FileUploadButton
                  name="csd_key"
                  fileName={restaurant.csd_key?.name}
                  onClickHandler={el => csdKeyInputRefs.current[index] = el}
                  icon={FaKey}
                  label="Llave privada CSD (.key)"
                />
                
                <FileUploadButton
                  name="logo"
                  fileName={restaurant.logo?.name}
                  onClickHandler={el => logoInputRefs.current[index] = el}
                  icon={FaFileUpload}
                  label="Logo del Restaurante"
                />
              </div>

              <InputField
                name="csd_password"
                value={restaurant.csd_password}
                onChange={(e) => handleRestaurantChange(index, e)}
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
              disabled={restaurants.some(
                restaurant => 
                  !restaurant.name || 
                  !restaurant.address || 
                  !restaurant.rfc || 
                  !restaurant.fiscal_address || 
                  !restaurant.csd_certificate || 
                  !restaurant.csd_key ||
                  !restaurant.csd_password
              )}
            >
              Guardar Configuración
            </button>
          </div>
        </form>

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
          theme={darkMode ? "dark" : "light"}
        />
      </div>
    </div>
  );
}

export default RestaurantSetup;