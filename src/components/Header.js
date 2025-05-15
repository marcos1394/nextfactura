// src/components/Header.js
import React, { useState, useContext, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import { ThemeContext } from '../context/ThemeContext';
import { Hub } from 'aws-amplify/utils';
// Importar ambas funciones necesarias de auth
import { getCurrentUser, signOut as amplifySignOut, fetchUserAttributes } from 'aws-amplify/auth';
import { motion } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Estado para autenticación y datos del usuario
  const [authState, setAuthState] = useState('checking');
  const [currentUser, setCurrentUser] = useState(null); // Guarda el objeto base de getCurrentUser
  const [userAttributes, setUserAttributes] = useState(null); // Guarda los atributos detallados

  useEffect(() => {
    const checkUserAndFetchAttributes = async () => {
      setAuthState('checking'); // Indicar que estamos verificando
      try {
        // Primero, verificar si hay un usuario logueado
        const user = await getCurrentUser(); // Obtiene userId, username
        setCurrentUser(user);
        console.log("Header: Usuario encontrado (getCurrentUser)", user);

        // Si hay usuario, obtener sus atributos detallados
        try {
            const attributes = await fetchUserAttributes(); // Obtiene { name: '...', email: '...', ... }
            console.log("Header: Atributos obtenidos (fetchUserAttributes)", attributes);
            setUserAttributes(attributes);
            setAuthState('signedIn'); // Marcar como logueado solo después de obtener atributos
        } catch (attrError) {
            console.error("Header: Error obteniendo atributos detallados:", attrError);
            // Aún así, el usuario está técnicamente logueado si getCurrentUser tuvo éxito
            setAuthState('signedIn'); // Marcar como logueado, aunque sin atributos detallados
            setUserAttributes(null); // Asegurar que no haya atributos viejos
        }

      } catch (error) {
        // Si getCurrentUser falla, no hay usuario autenticado
        console.log("Header: No hay usuario autenticado", error);
        setCurrentUser(null);
        setUserAttributes(null);
        setAuthState('signedOut');
      }
    };

    checkUserAndFetchAttributes(); // Verificar al montar

    // Listener de Hub para cambios (signIn, signOut)
    const hubListenerCancel = Hub.listen('auth', ({ payload }) => {
      const { event, data } = payload;
      console.log('Header: Evento de Auth Hub:', event);
      switch (event) {
        case 'signedIn':
        case 'autoSignIn':
          // Cuando hay un sign-in, re-verificamos todo para asegurar datos frescos
          checkUserAndFetchAttributes();
          break;
        case 'signedOut':
        case 'tokenRefresh_failure':
        case 'autoSignIn_failure':
          setCurrentUser(null);
          setUserAttributes(null);
          setAuthState('signedOut');
          break;
        default:
          break;
      }
    });

    return () => { hubListenerCancel(); }; // Limpiar listener
  }, []); // Ejecutar solo al montar

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleAuthRedirect = () => {
      navigate('/dashboard');
      if (isMenuOpen) toggleMenu();
  };

  const handleSignOut = async () => {
      try {
          await amplifySignOut({ global: true }); // global: true invalida todos los tokens
          // El listener de Hub se encargará de actualizar el estado a signedOut
          if (isMenuOpen) toggleMenu();
          navigate('/'); // Redirigir a home
      } catch (error) {
          console.error('Error signing out: ', error);
      }
  };

  // --- Menús Condicionales (sin cambios en su contenido) ---
  const publicLinks = ( <> ... </> ); // Igual que antes
  const privateLinks = ( <> ... </> ); // Igual que antes

  // --- Renderizado Principal ---
  // Podrías mostrar un loader mientras authState === 'checking'
  if (authState === 'checking') {
     return <header className="sticky top-0 z-40 w-full h-16 bg-white dark:bg-gray-900"></header>; // Placeholder
  }

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] ${
        darkMode ? 'bg-gray-900/75' : 'bg-white/75'
      } text-gray-900 dark:text-white`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Logo */}
          <RouterLink to={authState === 'signedIn' ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center">
             <span className="text-2xl font-bold tracking-tight">NextManager</span>
          </RouterLink>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex md:items-center md:space-x-1 lg:space-x-3">
            {authState === 'signedIn' ? privateLinks : publicLinks}
          </nav>

          {/* Acciones Derecha */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button onClick={toggleTheme} aria-label="Toggle Dark Mode" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              {darkMode ? ( <SunIcon className="h-6 w-6 text-yellow-400" /> ) : ( <MoonIcon className="h-6 w-6 text-gray-700" /> )}
            </button>

            {/* Botones de Usuario / Login (Desktop) */}
            <div className="hidden md:flex items-center">
              {/* Ahora usamos userAttributes para el nombre/email */}
              {authState === 'signedIn' ? (
                <>
                  <span className="text-sm mr-4 hidden lg:inline">Hola, {userAttributes?.name || userAttributes?.email || currentUser?.username || 'Usuario'}</span>
                  <button onClick={handleSignOut} className="...">
                     <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                    Cerrar Sesión
                  </button>
                </>
              ) : ( // authState === 'signedOut' implícito
                <div className="space-x-2">
                  <button onClick={handleAuthRedirect} className="...">Iniciar Sesión</button>
                  <button onClick={handleAuthRedirect} className="...">Registrarse</button>
                </div>
              )}
            </div>

            {/* Botón Menú Móvil */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="..." aria-controls="mobile-menu" aria-expanded={isMenuOpen}>
                <span className="sr-only">Abrir menú principal</span>
                {isMenuOpen ? ( <XMarkIcon className="block h-6 w-6" /> ) : ( <Bars3Icon className="block h-6 w-6" /> )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Panel Menú Móvil (Animado) */}
      <motion.div
        id="mobile-menu"
        initial={false}
        animate={isMenuOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeOut" } },
          closed: { opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeIn" } }
        }}
        style={{ overflow: 'hidden' }}
        className="md:hidden absolute w-full bg-white dark:bg-gray-900 shadow-lg border-t border-slate-900/10 dark:border-slate-50/[0.06]"
      >
         {/* Solo mostrar contenido si no estamos chequeando */}
         { authState !== 'checking' && (
           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {authState === 'signedIn' ? privateLinks : publicLinks}
             {/* Separador y Acciones Móvil */}
             <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
               {/* Usamos userAttributes aquí también */}
               {authState === 'signedIn' ? (
                 <div className="px-2 space-y-3">
                    <div className="flex items-center px-1">
                      <UserCircleIcon className="h-8 w-8 mr-2 text-gray-500"/>
                      <span className="text-base font-medium">{userAttributes?.name || userAttributes?.email || currentUser?.username || 'Usuario'}</span>
                    </div>
                    <button onClick={() => { handleSignOut(); toggleMenu(); }} className="...">Cerrar Sesión</button>
                 </div>
               ) : ( // authState === 'signedOut'
                 <div className="px-2 space-y-2">
                   <button onClick={handleAuthRedirect} className="...">Iniciar Sesión</button>
                   <button onClick={handleAuthRedirect} className="...">Registrarse</button>
                 </div>
               )}
             </div>
           </div>
         )}
      </motion.div>
    </header>
  );
}

// --- Pegar aquí el código de publicLinks y privateLinks como antes ---
const publicLinks = (
  <>
    <ScrollLink to="hero" smooth={true} duration={500} offset={-80} /*onClick={isMenuOpen ? toggleMenu : undefined}*/ className="block hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer px-3 py-2 rounded-md text-base font-medium">
      Inicio
    </ScrollLink>
    <ScrollLink to="benefits" smooth={true} duration={500} offset={-80} /*onClick={isMenuOpen ? toggleMenu : undefined}*/ className="block hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer px-3 py-2 rounded-md text-base font-medium">
      Beneficios
    </ScrollLink>
    <ScrollLink to="plans" smooth={true} duration={500} offset={-80} /*onClick={isMenuOpen ? toggleMenu : undefined}*/ className="block hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer px-3 py-2 rounded-md text-base font-medium">
      Planes
    </ScrollLink>
    <ScrollLink to="faq" smooth={true} duration={500} offset={-80} /*onClick={isMenuOpen ? toggleMenu : undefined}*/ className="block hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer px-3 py-2 rounded-md text-base font-medium">
      Preguntas
    </ScrollLink>
  </>
);

const privateLinks = (
  <>
    <RouterLink to="/dashboard" /*onClick={isMenuOpen ? toggleMenu : undefined}*/ className="block hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer px-3 py-2 rounded-md text-base font-medium">
      Dashboard
    </RouterLink>
    <RouterLink to="/restaurantconfig" /*onClick={isMenuOpen ? toggleMenu : undefined}*/ className="block hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer px-3 py-2 rounded-md text-base font-medium">
      Configuración
    </RouterLink>
  </>
);
// --- Fin Menús ---