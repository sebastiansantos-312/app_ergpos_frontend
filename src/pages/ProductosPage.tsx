import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../components/AppLayout';
import { useProductoStore } from '../stores/productoStore';
import { useCategoriaStore } from '../stores/categoriaStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { DataTable } from '../components/DataTable';
import {
    Dialog,
    DialogContent,
    DialogFooter,
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
import { productoSchema, type ProductoFormData } from '../schema';
import { toast } from 'react-toastify';
import { Plus, Search, Package, DollarSign, Box } from 'lucide-react';
import type { ProductoRequest, ProductoResponse } from '../types/producto';

export const ProductosPage: React.FC = () => {
    const {
        productos,
        isLoading,
        cargarProductos,
        crearProducto,
        actualizarProducto,
        activarProducto,
        desactivarProducto,
    } = useProductoStore();

    const { categorias, cargarCategorias } = useCategoriaStore();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoResponse | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActivo, setFilterActivo] = useState<boolean | undefined>(undefined);
    const [productoParaDesactivar, setProductoParaDesactivar] = useState<ProductoResponse | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ProductoFormData>({
        resolver: zodResolver(productoSchema),
        defaultValues: {
            codigo: '',
            nombre: '',
            descripcion: null,
            codigoCategoria: undefined,
            precio: 0,
            stockMinimo: 0,
            stockActual: 0,
            unidadMedida: 'UNIDAD'
        },
        mode: 'onChange'
    } as any);

    const codigoCategoria = watch('codigoCategoria');

    // Cargar datos al montar
    useEffect(() => {
        cargarProductos();
        cargarCategorias({ activo: true });
    }, []);

    // Filtrar productos
    const filteredProductos = productos.filter((prod) => {
        const matchesSearch =
            searchTerm === '' ||
            prod.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prod.codigo.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterActivo === undefined ||
            prod.activo === filterActivo;

        return matchesSearch && matchesFilter;
    });

    // Submit crear/editar
    const onSubmit = async (data: ProductoFormData) => {
        try {
            // Transformar ProductoFormData a ProductoRequest
            const productoRequest: ProductoRequest = {
                codigo: data.codigo,
                nombre: data.nombre,
                descripcion: data.descripcion || undefined,
                codigoCategoria: data.codigoCategoria || undefined,
                precio: data.precio,
                stockMinimo: data.stockMinimo ?? 0,
                stockActual: data.stockActual ?? 0,
                unidadMedida: data.unidadMedida || 'UNIDAD'
            };

            if (productoSeleccionado) {
                // Actualizar
                await actualizarProducto(productoSeleccionado.codigo, productoRequest);
                toast.success('Producto actualizado correctamente');
            } else {
                // Crear
                await crearProducto(productoRequest);
                toast.success('Producto creado correctamente');
            }
            reset();
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setProductoSeleccionado(null);
            await cargarProductos();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al guardar el producto';
            toast.error(message);
        }
    };

    // Abrir diálogo de edición
    const handleEdit = (producto: ProductoResponse) => {
        setProductoSeleccionado(producto);
        reset({
            codigo: producto.codigo,
            nombre: producto.nombre,
            descripcion: producto.descripcion || null,
            codigoCategoria: producto.categoriaId || undefined,
            precio: producto.precio,
            stockMinimo: producto.stockMinimo,
            stockActual: producto.stockActual,
            unidadMedida: producto.unidadMedida,
        });
        setIsEditDialogOpen(true);
    };

    // Activar producto
    const handleActivate = async (producto: ProductoResponse) => {
        try {
            await activarProducto(producto.codigo);
            toast.success('Producto activado');
            await cargarProductos();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al activar');
        }
    };

    // Desactivar producto
    const handleDeactivate = async (producto: ProductoResponse) => {
        setProductoParaDesactivar(producto);
        setShowConfirmDialog(true);
    };

    // Función de confirmación
    const confirmDeactivate = async () => {
        if (!productoParaDesactivar) return;

        try {
            await desactivarProducto(productoParaDesactivar.codigo);
            toast.success('Producto desactivado');
            await cargarProductos();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al desactivar');
        } finally {
            setShowConfirmDialog(false);
            setProductoParaDesactivar(null);
        }
    };

    const handleCloseDialog = () => {
        setIsCreateDialogOpen(false);
        setIsEditDialogOpen(false);
        setProductoSeleccionado(null);
        reset();
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestionar Productos</h1>
                        <p className="text-gray-600 mt-1">
                            Total: <span className="font-semibold">{filteredProductos.length}</span> productos
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setProductoSeleccionado(null);
                            reset();
                            setIsCreateDialogOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo Producto
                    </Button>
                </div>

                {/* Filtros */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-4 flex-col md:flex-row">
                            {/* Búsqueda */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Buscar por nombre o código..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Filtro de estado */}
                            <select
                                value={filterActivo === undefined ? '' : filterActivo.toString()}
                                onChange={(e) => {
                                    if (e.target.value === '') {
                                        setFilterActivo(undefined);
                                    } else {
                                        setFilterActivo(e.target.value === 'true');
                                    }
                                }}
                                className="px-4 py-2 border rounded-lg bg-white text-gray-700 font-medium"
                            >
                                <option value="">Todos los estados</option>
                                <option value="true">Activos</option>
                                <option value="false">Inactivos</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabla */}
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
                                    ) : '-',
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
                                            <span className={value <= row.stockMinimo ? 'text-red-600 font-bold' : ''}>
                                                {value}
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
                            data={filteredProductos}
                            isLoading={isLoading}
                            onEdit={handleEdit}
                            onActivate={handleActivate}
                            onDeactivate={handleDeactivate}
                            hasActions={true}
                            emptyMessage="No hay productos disponibles"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Diálogo Crear */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Nuevo Producto
                        </DialogTitle>
                        <DialogDescription>
                            Crea un nuevo producto en el inventario
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Código */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Código *</label>
                                <Input
                                    {...register('codigo')}
                                    placeholder="PRD001"
                                    disabled={isSubmitting}
                                />
                                {errors.codigo && (
                                    <p className="text-sm text-red-500">{errors.codigo.message}</p>
                                )}
                            </div>

                            {/* Nombre */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nombre *</label>
                                <Input
                                    {...register('nombre')}
                                    placeholder="Laptop Dell"
                                    disabled={isSubmitting}
                                />
                                {errors.nombre && (
                                    <p className="text-sm text-red-500">{errors.nombre.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Descripción</label>
                            <Textarea
                                {...register('descripcion')}
                                defaultValue=""
                                placeholder="Descripción del producto..."
                                disabled={isSubmitting}
                                className="h-20"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Categoría */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Categoría</label>
                                <Select
                                    value={codigoCategoria || "NONE"}
                                    onValueChange={(value) =>
                                        setValue("codigoCategoria", value === "NONE" ? undefined : value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona categoría" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="NONE">Sin categoría</SelectItem> {/* ✔️ VALOR VÁLIDO */}

                                        {categorias.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.codigo || String(cat.id)}>
                                                {cat.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                            </div>

                            {/* Precio */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Precio *</label>
                                <Input
                                    {...register('precio', { valueAsNumber: true })}
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    disabled={isSubmitting}
                                />
                                {errors.precio && (
                                    <p className="text-sm text-red-500">{errors.precio.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {/* Stock Mínimo */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Stock Mínimo</label>
                                <Input
                                    {...register('stockMinimo', { valueAsNumber: true })}
                                    type="number"
                                    placeholder="0"
                                    disabled={isSubmitting}
                                />
                                {errors.stockMinimo && (
                                    <p className="text-sm text-red-500">{errors.stockMinimo.message}</p>
                                )}
                            </div>

                            {/* Stock Actual */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Stock Actual</label>
                                <Input
                                    {...register('stockActual', { valueAsNumber: true })}
                                    type="number"
                                    placeholder="0"
                                    disabled={isSubmitting}
                                />
                                {errors.stockActual && (
                                    <p className="text-sm text-red-500">{errors.stockActual.message}</p>
                                )}
                            </div>

                            {/* Unidad de Medida */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Unidad Medida</label>
                                <Input
                                    {...register('unidadMedida')}
                                    placeholder="UNIDAD"
                                    disabled={isSubmitting}
                                />
                                {errors.unidadMedida && (
                                    <p className="text-sm text-red-500">{errors.unidadMedida.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 flex-1"
                            >
                                {isSubmitting ? 'Creando...' : 'Crear Producto'}
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

            {/* Diálogo Editar */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Editar Producto
                        </DialogTitle>
                        <DialogDescription>
                            Modifica los datos del producto
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Código */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Código *</label>
                                <Input
                                    {...register('codigo')}
                                    placeholder="PRD001"
                                    disabled={true}
                                />
                                {errors.codigo && (
                                    <p className="text-sm text-red-500">{errors.codigo.message}</p>
                                )}
                            </div>

                            {/* Nombre */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nombre *</label>
                                <Input
                                    {...register('nombre')}
                                    placeholder="Laptop Dell"
                                    disabled={isSubmitting}
                                />
                                {errors.nombre && (
                                    <p className="text-sm text-red-500">{errors.nombre.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Descripción</label>
                            <Textarea
                                {...register('descripcion')}
                                defaultValue=""
                                placeholder="Descripción del producto..."
                                disabled={isSubmitting}
                                className="h-20"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Categoría */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Categoría</label>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Categoría</label>
                                    <Select
                                        value={codigoCategoria || "NONE"}
                                        onValueChange={(value) =>
                                            setValue("codigoCategoria", value === "NONE" ? undefined : value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NONE">Sin categoría</SelectItem>
                                            {categorias.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.codigo || String(cat.id)}>
                                                    {cat.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Precio */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Precio *</label>
                                <Input
                                    {...register('precio', { valueAsNumber: true })}
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    disabled={isSubmitting}
                                />
                                {errors.precio && (
                                    <p className="text-sm text-red-500">{errors.precio.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {/* Stock Mínimo */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Stock Mínimo</label>
                                <Input
                                    {...register('stockMinimo', { valueAsNumber: true })}
                                    type="number"
                                    placeholder="0"
                                    disabled={isSubmitting}
                                />
                                {errors.stockMinimo && (
                                    <p className="text-sm text-red-500">{errors.stockMinimo.message}</p>
                                )}
                            </div>

                            {/* Stock Actual */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Stock Actual</label>
                                <Input
                                    {...register('stockActual', { valueAsNumber: true })}
                                    type="number"
                                    placeholder="0"
                                    disabled={isSubmitting}
                                />
                                {errors.stockActual && (
                                    <p className="text-sm text-red-500">{errors.stockActual.message}</p>
                                )}
                            </div>

                            {/* Unidad de Medida */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Unidad Medida</label>
                                <Input
                                    {...register('unidadMedida')}
                                    placeholder="UNIDAD"
                                    disabled={isSubmitting}
                                />
                                {errors.unidadMedida && (
                                    <p className="text-sm text-red-500">{errors.unidadMedida.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 flex-1"
                            >
                                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
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

            {/* Diálogo Confirmar Desactivación */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirmar desactivación</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de desactivar el producto{" "}
                            <span className="font-semibold text-foreground">
                                "{productoParaDesactivar?.nombre}"
                            </span>
                            ? No podrá ser utilizado en nuevos movimientos.
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
                            onClick={confirmDeactivate}
                            className="flex-1"
                        >
                            Desactivar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
};