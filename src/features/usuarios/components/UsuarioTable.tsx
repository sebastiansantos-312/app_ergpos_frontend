import React from 'react';
import { DataTable } from '@/components/DataTable';
import { Mail, Power, PowerOff, Shield, Edit2 } from 'lucide-react';
import type { UsuarioResponse } from '@/types/usuario';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UsuarioTableProps {
    usuarios: UsuarioResponse[];
    isLoading: boolean;
    currentUser: any; // Using any for now to match store type, ideally should be UsuarioResponse
    onEdit: (usuario: UsuarioResponse) => void;
    onActivate: (usuario: UsuarioResponse) => void;
    onDeactivate: (usuario: UsuarioResponse) => void;
}

export const UsuarioTable: React.FC<UsuarioTableProps> = ({
    usuarios,
    isLoading,
    currentUser,
    onEdit,
    onActivate,
    onDeactivate,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Lista de Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
                <DataTable<UsuarioResponse>
                    columns={[
                        {
                            header: 'Nombre',
                            accessor: 'nombre',
                            width: 'w-32',
                        },
                        {
                            header: 'Email',
                            accessor: 'email',
                            width: 'w-40',
                            cell: (value) => (
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    {value}
                                </div>
                            ),
                        },
                        {
                            header: 'Código',
                            accessor: 'codigo',
                            cell: (value) => (
                                <span className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                                    {value}
                                </span>
                            ),
                        },
                        {
                            header: 'Rol',
                            accessor: 'rol',
                            cell: (value) => (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                                    {value}
                                </span>
                            ),
                        },
                        {
                            header: 'Estado',
                            accessor: 'activo',
                            cell: (value) => (
                                <span className={`px-2 py-1 rounded text-sm font-medium ${value
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {value ? 'Activo' : 'Inactivo'}
                                </span>
                            ),
                        },
                    ]}
                    data={usuarios}
                    isLoading={isLoading}
                    hasActions={true}
                    renderActions={(usuario) => {
                        const isCurrentUser = currentUser && usuario.email === currentUser.email;

                        return (
                            <div className="flex gap-2">
                                {/* Botón Editar */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(usuario)}
                                    className="p-1 text-blue-600 hover:text-blue-700"
                                    title="Editar usuario"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </Button>

                                {/* Botón Activar - Si está inactivo */}
                                {!usuario.activo && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onActivate(usuario)}
                                        className="p-1 text-green-600 hover:text-green-700"
                                        title="Activar usuario"
                                    >
                                        <Power className="w-4 h-4" />
                                    </Button>
                                )}

                                {/* Botón Desactivar - Si está activo Y NO es el usuario actual */}
                                {usuario.activo && !isCurrentUser && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDeactivate(usuario)}
                                        className="p-1 text-orange-600 hover:text-orange-700"
                                        title="Desactivar usuario"
                                    >
                                        <PowerOff className="w-4 h-4" />
                                    </Button>
                                )}

                                {/* Indicador para usuario actual */}
                                {isCurrentUser && (
                                    <div className="flex items-center gap-1 text-xs text-blue-600 px-2 py-1 bg-blue-50 rounded">
                                        <Shield className="w-3 h-3" />
                                        <span>Tú</span>
                                    </div>
                                )}
                            </div>
                        );
                    }}
                    emptyMessage="No hay usuarios disponibles"
                />
            </CardContent>
        </Card>
    );
};
