import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
  const { darkMode } = useThemeContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Indicador de carga

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Por favor, completa todos los campos.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        { email, password }
      );

      const { role, token } = response.data;
      Cookies.set('authToken', token, { expires: 1, secure: true, sameSite: 'Strict' });

      toast.success('Inicio de sesión exitoso');

      const statusResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { hasPlan, hasRestaurant } = statusResponse.data;

      if (!hasPlan) navigate('/plans');
      else if (hasPlan && !hasRestaurant) navigate('/restaurantconfig');
      else role === 'superadmin' ? navigate('/superadmin') : navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error en las credenciales');
      toast.error('Error en el inicio de sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/google-login`,
        { token: credentialResponse.credential }
      );

      const { role, token } = response.data;
      Cookies.set('authToken', token, { expires: 1, secure: true, sameSite: 'Strict' });

      toast.success('Inicio de sesión con Google exitoso');

      const statusResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { hasPlan, hasRestaurant } = statusResponse.data;

      if (!hasPlan) navigate('/plans');
      else if (hasPlan && !hasRestaurant) navigate('/restaurantconfig');
      else role === 'superadmin' ? navigate('/superadmin') : navigate('/dashboard');
    } catch {
      setError('Error al iniciar sesión con Google');
      toast.error('Error al iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Error al conectar con Google');
    toast.error('Error al conectar con Google');
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
        <div
          className={`w-full max-w-md p-8 space-y-8 rounded-2xl shadow-lg transition-transform transform hover:scale-[1.02] ${
            darkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-gray-100 text-black border border-gray-300'
          }`}
        >
          <h2 className="text-3xl font-extrabold text-center mb-2">Iniciar sesión</h2>
          <p className="text-center text-gray-500 dark:text-gray-400">Accede a tu cuenta</p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 p-4 rounded-lg">
              <p className="text-red-700 dark:text-red-200">{error}</p>
            </div>
          )}

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Correo electrónico</label>
              <input
                type="email"
                id="email"
                className={`w-full px-4 py-2 rounded-lg transition focus:ring-2 ${
                  darkMode ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-500' : 'bg-gray-100 text-black border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">Contraseña</label>
              <input
                type="password"
                id="password"
                className={`w-full px-4 py-2 rounded-lg transition focus:ring-2 ${
                  darkMode ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-500' : 'bg-gray-100 text-black border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg transition ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {loading ? 'Cargando...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">O continúa con</span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </div>
        </div>
      </div>
      <ToastContainer />
    </GoogleOAuthProvider>
  );
}

export default LoginPage;
