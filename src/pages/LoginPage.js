import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        { email, password }
      );
      const { role, token } = response.data;

      Cookies.set('authToken', token, {
        expires: 1,
        secure: true,
        sameSite: 'Strict',
      });

      toast.success('Inicio de sesión exitoso');

      if (role === 'superadmin') {
        navigate('/superadmin');
      } else if (role === 'admin') {
        navigate('/dashboard');
      } else {
        setError('Rol de usuario no reconocido');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas');
      toast.error('Error en el inicio de sesión');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/google-login`,
        { token: credentialResponse.credential }
      );

      const { role, token } = response.data;

      Cookies.set('authToken', token, {
        expires: 1,
        secure: true,
        sameSite: 'Strict',
      });

      toast.success('Inicio de sesión con Google exitoso');

      if (role === 'superadmin') {
        navigate('/superadmin');
      } else if (role === 'admin') {
        navigate('/dashboard');
      } else {
        setError('Rol de usuario no reconocido');
      }
    } catch (error) {
      setError('Error al iniciar sesión con Google');
      toast.error('Error al iniciar sesión con Google');
    }
  };

  const handleGoogleError = () => {
    setError('Error al conectar con Google');
    toast.error('Error al conectar con Google');
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div 
          className={`w-full max-w-md p-8 space-y-8 rounded-xl shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
            darkMode
              ? 'bg-gray-800 text-white border-2 border-gray-700'
              : 'bg-gray-100 text-black border border-gray-200'
          }`}
        >
          <div className="text-center">
            <h2 className="text-3xl font-extrabold mb-2">Iniciar sesión</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Accede a tu cuenta con tus credenciales
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 p-4 rounded">
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
            <div className="space-y-4">
              <div>
                <label 
                  htmlFor="email" 
                  className="block mb-2 text-sm font-medium opacity-70"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="tu.correo@ejemplo.com"
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-200 focus:ring-2 focus:outline-none ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 text-white'
                      : 'bg-white border-gray-300 focus:ring-blue-500 text-black'
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label 
                  htmlFor="password" 
                  className="block mb-2 text-sm font-medium opacity-70"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="********"
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-200 focus:ring-2 focus:outline-none ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 text-white'
                      : 'bg-white border-gray-300 focus:ring-blue-500 text-black'
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                onClick={() => navigate('/forgot-password')}
              >
                ¿Olvidaste tu contraseña?
              </span>
              <span
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                onClick={() => navigate('/register')}
              >
                Crear cuenta
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Iniciar sesión
            </button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                O continúa con
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </GoogleOAuthProvider>
  );
}

export default LoginPage;