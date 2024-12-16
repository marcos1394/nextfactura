import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import PlanSelection from './PlanSelection';

const ProtectedRoute = ({ element: Component, allowedRoles }) => {
  const [hasPlan, setHasPlan] = useState(null);
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    const checkUserPlan = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/check-user-plan`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.hasPlan) {
          setHasPlan(true);
        } else {
          setHasPlan(false);
        }
      } catch (error) {
        console.error("Error checking user's plan:", error);
        setHasPlan(false);
      }
    };

    if (userRole === 'admin') {
      checkUserPlan(); // Los admins necesitan verificar si tienen un plan
    } else {
      setHasPlan(true); // Superadmin y user no necesitan plan
    }
  }, [token, userRole]);

  const isTokenExpired = (token) => {
    if (!token) return true;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  };

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  if (userRole === 'admin' && hasPlan === false) {
    return <Navigate to="/plans" />;
  }

  if (hasPlan === null && userRole === 'admin') {
    return <div>Cargando...</div>; // Mostrar un estado de carga mientras se verifica el plan
  }

  return <Component />;
};

export default ProtectedRoute;
