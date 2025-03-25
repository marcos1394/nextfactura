import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import PlanSelection from './pages/PlanSelection';
import SuperAdminPanel from './components/SuperAdminPanel';
import LoginPage from './pages/LoginPage';
import RestaurantSetup from './pages/RestaurantSetup';
import PaymentGateway from './pages/PaymentGateway';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import PaymentPending from './pages/PaymentPending';
import Dashboard from './pages/DashboardPage';
import TicketSearch from './pages/TicketPage';
import ProtectedRoute from './pages/ProtectedRoute';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';
import EnableTwoFactorPage from './pages/EnableTwoFactor';
import { ThemeProvider } from './context/ThemeContext';

/**
 * Detecta el subdominio actual, asumiendo que tu dominio principal
 * es algo como "nextfactura.com.mx". Si la longitud es mayor a 2 o 3,
 * obtenemos la primera parte como "subdomain".
 */
function getSubdomain() {
  const host = window.location.host; 
  // Ej: "rest1.nextfactura.com.mx" -> ["rest1", "nextfactura", "com", "mx"]
  //     "www.nextfactura.com.mx"   -> ["www", "nextfactura", "com", "mx"]
  const parts = host.split('.');
  
  // Si tu dominio base es "nextfactura.com.mx" => parts.length = 3 en caso normal
  // (podría ser 4 si hay "www")
  
  // Caso 1: "rest1.nextfactura.com.mx" => length 4 => subdomain = parts[0] = "rest1"
  // Caso 2: "www.nextfactura.com.mx"   => length 4 => subdomain = "www"
  // Caso 3: "nextfactura.com.mx"       => length 3 => subdomain = null (significa root domain)
  if (parts.length >= 3) {
    // Tomamos la primera parte como subdominio real
    return parts[0]; 
  }
  return null;
}

function App() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  // Detectar si estamos en "restX.nextfactura.com.mx" (subdominio)
  const subdomain = getSubdomain();

  /**
   * Si el "subdomain" NO es null, ni "nextfactura", ni "www",
   * asumimos que es un "mini-site" de restaurante.
   * 
   * => Renderizamos sólo TicketSearch (o un "Home minimal").
   * => Si quisieras algo más elaborado, podrías 
   *    renderizar otra ruta, un layout distinto, etc.
   */
  if (subdomain && subdomain !== 'www' && subdomain !== 'nextfactura') {
    // Aquí va tu "mini-sitio" para el restaurante
    // Podrías inyectar un "RestaurantHome" con sus colores, etc.
    // En este ejemplo, solo TicketSearch:
    return (
      <ThemeProvider>
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
          {/* Si quieres un header minimal, puedes ponerlo, 
              o comentar la importación. */}
          <TicketSearch />
        </div>
      </ThemeProvider>
    );
  }

  /**
   * De lo contrario, estamos en el dominio principal 
   * ( nextfactura.com.mx ) o "www.nextfactura.com.mx". 
   * => Renderizamos la SPA con todas las rutas definidas.
   */
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
          <Header />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/ticketsearch" element={<TicketSearch />} />

              {/* Rutas protegidas para activar 2FA y otras configuraciones seguras */}
              <Route
                path="/enable-2fa"
                element={
                  <ProtectedRoute
                    element={EnableTwoFactorPage}
                    allowedRoles={['user', 'admin', 'superadmin']}
                  />
                }
              />

              {/* Rutas para seleccionar planes y pagos */}
              <Route path="/plans" element={<PlanSelection />} />
              <Route path="/payment" element={<PaymentGateway />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-failure" element={<PaymentFailure />} />
              <Route path="/payment-pending" element={<PaymentPending />} />

                {/* Rutas para el admin */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/restaurantconfig" element={<RestaurantSetup />} />

              {/* Rutas para el superadmin */}
              <Route
                path="/admindashboard"
                element={
                  <ProtectedRoute
                    element={SuperAdminPanel}
                    allowedRoles={['superadmin']}
                  />
                }
              />
              <Route
                path="/adminusers"
                element={
                  <ProtectedRoute
                    element={SuperAdminPanel}
                    allowedRoles={['superadmin']}
                  />
                }
              />
              <Route
                path="/adminplans"
                element={
                  <ProtectedRoute
                    element={SuperAdminPanel}
                    allowedRoles={['superadmin']}
                  />
                }
              />
              <Route
                path="/adminpayments"
                element={
                  <ProtectedRoute
                    element={SuperAdminPanel}
                    allowedRoles={['superadmin']}
                  />
                }
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
