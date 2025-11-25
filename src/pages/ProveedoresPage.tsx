import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../components/AppLayout';
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
import { proveedorSchema, type ProveedorFormData } from '../schema';
import { toast } from 'react-toastify';
import { Plus, Search, Truck, Mail, Phone } from 'lucide-react';
import type { ProveedorResponse } from '../types/proveedor';

export const ProveedoresPage: React.FC = () => {
    const {
        proveedores,
        isLoading,
        cargarProveedores,
        crearProveedor,
        actualizarProveedor,
        activarProveedor,
        desactivarProveedor,
    } = useProveedorStore();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState<ProveedorResponse | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActivo, setFilterActivo] = useState<boolean | undefined>(undefined);
    const [proveedorParaDesactivar, setProveedorParaDesactivar] = useState<ProveedorResponse | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProveedorFormData>({
        resolver: zodResolver(proveedorSchema),
    });

    // Cargar proveedores al montar
    useEffect(() => {
        cargarProveedores();
    }, [cargarProveedores]);

    // Filtrar proveedores
    const filteredProveedores = proveedores.filter((prov) => {
        const matchesSearch =
            searchTerm === '' ||
            prov.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (prov.ruc?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
            (prov.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

        const matchesFilter =
            filterActivo === undefined ||
            prov.activo === filterActivo;

        return matchesSearch && matchesFilter;
    });

    // Submit crear/editar
    const onSubmit = async (data: ProveedorFormData) => {
        try {
            if (proveedorSeleccionado) {
                // Actualizar
                await actualizarProveedor(proveedorSeleccionado.ruc || proveedorSeleccionado.nombre, data);
                toast.success('Proveedor actualizado correctamente');
            } else {
                // Crear
                await crearProveedor(data);
                toast.success('Proveedor creado correctamente');
            }
            reset();
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setProveedorSeleccionado(null);
            await cargarProveedores();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al guardar el proveedor';
            toast.error(message);
        }
    };

    // Abrir diálogo de edición
    const handleEdit = (proveedor: ProveedorResponse) => {
        setProveedorSeleccionado(proveedor);
        reset({
            nombre: proveedor.nombre,
            ruc: proveedor.ruc || '',
            telefono: proveedor.telefono || '',
            email: proveedor.email || '',
            direccion: proveedor.direccion || '',
        });
        setIsEditDialogOpen(true);
    };

    // Activar proveedor
    const handleActivate = async (proveedor: ProveedorResponse) => {
        try {
            await activarProveedor(proveedor.ruc || proveedor.nombre);
            toast.success('Proveedor activado');
            await cargarProveedores();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al activar');
        }
    };

    // Desactivar proveedor
    const handleDeactivate = async (proveedor: ProveedorResponse) => {
        setProveedorParaDesactivar(proveedor);
        setShowConfirmDialog(true);
    };

    const confirmDeactivate = async () => {
        if (!proveedorParaDesactivar) return;

        try {
            await desactivarProveedor(proveedorParaDesactivar.ruc || proveedorParaDesactivar.nombre);
            toast.success('Proveedor desactivado');
            await cargarProveedores();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al desactivar');
        } finally {
            setShowConfirmDialog(false);
            setProveedorParaDesactivar(null);
        }
    };


    const handleCloseDialog = () => {
        setIsCreateDialogOpen(false);
        setIsEditDialogOpen(false);
        setProveedorSeleccionado(null);
        reset();
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestionar Proveedores</h1>
                        <p className="text-gray-600 mt-1">
                            Total: <span className="font-semibold">{filteredProveedores.length}</span> proveedores
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setProveedorSeleccionado(null);
                            reset();
                            setIsCreateDialogOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo Proveedor
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
                                    placeholder="Buscar por nombre, RUC o email..."
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
                            data={filteredProveedores}
                            isLoading={isLoading}
                            onEdit={handleEdit}
                            onActivate={handleActivate}
                            onDeactivate={handleDeactivate}
                            hasActions={true}
                            emptyMessage="No hay proveedores disponibles"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Diálogo Crear */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Truck className="w-5 h-5" />
                            Nuevo Proveedor
                        </DialogTitle>
                        <DialogDescription>
                            Crea un nuevo proveedor en el sistema
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nombre *</label>
                            <Input
                                {...register('nombre')}
                                placeholder="Ej: Distribuidora XYZ"
                                disabled={isSubmitting}
                            />
                            {errors.nombre && (
                                <p className="text-sm text-red-500">{errors.nombre.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* RUC */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">RUC</label>
                                <Input
                                    {...register('ruc')}
                                    placeholder="1234567890"
                                    disabled={isSubmitting}
                                />
                                {errors.ruc && (
                                    <p className="text-sm text-red-500">{errors.ruc.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    {...register('email')}
                                    type="email"
                                    placeholder="contacto@proveedor.com"
                                    disabled={isSubmitting}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Teléfono</label>
                            <Input
                                {...register('telefono')}
                                placeholder="+1 (555) 123-4567"
                                disabled={isSubmitting}
                            />
                            {errors.telefono && (
                                <p className="text-sm text-red-500">{errors.telefono.message}</p>
                            )}
                        </div>

                        {/* Dirección */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Dirección</label>
                            <Textarea
                                {...register('direccion')}
                                placeholder="Calle Principal 123, Ciudad..."
                                disabled={isSubmitting}
                                className="h-20"
                            />
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 flex-1"
                            >
                                {isSubmitting ? 'Creando...' : 'Crear Proveedor'}
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
                            <Truck className="w-5 h-5" />
                            Editar Proveedor
                        </DialogTitle>
                        <DialogDescription>
                            Modifica los datos del proveedor
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nombre *</label>
                            <Input
                                {...register('nombre')}
                                placeholder="Ej: Distribuidora XYZ"
                                disabled={isSubmitting}
                            />
                            {errors.nombre && (
                                <p className="text-sm text-red-500">{errors.nombre.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* RUC */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">RUC</label>
                                <Input
                                    {...register('ruc')}
                                    placeholder="1234567890"
                                    disabled={isSubmitting}
                                />
                                {errors.ruc && (
                                    <p className="text-sm text-red-500">{errors.ruc.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    {...register('email')}
                                    type="email"
                                    placeholder="contacto@proveedor.com"
                                    disabled={isSubmitting}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Teléfono</label>
                            <Input
                                {...register('telefono')}
                                placeholder="+1 (555) 123-4567"
                                disabled={isSubmitting}
                            />
                            {errors.telefono && (
                                <p className="text-sm text-red-500">{errors.telefono.message}</p>
                            )}
                        </div>

                        {/* Dirección */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Dirección</label>
                            <Textarea
                                {...register('direccion')}
                                placeholder="Calle Principal 123, Ciudad..."
                                disabled={isSubmitting}
                                className="h-20"
                            />
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
                            ¿Estás seguro de desactivar al proveedor{" "}
                            <span className="font-semibold text-foreground">
                                "{proveedorParaDesactivar?.nombre}"
                            </span>
                            ? No podrá ser utilizado en nuevos movimientos de entrada.
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