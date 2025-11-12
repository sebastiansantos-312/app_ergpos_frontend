// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  children?: React.ReactNode; // Para el primer método de envoltura
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = localStorage.getItem('user');

  if (!user) {
    // Si no hay usuario en localStorage, redirige a la página de login
    return <Navigate to="/" replace />;
  }

  // Si hay un usuario, renderiza el componente hijo que se le pasa
  // O el <Outlet /> si se usa como ruta padre (layout)
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;