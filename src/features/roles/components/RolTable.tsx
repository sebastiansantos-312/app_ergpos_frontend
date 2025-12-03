import React from 'react';
import { DataTable } from '@/components/DataTable';
import { Shield } from 'lucide-react';
import type { RolResponse } from '@/types/rol';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface RolTableProps {
    roles: RolResponse[];
    isLoading: boolean;
    onEdit: (rol: RolResponse) => void;
    onActivate: (rol: RolResponse) => void;
    onDeactivate: (rol: RolResponse) => void;
}

export const RolTable: React.FC<RolTableProps> = ({
    roles,
    isLoading,
    onEdit,
    onActivate,
    onDeactivate,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Lista de Roles
                </CardTitle>
            </CardHeader>
            <CardContent>
                <DataTable<RolResponse>
                    columns={[
                        {
                            header: 'Nombre',
                            accessor: 'nombre',
                            width: 'w-40',
                            cell: (value) => (
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-blue-600" />
                                    <span className="font-medium">{value}</span>
                                </div>
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
                        {
                            header: 'Fecha Creación',
                            accessor: 'createdAt',
                            cell: (value) => new Date(value).toLocaleDateString('es-ES'),
                        },
                    ]}
                    data={roles}
                    isLoading={isLoading}
                    onEdit={onEdit}
                    onActivate={onActivate}
                    onDeactivate={onDeactivate}
                    hasActions={true}
                    emptyMessage="No hay roles disponibles"
                />
            </CardContent>
        </Card>
    );
};
