import React from 'react';
import { DataTable } from '@/components/DataTable';
import type { CategoriaResponse } from '@/types/categoria';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface CategoriaTableProps {
    categorias: CategoriaResponse[];
    isLoading: boolean;
    onEdit: (categoria: CategoriaResponse) => void;
    onActivate: (categoria: CategoriaResponse) => void;
    onDeactivate: (categoria: CategoriaResponse) => void;
}

export const CategoriaTable: React.FC<CategoriaTableProps> = ({
    categorias,
    isLoading,
    onEdit,
    onActivate,
    onDeactivate,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Lista de Categorías</CardTitle>
            </CardHeader>
            <CardContent>
                <DataTable<CategoriaResponse>
                    columns={[
                        {
                            header: 'Nombre',
                            accessor: 'nombre',
                            width: 'w-40',
                        },
                        {
                            header: 'Código',
                            accessor: 'codigo',
                            cell: (value) => value || '-',
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
                    data={categorias}
                    isLoading={isLoading}
                    onEdit={onEdit}
                    onActivate={onActivate}
                    onDeactivate={onDeactivate}
                    hasActions={true}
                    emptyMessage="No hay categorías disponibles"
                />
            </CardContent>
        </Card>
    );
};
