// components/PublicRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface PublicRouteProps {
    children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isLoading = useAuthStore((state) => state.isLoading);

    // Mostrar loading mientras verifica autenticación
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                </div>
            </div>
        );
    }

    // Si está autenticado, redirigir al dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    // Si no está autenticado, mostrar el contenido (login)
    return <>{children}</>;
};