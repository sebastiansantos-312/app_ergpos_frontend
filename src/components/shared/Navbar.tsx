// components/Navbar.tsx - ACTUALIZADO CON PRODUCTOS Y MOVIMIENTOS
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        { name: 'Usuarios', href: '/usuarios', icon: '👥' },
        { name: 'Productos', href: '/productos', icon: '📦' },
        { name: 'Movimientos', href: '/movimientos', icon: '🔄' },
        { name: 'Roles', href: '/roles', icon: '🔐' },
        { name: 'Mi Perfil', href: '/perfil', icon: '👤' },
    ];

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo y marca */}
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl">🚀</span>
                            <span className="ml-2 text-xl font-bold text-gray-800">ERP System</span>
                        </Link>
                    </div>

                    {/* Navegación desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.href)
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="mr-2">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* User menu real */}
                    <div className="hidden md:flex items-center">
                        <div className="ml-3 relative">
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-700">
                                    Hola, {user?.nombre || 'Usuario'}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Botón menú móvil */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            <span className="sr-only">Abrir menú</span>
                            <div className="w-6 h-6">
                                {isMenuOpen ? '✕' : '☰'}
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Menú móvil */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(item.href)
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="mr-2">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                        {/* Sección usuario en móvil */}
                        <div className="border-t pt-2 mt-2">
                            <div className="px-3 py-2 text-sm text-gray-700">
                                Hola, {user?.nombre || 'Usuario'}
                            </div>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMenuOpen(false);
                                }}
                                className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};