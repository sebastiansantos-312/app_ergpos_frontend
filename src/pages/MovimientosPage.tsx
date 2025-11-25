import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../components/AppLayout';
import { useMovimientoStore } from '../stores/movimientoStore';
import { useProductoStore } from '../stores/productoStore';
import { useUsuarioStore } from '../stores/usuarioStore';
import { useProveedorStore } from '../stores/proveedorStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { DataTable } from '../components/DataTable';

import {
    Dialog, DialogFooter,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';
import { movimientoSchema, type MovimientoFormData } from '../schema';
import { toast } from 'react-toastify';
import { Plus, Search, ArrowRightLeft, ArrowDown, ArrowUp, AlertCircle } from 'lucide-react';
import type { MovimientoInventarioResponse } from '../types/movimiento';
import { CheckCircle, XCircle } from 'lucide-react';

export const MovimientosPage: React.FC = () => {
    const {
        movimientos,
        isLoading,
        cargarMovimientos,
        crearMovimiento,
        anularMovimiento,
        activarMovimiento,
    } = useMovimientoStore();

    const { productos, cargarProductos } = useProductoStore();
    const { usuarios, cargarUsuarios } = useUsuarioStore();
    const { proveedores, cargarProveedores } = useProveedorStore();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTipo, setFilterTipo] = useState<string | undefined>(undefined);
    const [filterEstado, setFilterEstado] = useState<string | undefined>(undefined);
    const [movimientoParaAnular, setMovimientoParaAnular] = useState<MovimientoInventarioResponse | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<MovimientoFormData>({
        resolver: zodResolver(movimientoSchema),
        defaultValues: {
            tipo: 'ENTRADA',
            estado: 'ACTIVO',
            costoUnitario: 0,
            cantidad: 1,
        }
    });

    const tipo = watch('tipo');
    const codigoProducto = watch('codigoProducto');
    const estado = watch('estado');
    const codigoUsuario = watch('codigoUsuario');
    const rucProveedor = watch('rucProveedor');

    // Cargar datos al montar
    useEffect(() => {
        cargarMovimientos();
        cargarProductos({ activo: true });
        cargarUsuarios({ activo: true });
        cargarProveedores({ activo: true });
    }, []);

    // Obtener producto seleccionado
    const productoSeleccionado = productos.find(p => p.codigo === codigoProducto);

    // Filtrar movimientos
    const filteredMovimientos = movimientos.filter((mov) => {
        const matchesSearch =
            searchTerm === '' ||
            mov.codigoProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mov.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mov.usuarioNombre.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTipo =
            filterTipo === undefined ||
            mov.tipo === filterTipo;

        const matchesEstado =
            filterEstado === undefined ||
            mov.estado === filterEstado;

        return matchesSearch && matchesTipo && matchesEstado;
    });

    // Submit crear movimiento
    const onSubmit = async (formData: MovimientoFormData) => {
        // Validar stock para salidas
        if (formData.tipo === 'SALIDA' && formData.estado !== 'PENDIENTE') {
            const producto = productos.find(p => p.codigo === formData.codigoProducto);
            if (producto && producto.stockActual < formData.cantidad) {
                toast.error(`Stock insuficiente. Disponible: ${producto.stockActual}, Solicitado: ${formData.cantidad}`);
                return;
            }
        }

        try {
            // Crear objeto con valores por defecto
            const data: MovimientoFormData = {
                ...formData,
                estado: formData.estado || 'ACTIVO',
                costoUnitario: formData.costoUnitario || 0,
            };

            await crearMovimiento(data);
            toast.success('Movimiento creado correctamente');
            reset();
            setIsCreateDialogOpen(false);
            await cargarMovimientos();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al crear el movimiento';
            toast.error(message);
        }
    };

    // Anular movimiento
    const handleAnular = async (movimiento: MovimientoInventarioResponse) => {
        setMovimientoParaAnular(movimiento);
        setShowConfirmDialog(true);
    };

    const confirmAnular = async () => {
        if (!movimientoParaAnular) return;

        try {
            await anularMovimiento(movimientoParaAnular.id);
            toast.success('Movimiento anulado');
            await cargarMovimientos();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al anular');
        } finally {
            setShowConfirmDialog(false);
            setMovimientoParaAnular(null);
        }
    };

    // Activar movimiento
    const handleActivar = async (movimiento: MovimientoInventarioResponse) => {
        try {
            await activarMovimiento(movimiento.id);
            toast.success('Movimiento activado');
            await cargarMovimientos();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al activar');
        }
    };

    const handleCloseDialog = () => {
        setIsCreateDialogOpen(false);
        reset();
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Movimientos de Inventario</h1>
                        <p className="text-gray-600 mt-1">
                            Total: <span className="font-semibold">{filteredMovimientos.length}</span> movimientos
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            reset();
                            setIsCreateDialogOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo Movimiento
                    </Button>
                </div>

                {/* Filtros */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {/* Primera fila */}
                            <div className="flex gap-4 flex-col md:flex-row">
                                {/* Búsqueda */}
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Buscar por producto o usuario..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Filtro de tipo */}
                                <select
                                    value={filterTipo || ''}
                                    onChange={(e) => setFilterTipo(e.target.value === '' ? undefined : e.target.value)}
                                    className="px-4 py-2 border rounded-lg bg-white text-gray-700 font-medium"
                                >
                                    <option value="">Todos los tipos</option>
                                    <option value="ENTRADA">Entrada</option>
                                    <option value="SALIDA">Salida</option>
                                </select>

                                {/* Filtro de estado */}
                                <select
                                    value={filterEstado || ''}
                                    onChange={(e) => setFilterEstado(e.target.value === '' ? undefined : e.target.value)}
                                    className="px-4 py-2 border rounded-lg bg-white text-gray-700 font-medium"
                                >
                                    <option value="">Todos los estados</option>
                                    <option value="ACTIVO">Activo</option>
                                    <option value="PENDIENTE">Pendiente</option>
                                    <option value="ANULADO">Anulado</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabla */}
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
                            data={filteredMovimientos}
                            isLoading={isLoading}
                            hasActions={true}
                            renderActions={(mov) => (
                                <div className="flex gap-2">
                                    {/* Botón Activar - Solo para PENDIENTES */}
                                    {mov.estado === 'PENDIENTE' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleActivar(mov)}
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
                                            onClick={() => handleAnular(mov)}
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
            </div>

            {/* Diálogo Crear */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ArrowRightLeft className="w-5 h-5" />
                            Nuevo Movimiento
                        </DialogTitle>
                        <DialogDescription>
                            Registra un movimiento de entrada o salida de productos
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Tipo */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tipo de Movimiento *</label>
                            <Select
                                value={tipo}
                                onValueChange={(value: 'ENTRADA' | 'SALIDA') => setValue('tipo', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ENTRADA">Entrada</SelectItem>
                                    <SelectItem value="SALIDA">Salida</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.tipo && (
                                <p className="text-sm text-red-500">{errors.tipo.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Producto */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Producto *</label>
                                <Select
                                    value={codigoProducto}
                                    onValueChange={(value) => setValue('codigoProducto', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona producto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {productos.map((prod) => (
                                            <SelectItem key={prod.id} value={prod.codigo}>
                                                {prod.nombre} ({prod.codigo})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.codigoProducto && (
                                    <p className="text-sm text-red-500">{errors.codigoProducto.message}</p>
                                )}
                            </div>

                            {/* Cantidad */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cantidad *</label>
                                <Input
                                    {...register('cantidad', { valueAsNumber: true })}
                                    type="number"
                                    min="1"
                                    placeholder="0"
                                    disabled={isSubmitting}
                                />
                                {errors.cantidad && (
                                    <p className="text-sm text-red-500">{errors.cantidad.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Alerta si stock insuficiente */}
                        {tipo === 'SALIDA' && productoSeleccionado && (
                            <div className={`p-3 rounded flex items-start gap-2 ${productoSeleccionado.stockActual < 10
                                ? 'bg-yellow-50 border border-yellow-200'
                                : 'bg-blue-50 border border-blue-200'
                                }`}>
                                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-600" />
                                <div className="text-sm">
                                    <p className="font-medium">Stock actual: <span className="font-bold">{productoSeleccionado.stockActual}</span></p>
                                    <p className="text-xs">Stock mínimo: {productoSeleccionado.stockMinimo}</p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            {/* Usuario */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Usuario *</label>
                                <Select
                                    value={codigoUsuario}
                                    onValueChange={(value) => setValue('codigoUsuario', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona usuario" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {usuarios.map((usr) => (
                                            <SelectItem key={usr.id} value={usr.codigo}>
                                                {usr.nombre} ({usr.codigo})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.codigoUsuario && (
                                    <p className="text-sm text-red-500">{errors.codigoUsuario.message}</p>
                                )}
                            </div>

                            {/* Proveedor (solo para entrada) */}
                            {tipo === 'ENTRADA' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Proveedor (Opcional)</label>
                                    <Select
                                        value={rucProveedor}
                                        onValueChange={(value) => setValue('rucProveedor', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona proveedor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {proveedores.map((prov) => (
                                                <SelectItem key={prov.id} value={prov.ruc || prov.nombre}>
                                                    {prov.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Costo Unitario */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Costo Unitario</label>
                                <Input
                                    {...register('costoUnitario', { valueAsNumber: true })}
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    disabled={isSubmitting}
                                />
                                {errors.costoUnitario && (
                                    <p className="text-sm text-red-500">{errors.costoUnitario.message}</p>
                                )}
                            </div>

                            {/* Estado */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Estado Inicial</label>
                                <Select
                                    value={estado}
                                    onValueChange={(value: 'ACTIVO' | 'PENDIENTE') => setValue('estado', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVO">Activo</SelectItem>
                                        <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.estado && (
                                    <p className="text-sm text-red-500">{errors.estado.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Observación */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Observación</label>
                            <Textarea
                                {...register('observacion')}
                                placeholder="Notas sobre este movimiento..."
                                disabled={isSubmitting}
                                className="h-20"
                            />
                            {errors.observacion && (
                                <p className="text-sm text-red-500">{errors.observacion.message}</p>
                            )}
                        </div>

                        {/* Referencia Documento */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Documento Referencia</label>
                            <Input
                                {...register('documentoRef')}
                                placeholder="Ej: FAC-001, NC-123"
                                disabled={isSubmitting}
                            />
                            {errors.documentoRef && (
                                <p className="text-sm text-red-500">{errors.documentoRef.message}</p>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 flex-1"
                            >
                                {isSubmitting ? 'Creando...' : 'Crear Movimiento'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isSubmitting}
                                onClick={handleCloseDialog}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirmar anulación</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de anular el movimiento del producto{" "}
                            <span className="font-semibold text-foreground">
                                "{movimientoParaAnular?.nombreProducto}"
                            </span>
                            ? Esta acción afectará el stock y no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowConfirmDialog(false)}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmAnular}
                            className="flex-1"
                        >
                            Anular
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
};