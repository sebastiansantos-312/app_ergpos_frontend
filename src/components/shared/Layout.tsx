// components/Layout.tsx
import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Navbar } from './Navbar';
interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, logout } = useAuthStore();

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <Navbar />
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                Sistema de Gestión
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">
                                Hola, {user?.nombre}
                            </span>
                            <button
                                onClick={logout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
};