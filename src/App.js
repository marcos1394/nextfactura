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

function App() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

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

              {/* Rutas para el admin */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/restaurantconfig" element={<RestaurantSetup />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
