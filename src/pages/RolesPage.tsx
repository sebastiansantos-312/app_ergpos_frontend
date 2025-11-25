import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../components/AppLayout';
import { useRolStore } from '../stores/rolStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { DataTable } from '../components/DataTable';
import {
    Dialog, DialogFooter,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../components/ui/dialog';
import { rolSchema, type RolFormData } from '../schema';
import { toast } from 'react-toastify';
import { Plus, Search, Shield } from 'lucide-react';
import type { RolResponse } from '../types/rol';

export const RolesPage: React.FC = () => {
    const {
        roles,
        isLoading,
        cargarRoles,
        crearRol,
        actualizarRol,
        activarRol,
        desactivarRol,
    } = useRolStore();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [rolSeleccionado, setRolSeleccionado] = useState<RolResponse | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActivo, setFilterActivo] = useState<boolean | undefined>(undefined);
    const [rolParaDesactivar, setRolParaDesactivar] = useState<RolResponse | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);



    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RolFormData>({
        resolver: zodResolver(rolSchema),
    });

    // Cargar roles al montar
    useEffect(() => {
        cargarRoles();
    }, [cargarRoles]);

    // Filtrar roles
    const filteredRoles = roles.filter((rol) => {
        const matchesSearch =
            searchTerm === '' ||
            rol.nombre.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterActivo === undefined ||
            rol.activo === filterActivo;

        return matchesSearch && matchesFilter;
    });

    // Submit crear/editar
    const onSubmit = async (data: RolFormData) => {
        try {
            if (rolSeleccionado) {
                // Actualizar
                await actualizarRol(rolSeleccionado.nombre, data);
                toast.success('Rol actualizado correctamente');
            } else {
                // Crear
                await crearRol(data);
                toast.success('Rol creado correctamente');
            }
            reset();
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setRolSeleccionado(null);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al guardar el rol';
            toast.error(message);
        }
    };

    // Abrir diálogo de edición
    const handleEdit = (rol: RolResponse) => {
        setRolSeleccionado(rol);
        reset({
            nombre: rol.nombre,
        });
        setIsEditDialogOpen(true);
    };

    // Activar rol
    const handleActivate = async (rol: RolResponse) => {
        try {
            await activarRol(rol.nombre);
            toast.success('Rol activado');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al activar';
            toast.error(message);
        }
    };

    // Desactivar rol
    const handleDeactivate = async (rol: RolResponse) => {
        setRolParaDesactivar(rol);
        setShowConfirmDialog(true);
    };

    const confirmDeactivate = async () => {
        if (!rolParaDesactivar) return;

        try {
            await desactivarRol(rolParaDesactivar.nombre);
            toast.success('Rol desactivado');
            await cargarRoles();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al desactivar';
            toast.error(message);
        } finally {
            setShowConfirmDialog(false);
            setRolParaDesactivar(null);
        }
    };

    // Cerrar diálogo
    const handleCloseDialog = () => {
        setIsCreateDialogOpen(false);
        setIsEditDialogOpen(false);
        setRolSeleccionado(null);
        reset();
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestionar Roles</h1>
                        <p className="text-gray-600 mt-1">
                            Total: <span className="font-semibold">{filteredRoles.length}</span> roles
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setRolSeleccionado(null);
                            reset();
                            setIsCreateDialogOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo Rol
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
                                    placeholder="Buscar por nombre..."
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
                            data={filteredRoles}
                            isLoading={isLoading}
                            onEdit={handleEdit}
                            onActivate={handleActivate}
                            onDeactivate={handleDeactivate}
                            hasActions={true}
                            emptyMessage="No hay roles disponibles"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Diálogo Crear */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Nuevo Rol
                        </DialogTitle>
                        <DialogDescription>
                            Crea un nuevo rol para el sistema
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nombre del Rol *</label>
                            <Input
                                {...register('nombre')}
                                placeholder="Ej: GERENTE"
                                disabled={isSubmitting}
                            />
                            {errors.nombre && (
                                <p className="text-sm text-red-500">{errors.nombre.message}</p>
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
                        <DialogTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Editar Rol
                        </DialogTitle>
                        <DialogDescription>
                            Modifica los datos del rol
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nombre del Rol *</label>
                            <Input
                                {...register('nombre')}
                                placeholder="Ej: GERENTE"
                                disabled={isSubmitting}
                            />
                            {errors.nombre && (
                                <p className="text-sm text-red-500">{errors.nombre.message}</p>
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
                            ¿Estás seguro de desactivar el rol{" "}
                            <span className="font-semibold text-foreground">
                                "{rolParaDesactivar?.nombre}"
                            </span>
                            ? Los usuarios con este rol podrían perder permisos.
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