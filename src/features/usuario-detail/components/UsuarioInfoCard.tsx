import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UsuarioInfoCardProps {
    usuario: {
        nombre: string;
        email: string;
        codigo?: string;
        rol: string;
        activo: boolean;
    };
}

export const UsuarioInfoCard: React.FC<UsuarioInfoCardProps> = ({ usuario }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Información del Usuario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-600 font-medium">Nombre</p>
                        <p className="text-gray-900">{usuario.nombre}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 font-medium">Email</p>
                        <p className="text-gray-900">{usuario.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 font-medium">Código</p>
                        <p className="text-gray-900 font-mono">{usuario.codigo || '-'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 font-medium">Rol</p>
                        <p className="text-gray-900">{usuario.rol}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 font-medium">Estado</p>
                        <p className={`font-medium ${usuario.activo ? 'text-green-600' : 'text-red-600'}`}>
                            {usuario.activo ? 'Activo' : 'Inactivo'}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
