import React from 'react';
import { DataTable } from '@/components/DataTable';
import { Truck, Mail, Phone } from 'lucide-react';
import type { ProveedorResponse } from '@/types/proveedor';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ProveedorTableProps {
    proveedores: ProveedorResponse[];
    isLoading: boolean;
    onEdit: (proveedor: ProveedorResponse) => void;
    onActivate: (proveedor: ProveedorResponse) => void;
    onDeactivate: (proveedor: ProveedorResponse) => void;
}

export const ProveedorTable: React.FC<ProveedorTableProps> = ({
    proveedores,
    isLoading,
    onEdit,
    onActivate,
    onDeactivate,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Lista de Proveedores
                </CardTitle>
            </CardHeader>
            <CardContent>
                <DataTable<ProveedorResponse>
                    columns={[
                        {
                            header: 'Nombre',
                            accessor: 'nombre',
                            width: 'w-40',
                        },
                        {
                            header: 'RUC',
                            accessor: 'ruc',
                            cell: (value) => value ? (
                                <span className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                                    {value}
                                </span>
                            ) : '-',
                        },
                        {
                            header: 'Email',
                            accessor: 'email',
                            cell: (value) => value ? (
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    {value}
                                </div>
                            ) : '-',
                        },
                        {
                            header: 'Teléfono',
                            accessor: 'telefono',
                            cell: (value) => value ? (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    {value}
                                </div>
                            ) : '-',
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
                    data={proveedores}
                    isLoading={isLoading}
                    onEdit={onEdit}
                    onActivate={onActivate}
                    onDeactivate={onDeactivate}
                    hasActions={true}
                    emptyMessage="No hay proveedores disponibles"
                />
            </CardContent>
        </Card>
    );
};
