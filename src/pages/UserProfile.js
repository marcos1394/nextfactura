// UserProfile.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';

function UserProfile() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    username: '',
    fiscalData: {
      rfc: '',
      fiscalAddress: '',
    },
    restaurants: [],
  });
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(response.data.user);
      } catch (error) {
        console.error('Error al obtener los datos del perfil:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'
      }`}
    >
      <div className="max-w-4xl w-full p-8 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800">
        <h2 className="text-3xl font-bold mb-6">Perfil del Usuario</h2>

        {/* Información Personal */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Información Personal</h3>
          <p>
            <strong>Nombre:</strong> {userData.name}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Usuario:</strong> {userData.username}
          </p>
        </div>

        {/* Datos Fiscales */}
        {userData.fiscalData && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Datos Fiscales</h3>
            <p>
              <strong>RFC:</strong> {userData.fiscalData.rfc}
            </p>
            <p>
              <strong>Dirección Fiscal:</strong> {userData.fiscalData.fiscalAddress}
            </p>
          </div>
        )}

        {/* Configuración de Restaurantes */}
        {userData.restaurants && userData.restaurants.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold">Restaurantes Configurados</h3>
            {userData.restaurants.map((restaurant, index) => (
              <div
                key={index}
                className="p-4 mb-4 bg-white dark:bg-gray-700 rounded-lg shadow-md"
              >
                <h4 className="text-lg font-semibold">Restaurante {index + 1}</h4>
                <p>
                  <strong>Nombre:</strong> {restaurant.name}
                </p>
                <p>
                  <strong>Dirección:</strong> {restaurant.address}
                </p>
                <p>
                  <strong>RFC:</strong> {restaurant.rfc}
                </p>
                <p>
                  <strong>Dirección Fiscal:</strong> {restaurant.fiscal_address}
                </p>
                <h5 className="mt-4 font-semibold">Datos de Conexión</h5>
                <p>
                  <strong>Host:</strong> {restaurant.connection.host}
                </p>
                <p>
                  <strong>Puerto:</strong> {restaurant.connection.port}
                </p>
                <p>
                  <strong>Usuario BD:</strong> {restaurant.connection.db_user}
                </p>
                <p>
                  <strong>Nombre BD:</strong> {restaurant.connection.db_name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
