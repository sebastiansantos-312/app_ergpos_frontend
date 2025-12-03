import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface UserInfo {
    nombre: string;
    email: string;
    codigo: string;
    rol: string;
    activo: boolean;
}

interface PerfilInfoCardProps {
    user: UserInfo;
}

export const PerfilInfoCard: React.FC<PerfilInfoCardProps> = ({ user }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                    <CardTitle className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>Información Personal</span>
                    </CardTitle>
                    <CardDescription>Detalles de tu cuenta</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Nombre</label>
                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium">
                            {user.nombre}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium">
                            {user.email}
                        </div>
                    </div>

                    {/* Código */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Código de Usuario</label>
                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium">
                            {user.codigo}
                        </div>
                    </div>

                    {/* Rol */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Rol</label>
                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium">
                            {user.rol}
                        </div>
                    </div>

                    {/* Estado */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Estado</label>
                        <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${user.activo ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-gray-900 font-medium">
                                {user.activo ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
