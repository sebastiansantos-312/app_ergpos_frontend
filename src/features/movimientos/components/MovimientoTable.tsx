import React from 'react';
import { DataTable } from '@/components/DataTable';
import { ArrowDown, ArrowUp, CheckCircle, XCircle, ArrowRightLeft } from 'lucide-react';
import type { MovimientoInventarioResponse } from '@/types/movimiento';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MovimientoTableProps {
    movimientos: MovimientoInventarioResponse[];
    isLoading: boolean;
    onActivar: (movimiento: MovimientoInventarioResponse) => void;
    onAnular: (movimiento: MovimientoInventarioResponse) => void;
}

export const MovimientoTable: React.FC<MovimientoTableProps> = ({
    movimientos,
    isLoading,
    onActivar,
    onAnular,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5" />
                    Lista de Movimientos
                </CardTitle>
            </CardHeader>
            <CardContent>
                <DataTable<MovimientoInventarioResponse>
                    columns={[
                        {
                            header: 'Fecha',
                            accessor: 'fecha',
                            width: 'w-28',
                            cell: (value) => new Date(value).toLocaleDateString('es-ES'),
                        },
                        {
                            header: 'Tipo',
                            accessor: 'tipo',
                            width: 'w-20',
                            cell: (value) => (
                                <div className={`flex items-center gap-2 px-2 py-1 rounded w-fit font-medium ${value === 'ENTRADA'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {value === 'ENTRADA' ? (
                                        <>
                                            <ArrowDown className="w-4 h-4" />
                                            Entrada
                                        </>
                                    ) : (
                                        <>
                                            <ArrowUp className="w-4 h-4" />
                                            Salida
                                        </>
                                    )}
                                </div>
                            ),
                        },
                        {
                            header: 'Producto',
                            accessor: 'nombreProducto',
                            width: 'w-40',
                        },
                        {
                            header: 'Cantidad',
                            accessor: 'cantidad',
                            cell: (value) => <span className="font-bold">{value}</span>,
                        },
                        {
                            header: 'Usuario',
                            accessor: 'usuarioNombre',
                            width: 'w-32',
                        },
                        {
                            header: 'Estado',
                            accessor: 'estado',
                            cell: (value) => (
                                <span className={`px-2 py-1 rounded text-sm font-medium ${value === 'ACTIVO'
                                    ? 'bg-green-100 text-green-800'
                                    : value === 'PENDIENTE'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {value}
                                </span>
                            ),
                        },
                    ]}
                    data={movimientos}
                    isLoading={isLoading}
                    hasActions={true}
                    renderActions={(mov) => (
                        <div className="flex gap-2">
                            {/* Botón Activar - Solo para PENDIENTES */}
                            {mov.estado === 'PENDIENTE' && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onActivar(mov)}
                                    className="p-1 text-green-600 hover:text-green-700"
                                    title="Activar movimiento"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                </Button>
                            )}

                            {/* Botón Anular - Solo para ACTIVOS */}
                            {mov.estado === 'ACTIVO' && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onAnular(mov)}
                                    className="p-1 text-red-600 hover:text-red-700"
                                    title="Anular movimiento"
                                >
                                    <XCircle className="w-4 h-4" />
                                </Button>
                            )}

                            {/* Sin acciones para ANULADOS */}
                            {mov.estado === 'ANULADO' && (
                                <span className="text-xs text-gray-400 px-2">Sin acciones</span>
                            )}
                        </div>
                    )}
                    emptyMessage="No hay movimientos disponibles"
                />
            </CardContent>
        </Card>
    );
};
