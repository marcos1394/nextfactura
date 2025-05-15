// src/pages/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom'; // Añadido Outlet
import { useAuthenticator } from '@aws-amplify/ui-react'; // Importar el hook

/**
 * Componente de Ruta Protegida para Amplify/Cognito (Usa Hook).
 * Verifica si el usuario está autenticado y si pertenece a los roles permitidos.
 * Se puede usar para envolver un elemento de ruta o como layout para roles específicos.
 *
 * @param {string[]} [allowedRoles] - Array opcional con nombres de grupos de Cognito permitidos.
 * @param {React.ComponentType} [element] - Componente a renderizar si la ruta coincide directamente.
 * @param {React.ReactNode} [children] - Componentes hijos a renderizar (si se usa como wrapper <ProtectedRoute><ruta/></ProtectedRoute>).
 */
const ProtectedRoute = ({ element: Component, allowedRoles, children }) => {
  // Obtener estado de autenticación y usuario usando el hook
  // 'route' puede ser: authenticated, unauthenticated, configuring
  // 'user' es el objeto de usuario si está autenticado
  const { route, user } = useAuthenticator((context) => [context.route, context.user]);
  const location = useLocation();

  // Mientras Amplify/Authenticator está cargando/configurando
  if (route === 'configuring') {
    return <div>Cargando sesión...</div>; // O un componente Spinner/Loader
  }

  // 1. Verificar si el usuario está autenticado
  // Si la ruta ya no está configurando y NO está autenticada (no hay 'user')
  if (route !== 'authenticated' || !user) {
    // Authenticator debería haber manejado esto, pero por si acaso, redirigir.
    // Podríamos redirigir a '/' o a una ruta específica de login si tuviéramos una fuera del wrapper.
    console.log(`ProtectedRoute: Ruta no autenticada (${route}), redirigiendo a /`);
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 2. Verificar si se requieren roles específicos y si el usuario los tiene
  if (allowedRoles && allowedRoles.length > 0) {
    const userGroups = user.signInUserSession?.getIdToken()?.payload['cognito:groups'] || [];
    const isAuthorized = allowedRoles.some(allowedRole => userGroups.includes(allowedRole));

    if (!isAuthorized) {
      // No autorizado por rol, redirigir a dashboard principal (o página /unauthorized)
      console.log(`ProtectedRoute: Rol no autorizado. Grupos: [${userGroups.join(', ')}], Permitidos: [${allowedRoles.join(', ')}]. Redirigiendo a /dashboard`);
      return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }
  }

  // 3. Autenticado y autorizado (o no se requerían roles)
  // Si se pasó un componente 'element', renderízalo pasando 'user'.
  // Si se pasaron 'children', renderízalos (útil para wrappers de rol).
  // Si se usa como wrapper de rol con Outlet, simplemente renderiza Outlet.
  if (Component) {
      return <Component user={user} />; // Pasar user por si el componente lo necesita
  }
  // Permitir usarlo como <ProtectedRoute allowedRoles={['Role']}><Contenido/></ProtectedRoute>
  // O como <Route element={<ProtectedRoute allowedRoles={['Role']} element={Componente} />} />
  // O como layout para Outlet: <Route element={<ProtectedRoute allowedRoles={['Role']} />}> <Route path=.../> </Route>
  return children ? <>{children}</> : <Outlet context={{ user }} />; // Renderiza hijos o Outlet (con contexto de user)

};

export default ProtectedRoute;