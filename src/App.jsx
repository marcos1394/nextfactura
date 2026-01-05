import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// --- Contextos y Hooks ---
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';

// --- Layout y UI Global ---
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute'; // Ruta corregida
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Lazy Loading (Mejora de Rendimiento Mundial) ---
// Importamos las páginas dinámicamente para que la app cargue rápido
const HomePage = lazy(() => import('./pages/Public/HomePage'));
const ContactPage = lazy(() => import('./pages/Public/ContactPage')); // Asumo que existe
const NotFoundPage = lazy(() => import('./pages/Public/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('./pages/Public/UnauthorizedPage')); // Nota: Mueve este archivo a Public si no lo hiciste

// Auth Pages
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/Auth/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('./pages/Auth/ResetPassword'));
const EnableTwoFactorPage = lazy(() => import('./pages/Auth/EnableTwoFactor'));
const AuthRedirector = lazy(() => import('./pages/Auth/AuthRedirector'));

// Dashboard & User Pages
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage'));
const UserProfile = lazy(() => import('./pages/Dashboard/UserProfile'));
const RestaurantSetup = lazy(() => import('./pages/Dashboard/RestaurantSetup'));
const TicketSearch = lazy(() => import('./pages/Dashboard/TicketPage'));

// Payment Pages
const PlanSelection = lazy(() => import('./pages/Payment/PlanSelection'));
const PaymentGateway = lazy(() => import('./pages/Payment/PaymentGateway'));
const PaymentSuccess = lazy(() => import('./pages/Payment/PaymentSuccess'));
const PaymentFailure = lazy(() => import('./pages/Payment/PaymentFailure'));
const PaymentPending = lazy(() => import('./pages/Payment/PaymentPending'));

// Admin Features
const SuperAdminPanel = lazy(() => import('./features/admin/components/SuperAdminPanel'));

// --- Componente de Carga (Loading Spinner) ---
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// --- Layout Principal ---
const AppLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <Header />
    <main className="flex-grow container mx-auto px-4 py-6">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider>
      <Router>
        <AppLayout>
          {/* Suspense atrapa la carga perezosa de los componentes */}
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* --- RUTAS PÚBLICAS --- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/ticketsearch" element={<TicketSearch />} />
              
              {/* --- AUTH (Solo invitados) --- */}
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

              {/* --- RUTAS PROTEGIDAS (Usuarios Logueados) --- */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/auth-redirect" element={<AuthRedirector />} />
                
                {/* Perfil y Configuración */}
                <Route path="/my-account" element={<UserProfile />} />
                <Route path="/restaurant-config" element={<RestaurantSetup />} />
                <Route path="/enable-2fa" element={<EnableTwoFactorPage />} />

                {/* Pagos y Planes */}
                <Route path="/plans" element={<PlanSelection />} />
                <Route path="/payment" element={<PaymentGateway />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-failure" element={<PaymentFailure />} />
                <Route path="/payment-pending" element={<PaymentPending />} />
                
                {/* --- SUPER ADMIN (Role Based) --- */}
                <Route element={<ProtectedRoute allowedRoles={['SuperAdmins']} />}>
                  <Route path="/admin/*" element={<SuperAdminPanel />} />
                </Route>
              </Route>
              
              {/* --- ERRORES --- */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AppLayout>

        {/* Notificaciones Globales */}
        <ToastContainer 
          position="bottom-right" 
          autoClose={4000}
          theme="colored"
          newestOnTop
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;