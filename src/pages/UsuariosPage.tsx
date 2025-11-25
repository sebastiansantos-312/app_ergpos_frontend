import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../components/AppLayout';
import { useUsuarioStore } from '../stores/usuarioStore';
import { useRolStore } from '../stores/rolStore';
import { useAuthStore } from '../stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { DataTable } from '../components/DataTable';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { usuarioCreateSchema, type UsuarioCreateFormData } from '../schema';
import { toast } from 'react-toastify';
import { Plus, Search, Mail, Power, PowerOff, Shield } from 'lucide-react';
import type { UsuarioResponse } from '../types/usuario';
import { usuarioService } from '../services/usuarioService';

export const UsuariosPage: React.FC = () => {
    const {
        usuarios,
        isLoading,
        cargarUsuarios,
    } = useUsuarioStore();

    const { roles, cargarRoles } = useRolStore();
    const { user: currentUser } = useAuthStore();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActivo, setFilterActivo] = useState<boolean | undefined>(undefined);
    const [usuarioParaDesactivar, setUsuarioParaDesactivar] = useState<UsuarioResponse | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<UsuarioCreateFormData>({
        resolver: zodResolver(usuarioCreateSchema),
    });

    const selectedRol = watch('nombreRol');

    // Cargar datos al montar
    useEffect(() => {
        cargarUsuarios();
        cargarRoles();
    }, [cargarUsuarios, cargarRoles]);

    // Filtrar usuarios
    const filteredUsuarios = usuarios.filter((usr) => {
        const matchesSearch =
            searchTerm === '' ||
            usr.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usr.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usr.codigo.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterActivo === undefined ||
            usr.activo === filterActivo;

        return matchesSearch && matchesFilter;
    });

    // Submit crear usuario
    const onSubmit = async (data: UsuarioCreateFormData) => {
        try {
            await usuarioService.crearUsuario(data);
            toast.success('Usuario creado correctamente');
            reset();
            setIsCreateDialogOpen(false);
            await cargarUsuarios();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al crear el usuario';
            toast.error(message);
        }
    };

    const handleActivate = async (usuario: UsuarioResponse) => {
        try {
            await usuarioService.activarUsuario(usuario.email);
            toast.success('Usuario activado');
            await cargarUsuarios();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al activar');
        }
    };

    const handleDeactivate = async (usuario: UsuarioResponse) => {
        // Validar si es el mismo usuario
        if (currentUser && usuario.email === currentUser.email) {
            toast.error('No puedes desactivar tu propia cuenta');
            return;
        }

        setUsuarioParaDesactivar(usuario);
        setShowConfirmDialog(true);
    };

    const confirmDeactivate = async () => {
        if (!usuarioParaDesactivar) return;

        try {
            await usuarioService.desactivarUsuario(usuarioParaDesactivar.email);
            toast.success('Usuario desactivado');
            await cargarUsuarios();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al desactivar');
        } finally {
            setShowConfirmDialog(false);
            setUsuarioParaDesactivar(null);
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
                        <h1 className="text-3xl font-bold text-gray-900">Gestionar Usuarios</h1>
                        <p className="text-gray-600 mt-1">
                            Total: <span className="font-semibold">{filteredUsuarios.length}</span> usuarios
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
                        Nuevo Usuario
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
                                    placeholder="Buscar por nombre, email o código..."
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
                        <CardTitle>Lista de Usuarios</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable<UsuarioResponse>
                            columns={[
                                {
                                    header: 'Nombre',
                                    accessor: 'nombre',
                                    width: 'w-32',
                                },
                                {
                                    header: 'Email',
                                    accessor: 'email',
                                    width: 'w-40',
                                    cell: (value) => (
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            {value}
                                        </div>
                                    ),
                                },
                                {
                                    header: 'Código',
                                    accessor: 'codigo',
                                    cell: (value) => (
                                        <span className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                                            {value}
                                        </span>
                                    ),
                                },
                                {
                                    header: 'Rol',
                                    accessor: 'rol',
                                    cell: (value) => (
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                                            {value}
                                        </span>
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
                            data={filteredUsuarios}
                            isLoading={isLoading}
                            hasActions={true}
                            renderActions={(usuario) => {
                                const isCurrentUser = currentUser && usuario.email === currentUser.email;

                                return (
                                    <div className="flex gap-2">
                                        {/* Botón Activar - Si está inactivo */}
                                        {!usuario.activo && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleActivate(usuario)}
                                                className="p-1 text-green-600 hover:text-green-700"
                                                title="Activar usuario"
                                            >
                                                <Power className="w-4 h-4" />
                                            </Button>
                                        )}

                                        {/* Botón Desactivar - Si está activo Y NO es el usuario actual */}
                                        {usuario.activo && !isCurrentUser && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeactivate(usuario)}
                                                className="p-1 text-orange-600 hover:text-orange-700"
                                                title="Desactivar usuario"
                                            >
                                                <PowerOff className="w-4 h-4" />
                                            </Button>
                                        )}

                                        {/* Indicador para usuario actual */}
                                        {isCurrentUser && (
                                            <div className="flex items-center gap-1 text-xs text-blue-600 px-2 py-1 bg-blue-50 rounded">
                                                <Shield className="w-3 h-3" />
                                                <span>Tú</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            }}
                            emptyMessage="No hay usuarios disponibles"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Diálogo Crear */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Nuevo Usuario</DialogTitle>
                        <DialogDescription>
                            Crea una nueva cuenta de usuario
                        </DialogDescription>
                    </DialogHeader>


                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nombre *</label>
                            <Input
                                {...register('nombre')}
                                placeholder="Juan Pérez"
                                disabled={isSubmitting}
                            />
                            {errors.nombre && (
                                <p className="text-sm text-red-500">{errors.nombre.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email *</label>
                            <Input
                                {...register('email')}
                                type="email"
                                placeholder="juan@example.com"
                                disabled={isSubmitting}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Código */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Código (Opcional)</label>
                            <Input
                                {...register('codigo')}
                                placeholder="USR001"
                                disabled={isSubmitting}
                            />
                            {errors.codigo && (
                                <p className="text-sm text-red-500">{errors.codigo.message}</p>
                            )}
                        </div>

                        {/* Contraseña */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Contraseña *</label>
                            <Input
                                {...register('password')}
                                type="password"
                                placeholder="••••••••"
                                disabled={isSubmitting}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Rol */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Rol *</label>
                            <Select
                                value={selectedRol}
                                onValueChange={(value) => setValue('nombreRol', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((rol) => (
                                        <SelectItem key={rol.id} value={rol.nombre}>
                                            {rol.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.nombreRol && (
                                <p className="text-sm text-red-500">{errors.nombreRol.message}</p>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 flex-1"
                            >
                                {isSubmitting ? 'Creando...' : 'Crear Usuario'}
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
            {/* 🆕 Diálogo de Confirmación para Desactivar - NUEVO */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirmar desactivación</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de desactivar al usuario{" "}
                            <span className="font-semibold text-foreground">
                                "{usuarioParaDesactivar?.nombre}"
                            </span>
                            ? El usuario no podrá acceder al sistema hasta que sea reactivado.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowConfirmDialog(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeactivate}
                        >
                            Desactivar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
};