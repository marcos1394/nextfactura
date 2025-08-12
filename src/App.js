// src/App.js

// --- Imports de React y Librerías ---
import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Navigate 
} from 'react-router-dom';

// --- Imports de Contextos y Hooks Personalizados ---
import { ThemeProvider } from './context/ThemeContext'; // Asumo que tienes este contexto
import { useAuth } from './hooks/useAuth'; // El hook que creamos para la autenticación

// --- Imports de Componentes de Layout y UI ---
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './pages/ProtectedRoute'; // El guardián de rutas

// --- Imports de Páginas ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Página para el endpoint /register
import ForgotPasswordPage from './pages/ForgotPassword'; // Página para /password/forgot
import ResetPasswordPage from './pages/ResetPassword'; // Página para /password/reset
import DashboardPage from './pages/Dashboard';
import PlanSelection from './pages/PlanSelection';
import RestaurantSetup from './pages/RestaurantSetup';
import SuperAdminPanel from './components/SuperAdminPanel';
import EnableTwoFactorPage from './pages/EnableTwoFactor';
import PaymentGateway from './pages/PaymentGateway';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import PaymentPending from './pages/PaymentPending';
import TicketSearch from './pages/TicketPage';
import UnauthorizedPage from './pages/UnauthorizedPage'; // Página para accesos no permitidos

// --- Imports de Notificaciones ---
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Componente de Layout para evitar repetir Header y Footer en cada página.
 * @param {{ children: React.ReactNode }} props
 */
const AppLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow container mx-auto px-4 py-8">
      {children}
    </main>
    <Footer />
  </div>
);

/**
 * Componente principal que orquesta toda la aplicación y sus rutas.
 */
function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <ThemeProvider>
      <Router>
        <AppLayout>
          <Routes>
            {/* --- RUTAS PÚBLICAS (Accesibles por todos) --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/ticketsearch" element={<TicketSearch />} />
            
            {/* --- RUTAS DE AUTENTICACIÓN (Para usuarios no logueados) --- */}
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
            />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* --- RUTAS PROTEGIDAS (Requieren inicio de sesión) --- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/plans" element={<PlanSelection />} />
              <Route path="/restaurantconfig" element={<RestaurantSetup />} />
              <Route path="/enable-2fa" element={<EnableTwoFactorPage />} />
              <Route path="/payment" element={<PaymentGateway />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-failure" element={<PaymentFailure />} />
              <Route path="/payment-pending" element={<PaymentPending />} />
            </Route>

            {/* --- RUTAS PROTEGIDAS POR ROL (Ej: solo SuperAdmins) --- */}
            <Route element={<ProtectedRoute allowedRoles={['SuperAdmins']} />}>
              <Route path="/admindashboard" element={<SuperAdminPanel />} />
              <Route path="/adminusers" element={<SuperAdminPanel />} />
              <Route path="/adminplans" element={<SuperAdminPanel />} />
              <Route path="/adminpayments" element={<SuperAdminPanel />} />
            </Route>
            
            {/* --- PÁGINAS DE ESTADO Y FALLBACKS --- */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </Router>
      <ToastContainer 
        position="bottom-right" 
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </ThemeProvider>
  );
}

export default App;
