import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { AppLayout } from '../components/AppLayout';
import { usuarioUpdateSchema, type UsuarioUpdateFormData } from '../schema';
import { useRolStore } from '../stores/rolStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../components/ui/dialog';
import { usuarioService } from '../services/usuarioService';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const UsuarioDetailPage: React.FC = () => {
    const { email } = useParams<{ email: string }>();
    const navigate = useNavigate();
    const { roles, cargarRoles } = useRolStore();

    const [usuario, setUsuario] = React.useState<any | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<UsuarioUpdateFormData>({
        resolver: zodResolver(usuarioUpdateSchema),
    });

    const nombreRol = watch('nombreRol');

    // Cargar usuario
    React.useEffect(() => {
        const cargarUsuario = async () => {
            if (!email) return;
            setIsLoading(true);
            try {
                const data = await usuarioService.obtenerPorEmail(email);
                setUsuario(data);
                cargarRoles();
            } catch (error: any) {
                toast.error('Error cargando usuario');
                navigate('/usuarios');
            } finally {
                setIsLoading(false);
            }
        };
        cargarUsuario();
    }, [email, navigate, cargarRoles]);

    const onSubmit = async (data: UsuarioUpdateFormData) => {
        if (!usuario?.email) return;

        try {
            // Crear objeto sin el campo password si está vacío
            const updateData: UsuarioUpdateFormData = {
                nombre: data.nombre,
                email: data.email,
                nombreRol: data.nombreRol,
                codigo: data.codigo,
            };

            // Solo incluir password si se proporcionó
            if (data.password && data.password.trim() !== '') {
                updateData.password = data.password;
            }

            await usuarioService.actualizarUsuario(usuario.email, updateData);
            toast.success('Usuario actualizado correctamente');
            setIsEditDialogOpen(false);

            // Recargar usuario
            const usuarioActualizado = await usuarioService.obtenerPorEmail(usuario.email);
            setUsuario(usuarioActualizado);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al actualizar');
        }
    };

    if (isLoading) {
        return (
            <AppLayout>
                <div className="flex justify-center items-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            </AppLayout>
        );
    }

    if (!usuario) {
        return (
            <AppLayout>
                <div className="text-center py-12">
                    <p className="text-gray-500">Usuario no encontrado</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="space-y-6 max-w-2xl">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{usuario.nombre}</h1>
                        <p className="text-gray-600 mt-1">{usuario.email}</p>
                    </div>
                    <Button
                        onClick={() => {
                            reset({
                                nombre: usuario.nombre,
                                email: usuario.email,
                                nombreRol: usuario.rol,
                                codigo: usuario.codigo || '',
                                password: undefined,
                            });
                            setIsEditDialogOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Editar Usuario
                    </Button>
                </div>

                {/* Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información del Usuario</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Nombre</p>
                                <p className="text-gray-900">{usuario.nombre}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Email</p>
                                <p className="text-gray-900">{usuario.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Código</p>
                                <p className="text-gray-900 font-mono">{usuario.codigo || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Rol</p>
                                <p className="text-gray-900">{usuario.rol}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Estado</p>
                                <p className={`font-medium ${usuario.activo ? 'text-green-600' : 'text-red-600'}`}>
                                    {usuario.activo ? 'Activo' : 'Inactivo'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Diálogo Editar */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Editar Usuario</DialogTitle>
                            <DialogDescription>
                                Modifica los datos del usuario. Deja la contraseña vacía para no cambiarla.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Nombre */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nombre *</label>
                                <Input
                                    {...register('nombre')}
                                    disabled={isSubmitting}
                                    placeholder="Juan Pérez"
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
                                    disabled={isSubmitting}
                                    placeholder="juan@example.com"
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
                                    disabled={isSubmitting}
                                    placeholder="USR001"
                                />
                                {errors.codigo && (
                                    <p className="text-sm text-red-500">{errors.codigo.message}</p>
                                )}
                            </div>

                            {/* Contraseña */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nueva Contraseña (Opcional)</label>
                                <Input
                                    {...register('password')}
                                    type="password"
                                    disabled={isSubmitting}
                                    placeholder="Dejar vacío para no cambiar"
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                                <p className="text-xs text-gray-500">
                                    Mínimo 6 caracteres. Dejar vacío para mantener la contraseña actual.
                                </p>
                            </div>

                            {/* Rol */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Rol *</label>
                                <Select
                                    value={nombreRol}
                                    onValueChange={(value) => setValue('nombreRol', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona rol" />
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
                                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isSubmitting}
                                    onClick={() => setIsEditDialogOpen(false)}
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
};