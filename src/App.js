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
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';

// --- Imports de Componentes de Layout y UI ---
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './pages/ProtectedRoute';
import AuthRedirector from './pages/AuthRedirector';

// --- Imports de Páginas ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';
import DashboardPage from './pages/DashboardPage';
import PlanSelection from './pages/PlanSelection';
import RestaurantSetup from './pages/RestaurantSetup';
import SuperAdminPanel from './components/SuperAdminPanel';
import EnableTwoFactorPage from './pages/EnableTwoFactor';
import PaymentGateway from './pages/PaymentGateway';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import PaymentPending from './pages/PaymentPending';
import TicketSearch from './pages/TicketPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

// --- Imports de Notificaciones ---
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componente de Layout para no repetir Header y Footer
const AppLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
    <Header />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

// Componente principal que orquesta toda la aplicación
function App() {
  const { isAuthenticated } = useAuth();
  console.log(`[App.js] Estado de autenticación: ${isAuthenticated}`);

  return (
    <ThemeProvider>
      <Router>
        <AppLayout>
          <Routes>
            {/* --- RUTAS PÚBLICAS (Accesibles por todos) --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/ticketsearch" element={<TicketSearch />} />
            
            {/* --- RUTAS DE AUTENTICACIÓN (Solo para usuarios no logueados) --- */}
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} 
            />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* --- RUTAS PROTEGIDAS (Requieren inicio de sesión) --- */}
            <Route element={<ProtectedRoute />}>
              <Route index element={<AuthRedirector />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="plans" element={<PlanSelection />} />
              <Route path="restaurantconfig" element={<RestaurantSetup />} />
              <Route path="enable-2fa" element={<EnableTwoFactorPage />} />
              <Route path="payment" element={<PaymentGateway />} />
              <Route path="payment-success" element={<PaymentSuccess />} />
              <Route path="payment-failure" element={<PaymentFailure />} />
              <Route path="payment-pending" element={<PaymentPending />} />
              
              {/* Rutas de SuperAdmin (protegidas por rol) */}
              <Route element={<ProtectedRoute allowedRoles={['SuperAdmins']} />}>
                <Route path="admindashboard" element={<SuperAdminPanel />} />
                <Route path="adminusers" element={<SuperAdminPanel />} />
                <Route path="adminplans" element={<SuperAdminPanel />} />
                <Route path="adminpayments" element={<SuperAdminPanel />} />
              </Route>
            </Route>
            
            {/* --- PÁGINAS DE ESTADO Y FALLBACKS --- */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppLayout>
      </Router>
      <ToastContainer 
        position="bottom-right" 
        autoClose={4000}
        theme="colored"
        newestOnTop
      />
    </ThemeProvider>
  );
}

export default App;