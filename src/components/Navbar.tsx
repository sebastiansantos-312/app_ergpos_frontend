import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { LogOut, Menu, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { UserInfo } from '@/types/auth';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface NavbarProps {
    user: UserInfo;
}

export const Navbar: React.FC<NavbarProps> = ({ user }) => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleProfile = () => {
        navigate('/perfil');
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex justify-between items-center px-6 py-4">
                {/* Left section */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                    <h2 className="text-lg font-semibold text-gray-800">
                        ERGPOS - Sistema de Gestión de Inventario
                    </h2>
                </div>

                {/* Right section */}
                <div className="flex items-center space-x-4">
                    {/* User Info */}
                    <div className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-gray-800">{user.nombre}</p>
                            <p className="text-xs text-gray-600">{user.rol}</p>
                        </div>
                    </div>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                                <span className="font-bold">
                                    {user.nombre.charAt(0).toUpperCase()}
                                </span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <div className="px-4 py-2">
                                <p className="text-sm font-medium text-gray-800">{user.nombre}</p>
                                <p className="text-xs text-gray-600">{user.email}</p>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleProfile}
                                className="cursor-pointer flex items-center space-x-2"
                            >
                                <User className="w-4 h-4" />
                                <span>Mi Perfil</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="cursor-pointer flex items-center space-x-2 text-red-600 focus:text-red-600"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Cerrar Sesión</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};