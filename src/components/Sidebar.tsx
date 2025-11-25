import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Users, Shield, Package, Tag, Truck, ArrowRightLeft, FileText, BookOpen } from 'lucide-react';
import type { UserInfo } from '../types/auth';

interface SidebarProps {
    user: UserInfo;
}

// Mapeo de módulos a información de navegación
const moduleConfig: Record<string, { title: string; icon: React.ReactNode; path: string }> = {
    dashboard: { title: 'Dashboard', icon: <BarChart3 className="w-5 h-5" />, path: '/dashboard' },
    usuarios: { title: 'Usuarios', icon: <Users className="w-5 h-5" />, path: '/usuarios' },
    roles: { title: 'Roles', icon: <Shield className="w-5 h-5" />, path: '/roles' },
    productos: { title: 'Productos', icon: <Package className="w-5 h-5" />, path: '/productos' },
    categorias: { title: 'Categorías', icon: <Tag className="w-5 h-5" />, path: '/categorias' },
    proveedores: { title: 'Proveedores', icon: <Truck className="w-5 h-5" />, path: '/proveedores' },
    movimientos: { title: 'Movimientos', icon: <ArrowRightLeft className="w-5 h-5" />, path: '/movimientos' },
    reportes: { title: 'Reportes', icon: <FileText className="w-5 h-5" />, path: '/reportes' },
    auditoria: { title: 'Auditoría', icon: <BookOpen className="w-5 h-5" />, path: '/auditoria' },
};

export const Sidebar: React.FC<SidebarProps> = ({ user }) => {
    const location = useLocation();

    // Filtrar módulos según lo que el usuario puede ver
    const visibleModules = user.modules
        .map(module => moduleConfig[module])
        .filter(Boolean);

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <aside className="w-64 bg-white shadow-lg flex flex-col overflow-hidden">
            {/* Logo Section */}
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-blue-600">ERGPOS</h1>
                <p className="text-sm text-gray-600">Sistema de Inventario</p>
            </div>

            {/* User Info Section */}
            <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                            {user.nombre.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{user.nombre}</p>
                        <p className="text-xs text-gray-600 truncate">{user.rol}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                    {visibleModules.map((module) => (
                        <li key={module.path}>
                            <Link
                                to={module.path}
                                className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${isActive(module.path)
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="flex-shrink-0">{module.icon}</span>
                                <span className="ml-3 font-medium">{module.title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer Section */}
            <div className="p-4 border-t text-center">
                <Link
                    to="/perfil"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    Mi Perfil
                </Link>
            </div>
        </aside>
    );
};