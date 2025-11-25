import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../components/AppLayout';
import { useCategoriaStore } from '../stores/categoriaStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { DataTable } from '../components/DataTable';
import {
    Dialog,
    DialogContent, DialogFooter,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../components/ui/dialog';
import { categoriaSchema, type CategoriaFormData } from '../schema';
import { toast } from 'react-toastify';
import { Plus, Search } from 'lucide-react';
import type { CategoriaResponse } from '../types/categoria';

export const CategoriasPage: React.FC = () => {
    const {
        categorias,
        isLoading,
        cargarCategorias,
        crearCategoria,
        actualizarCategoria,
        activarCategoria,
        desactivarCategoria,
    } = useCategoriaStore();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaResponse | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActivo, setFilterActivo] = useState<boolean | undefined>(undefined);
    const [categoriaParaDesactivar, setCategoriaParaDesactivar] = useState<CategoriaResponse | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CategoriaFormData>({
        resolver: zodResolver(categoriaSchema),
    });

    // Cargar categorías al montar
    useEffect(() => {
        cargarCategorias();
    }, [cargarCategorias]);

    // Filtrar categorías
    const filteredCategorias = categorias.filter((cat) => {
        const matchesSearch =
            searchTerm === '' ||
            cat.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cat.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

        const matchesFilter =
            filterActivo === undefined ||
            cat.activo === filterActivo;

        return matchesSearch && matchesFilter;
    });

    // Submit crear/editar
    const onSubmit = async (data: CategoriaFormData) => {
        try {
            if (categoriaSeleccionada) {
                await actualizarCategoria(categoriaSeleccionada.id, data);
                toast.success('Categoría actualizada correctamente');
            } else {
                await crearCategoria(data);
                toast.success('Categoría creada correctamente');
            }
            reset();
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setCategoriaSeleccionada(null);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al guardar la categoría';
            toast.error(message);
        }
    };

    // Abrir diálogo de edición
    const handleEdit = (categoria: CategoriaResponse) => {
        setCategoriaSeleccionada(categoria);
        reset({
            nombre: categoria.nombre,
            codigo: categoria.codigo || '',
        });
        setIsEditDialogOpen(true);
    };

    // Activar categoría
    const handleActivate = async (categoria: CategoriaResponse) => {
        try {
            await activarCategoria(categoria.id);
            toast.success('Categoría activada');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al activar';
            toast.error(message);
        }
    };

    const handleDeactivate = async (categoria: CategoriaResponse) => {
        setCategoriaParaDesactivar(categoria);
        setShowConfirmDialog(true);
    };
    // Desactivar categoría
    // Función de confirmación
    const confirmDeactivate = async () => {
        if (!categoriaParaDesactivar) return;

        try {
            await desactivarCategoria(categoriaParaDesactivar.id);
            toast.success('Categoría desactivada');
            await cargarCategorias();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al desactivar';
            toast.error(message);
        } finally {
            setShowConfirmDialog(false);
            setCategoriaParaDesactivar(null);
        }
    };

    // Cerrar diálogo
    const handleCloseDialog = () => {
        setIsCreateDialogOpen(false);
        setIsEditDialogOpen(false);
        setCategoriaSeleccionada(null);
        reset();
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestionar Categorías</h1>
                        <p className="text-gray-600 mt-1">
                            Total: <span className="font-semibold">{filteredCategorias.length}</span> categorías
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setCategoriaSeleccionada(null);
                            reset();
                            setIsCreateDialogOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva Categoría
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
                            data={filteredCategorias}
                            isLoading={isLoading}
                            onEdit={handleEdit}
                            onActivate={handleActivate}
                            onDeactivate={handleDeactivate}
                            hasActions={true}
                            emptyMessage="No hay categorías disponibles"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Diálogo Crear */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nueva Categoría</DialogTitle>
                        <DialogDescription>
                            Crea una nueva categoría de productos
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nombre *</label>
                            <Input
                                {...register('nombre')}
                                placeholder="Ej: Electrónica"
                                disabled={isSubmitting}
                            />
                            {errors.nombre && (
                                <p className="text-sm text-red-500">{errors.nombre.message}</p>
                            )}
                        </div>

                        {/* Código */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Código (Opcional)</label>
                            <Input
                                {...register('codigo')}
                                placeholder="Ej: ELEC"
                                disabled={isSubmitting}
                            />
                            {errors.codigo && (
                                <p className="text-sm text-red-500">{errors.codigo.message}</p>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 flex-1"
                            >
                                {isSubmitting ? 'Guardando...' : 'Guardar'}
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Categoría</DialogTitle>
                        <DialogDescription>
                            Modifica los datos de la categoría
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nombre *</label>
                            <Input
                                {...register('nombre')}
                                placeholder="Ej: Electrónica"
                                disabled={isSubmitting}
                            />
                            {errors.nombre && (
                                <p className="text-sm text-red-500">{errors.nombre.message}</p>
                            )}
                        </div>

                        {/* Código */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Código (Opcional)</label>
                            <Input
                                {...register('codigo')}
                                placeholder="Ej: ELEC"
                                disabled={isSubmitting}
                            />
                            {errors.codigo && (
                                <p className="text-sm text-red-500">{errors.codigo.message}</p>
                            )}
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

            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirmar desactivación</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de desactivar la categoría{" "}
                            <span className="font-semibold text-foreground">
                                "{categoriaParaDesactivar?.nombre}"
                            </span>
                            ? Los productos asociados podrían verse afectados.
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