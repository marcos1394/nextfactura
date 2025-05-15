// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';

// Tus componentes actuales
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PlanSelection from './pages/PlanSelection';
import SuperAdminPanel from './components/SuperAdminPanel';
import RestaurantSetup from './pages/RestaurantSetup';
import PaymentGateway from './pages/PaymentGateway';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import PaymentPending from './pages/PaymentPending';
import Dashboard from './pages/DashboardPage';
import TicketSearch from './pages/TicketPage';
import ProtectedRoute from './pages/ProtectedRoute';
import EnableTwoFactorPage from './pages/EnableTwoFactor';
import { ThemeProvider } from './context/ThemeContext';

// --- Importaciones de Amplify ---
import { Amplify, Hub } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Authenticator, useAuthenticator, translations } from '@aws-amplify/ui-react';
import { I18n } from 'aws-amplify/utils';
import '@aws-amplify/ui-react/styles.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// --- Fin Importaciones Amplify ---

// Configurar traducciones
I18n.putVocabularies(translations);
I18n.setLanguage('es');

// Función getSubdomain
function getSubdomain() {
 const host = window.location.host;
 const parts = host.split('.');
 if (parts.length > 3 && parts[0] !== 'www') {
    return parts[0];
 }
 return null;
}

// --- Componente Auxiliar para Redirección Post-Login CON LOGS ---
function HandleAuthRedirect() {
  const { user, route } = useAuthenticator((context) => [context.user, context.route]);
  const navigate = useNavigate();
  const [statusChecked, setStatusChecked] = useState(false);

  useEffect(() => {
    if (user && route === 'authenticated' && !statusChecked) {
      // <-- LOG AÑADIDO -->
      console.log("[HandleAuthRedirect] Iniciando chequeo de estado - Usuario autenticado detectado.");
      const checkStatusAndRedirect = async () => {
        let idToken;
        try {
          // <-- LOG AÑADIDO -->
          console.log("[HandleAuthRedirect] Obteniendo sesión de Cognito...");
          const session = await fetchAuthSession();
          idToken = session.tokens?.idToken?.toString();
          const groups = session.tokens?.idToken?.payload['cognito:groups'] || [];

          if (!idToken) {
             console.error("[HandleAuthRedirect] No se pudo obtener ID Token.");
             toast.error("Error interno al obtener sesión (token).");
             setStatusChecked(true);
             navigate('/', { replace: true });
             return;
          }
          // <-- LOG AÑADIDO (cuidado al loguear tokens en producción real) -->
          console.log("[HandleAuthRedirect] Token ID obtenido (primeros/últimos chars):", idToken.substring(0, 10) + "..." + idToken.substring(idToken.length - 10));
          console.log("[HandleAuthRedirect] Grupos del usuario:", groups);

          // <-- LOG AÑADIDO -->
          console.log("[HandleAuthRedirect] Llamando a /api/users/status...");
          const statusResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/status`, {
            headers: { Authorization: `Bearer ${idToken}` },
          });

          // <-- LOG AÑADIDO -->
          console.log("[HandleAuthRedirect] Respuesta de /status:", statusResponse.data);
          const { hasPlan, hasRestaurant } = statusResponse.data;
          setStatusChecked(true); // Marcar como chequeado DESPUÉS de la llamada exitosa

          // 3. Lógica de Redirección
          let destination = '/dashboard'; // Destino por defecto
          if (groups.includes('SuperAdmins')) {
            destination = '/admindashboard';
          } else if (!hasPlan) {
            destination = '/plans';
          } else if (hasPlan && !hasRestaurant) {
            destination = '/restaurantconfig';
          }
          // <-- LOG AÑADIDO -->
          console.log(`[HandleAuthRedirect] Redirigiendo a: ${destination}`);
          navigate(destination, { replace: true });

        } catch (error) {
          console.error("[HandleAuthRedirect] Error en checkStatusAndRedirect:", error.response?.data || error.message || error); // Log más detallado del error
          setStatusChecked(true); // Marcar como chequeado incluso si hay error
          toast.error(`Error al verificar el estado del usuario: ${error.message}`);
          // Decidir a dónde redirigir en caso de error al llamar a /status
          console.log("[HandleAuthRedirect] Error, redirigiendo a /dashboard como fallback.");
          navigate('/dashboard', { replace: true }); // Fallback a dashboard
        }
      };
      checkStatusAndRedirect();
    } else if (!user && statusChecked) {
      // Resetear si el usuario cierra sesión
      setStatusChecked(false);
    } else if (user && route === 'authenticated' && statusChecked) {
        // Ya autenticado y chequeado, no hacer nada más aquí para evitar re-render
        console.log("[HandleAuthRedirect] Estado ya verificado, no se redirige de nuevo.");
    }
  }, [user, route, navigate, statusChecked]); // Dependencias correctas

  // Mostrar mensaje de carga mientras el useEffect hace su trabajo
  if (user && route === 'authenticated' && !statusChecked) {
    return <div className="flex justify-center items-center pt-20">Verificando estado inicial...</div>;
  }

  // No renderizar nada visible una vez completado o si no aplica
  return null;
}
// --- Fin Componente Auxiliar ---


// --- Componente Wrapper que USA Authenticator para proteger rutas ---
function ProtectedAreaWrapper() {
    return (
        <Authenticator loginMechanisms={['email']} signUpAttributes={['name','custom:restaurantName','phone_number']} socialProviders={['google', 'facebook']} >
             {({ signOut, user }) => ( <Outlet context={{ user, signOut }} /> )}
        </Authenticator>
    );
}
// --- Fin Componente Wrapper ---


// --- Componente Principal App ---
function App() {
  const subdomain = getSubdomain();

  // Renderizado del Mini-sitio
  if (subdomain && subdomain !== 'www') {
     return ( <ThemeProvider><div className="..."><TicketSearch /><ToastContainer /></div></ThemeProvider> );
   }

  // Renderizado de la App Principal
  return (
    <ThemeProvider>
      <Router>
        <Header />
        <div className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* --- Rutas Públicas --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/ticketsearch" element={<TicketSearch />} />
            {/* <Route path="/confirm-signup" element={<ConfirmSignupPage />} /> */}

            {/* --- Área Protegida --- */}
            <Route element={<ProtectedAreaWrapper />}>
                {/* La ruta índice ahora renderiza HandleAuthRedirect */}
                <Route index element={<HandleAuthRedirect />} />
                {/* Las rutas específicas usan ProtectedRoute */}
                <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
                <Route path="/plans" element={<ProtectedRoute element={PlanSelection} />} />
                <Route path="/restaurantconfig" element={<ProtectedRoute element={RestaurantSetup} />} />
                <Route path="/enable-2fa" element={<ProtectedRoute element={EnableTwoFactorPage} /*allowedRoles={['user', 'admin', 'superadmin']}*/ />} /> {/* Ajustar roles */}
                <Route path="/payment" element={<ProtectedRoute element={PaymentGateway} />} />
                <Route path="/payment-success" element={<ProtectedRoute element={PaymentSuccess} />} />
                <Route path="/payment-failure" element={<ProtectedRoute element={PaymentFailure} />} />
                <Route path="/payment-pending" element={<ProtectedRoute element={PaymentPending} />} />
                 {/* Rutas SuperAdmin (Protegidas por Rol específico) */}
                 <Route element={<ProtectedRoute allowedRoles={['SuperAdmins']} />}>
                    <Route path="/admindashboard" element={<SuperAdminPanel />} />
                    <Route path="/adminusers" element={<SuperAdminPanel />} />
                    <Route path="/adminplans" element={<SuperAdminPanel />} />
                    <Route path="/adminpayments" element={<SuperAdminPanel />} />
                 </Route>
                 {/* Fallback dentro del área protegida (quizás mejor redirigir a index?) */}
                 {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
                 {/* Si la ruta index es HandleAuthRedirect, un fallback aquí podría ir a index */}
                 <Route path="*" element={<Navigate to="." replace />} />

            </Route>

             {/* Fallback general para rutas no encontradas */}
             <Route path="*" element={<Navigate to="/" replace />} />
             {/* O un componente <NotFoundPage /> */}
             {/* <Route path="*" element={<NotFoundPage />} /> */}

          </Routes>
        </div>
        <Footer />
      </Router>
      <ToastContainer position="bottom-right" autoClose={4000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored"/>
    </ThemeProvider>
  );
}

export default App;