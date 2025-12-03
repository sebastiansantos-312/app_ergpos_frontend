import React from 'react';
import { DataTable } from '@/components/DataTable';
import { DollarSign, Box } from 'lucide-react';
import type { ProductoResponse } from '@/types/producto';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';

interface ProductoTableProps {
    productos: ProductoResponse[];
    isLoading: boolean;
    onEdit: (producto: ProductoResponse) => void;
    onActivate: (producto: ProductoResponse) => void;
    onDeactivate: (producto: ProductoResponse) => void;
}

export const ProductoTable: React.FC<ProductoTableProps> = ({
    productos,
    isLoading,
    onEdit,
    onActivate,
    onDeactivate,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Lista de Productos
                </CardTitle>
            </CardHeader>
            <CardContent>
                <DataTable<ProductoResponse>
                    columns={[
                        {
                            header: 'Código',
                            accessor: 'codigo',
                            width: 'w-24',
                            cell: (value) => (
                                <span className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                                    {value}
                                </span>
                            ),
                        },
                        {
                            header: 'Nombre',
                            accessor: 'nombre',
                            width: 'w-40',
                        },
                        {
                            header: 'Categoría',
                            accessor: 'categoriaNombre',
                            cell: (value) => value ? (
                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                                    {value}
                                </span>
                            ) : <span className="text-gray-400">Sin categoría</span>,
                        },
                        {
                            header: 'Precio',
                            accessor: 'precio',
                            cell: (value) => (
                                <div className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    {Number(value).toFixed(2)}
                                </div>
                            ),
                        },
                        {
                            header: 'Stock',
                            accessor: 'stockActual',
                            cell: (value, row: any) => (
                                <div className="flex items-center gap-2">
                                    <Box className="w-4 h-4" />
                                    <span className={value <= row.stockMinimo ? 'text-red-600 font-bold' : 'text-green-600'}>
                                        {value}
                                        {value <= row.stockMinimo && (
                                            <span className="ml-1 text-xs text-red-500">(bajo)</span>
                                        )}
                                    </span>
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
                    ]}
                    data={productos}
                    isLoading={isLoading}
                    onEdit={onEdit}
                    onActivate={onActivate}
                    onDeactivate={onDeactivate}
                    hasActions={true}
                    emptyMessage="No hay productos disponibles"
                />
            </CardContent>
        </Card>
    );
};
