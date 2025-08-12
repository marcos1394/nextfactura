import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './context/AuthContext'; // Importamos nuestro hook de autenticación

// Tus componentes
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage'; // <-- Necesitarás crear esta página
import Dashboard from './pages/DashboardPage';
import PlanSelection from './pages/PlanSelection';
import RestaurantSetup from './pages/RestaurantSetup';
import SuperAdminPanel from './components/SuperAdminPanel';
// ...importa tus otras páginas

import ProtectedRoute from './pages/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
    const { isAuthenticated } = useAuth();

    return (
        <ThemeProvider>
            <Router>
                <Header />
                <div className="flex-grow container mx-auto px-4 py-8">
                    <Routes>
                        {/* --- Rutas Públicas --- */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
                        
                        {/* --- Rutas Protegidas --- */}
                        <Route element={<ProtectedRoute />}>
                            {/* Todas las rutas aquí dentro requerirán que el usuario esté logueado */}
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/plans" element={<PlanSelection />} />
                            <Route path="/restaurantconfig" element={<RestaurantSetup />} />
                            {/* ...agrega tus otras rutas protegidas aquí */}
                        </Route>

                         {/* Ruta para SuperAdmin (requiere lógica de roles en ProtectedRoute) */}
                        <Route element={<ProtectedRoute allowedRoles={['SuperAdmins']} />}>
                            <Route path="/admindashboard" element={<SuperAdminPanel />} />
                        </Route>

                        {/* Fallback para cualquier otra ruta */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
                <Footer />
            </Router>
            <ToastContainer position="bottom-right" />
        </ThemeProvider>
    );
}

export default App;
