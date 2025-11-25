import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface PermissionGuardProps {
    children: React.ReactNode;
    requiredModules?: string[];
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
    children,
    requiredModules = []
}) => {
    const { user } = useAuthStore();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredModules.length > 0) {
        const hasPermission = requiredModules.some(module =>
            user.modules.includes(module)
        );

        if (!hasPermission) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold text-gray-800">Acceso Denegado</h1>
                        <p className="text-gray-600">No tienes permisos para acceder a esta página</p>
                        <a
                            href="/dashboard"
                            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Volver al Dashboard
                        </a>
                    </div>
                </div>
            );
        }
    }

    return <>{children}</>;
};