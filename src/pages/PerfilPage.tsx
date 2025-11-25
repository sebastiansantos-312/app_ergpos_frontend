import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../stores/authStore';
import { usuarioService } from '../services/usuarioService';
import { AppLayout } from '../components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { cambiarPasswordSchema, type CambiarPasswordFormData } from '../schema';
import { toast } from 'react-toastify';
import { User, Lock, AlertCircle } from 'lucide-react';

export const PerfilPage: React.FC = () => {
    const { user } = useAuthStore();
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CambiarPasswordFormData>({
        resolver: zodResolver(cambiarPasswordSchema),
    });

    const onSubmitPassword = async (data: CambiarPasswordFormData) => {
        if (!user?.email) return;

        setIsLoadingPassword(true);
        try {
            await usuarioService.cambiarPassword(user.email, {
                passwordActual: data.passwordActual,
                nuevoPassword: data.nuevoPassword,
            });
            toast.success('Contraseña actualizada correctamente');
            reset();
            setIsEditingPassword(false);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al cambiar la contraseña';
            toast.error(message);
        } finally {
            setIsLoadingPassword(false);
        }
    };

    if (!user) {
        return <div>No autenticado</div>;
    }

    return (
        <AppLayout>
            <div className="space-y-6 max-w-4xl">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
                    <p className="text-gray-600 mt-2">Gestiona tu información personal y seguridad</p>
                </div>

                {/* Información Personal */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="flex items-center space-x-2">
                                <User className="w-5 h-5" />
                                <span>Información Personal</span>
                            </CardTitle>
                            <CardDescription>Detalles de tu cuenta</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nombre */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Nombre</label>
                                <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium">
                                    {user.nombre}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium">
                                    {user.email}
                                </div>
                            </div>

                            {/* Código */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Código de Usuario</label>
                                <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium">
                                    {user.codigo}
                                </div>
                            </div>

                            {/* Rol */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Rol</label>
                                <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium">
                                    {user.rol}
                                </div>
                            </div>

                            {/* Estado */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Estado</label>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${user.activo ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <span className="text-gray-900 font-medium">
                                        {user.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Módulos Disponibles */}
                <Card>
                    <CardHeader>
                        <CardTitle>Módulos Disponibles</CardTitle>
                        <CardDescription>Módulos a los que tienes acceso según tu rol</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {user.modules.map((module) => (
                                <div
                                    key={module}
                                    className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                                >
                                    <p className="text-sm font-medium text-blue-900 capitalize">
                                        {module}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Cambiar Contraseña */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="flex items-center space-x-2">
                                <Lock className="w-5 h-5" />
                                <span>Seguridad</span>
                            </CardTitle>
                            <CardDescription>Gestiona tu contraseña</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isEditingPassword ? (
                            <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-6">
                                {/* Contraseña Actual */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Contraseña Actual
                                    </label>
                                    <Input
                                        {...register('passwordActual')}
                                        type="password"
                                        placeholder="••••••••"
                                        disabled={isLoadingPassword}
                                    />
                                    {errors.passwordActual && (
                                        <p className="text-sm text-red-500">
                                            {errors.passwordActual.message}
                                        </p>
                                    )}
                                </div>

                                {/* Nueva Contraseña */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Nueva Contraseña
                                    </label>
                                    <Input
                                        {...register('nuevoPassword')}
                                        type="password"
                                        placeholder="••••••••"
                                        disabled={isLoadingPassword}
                                    />
                                    {errors.nuevoPassword && (
                                        <p className="text-sm text-red-500">
                                            {errors.nuevoPassword.message}
                                        </p>
                                    )}
                                </div>

                                {/* Confirmar Contraseña */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Confirmar Contraseña
                                    </label>
                                    <Input
                                        {...register('confirmarPassword')}
                                        type="password"
                                        placeholder="••••••••"
                                        disabled={isLoadingPassword}
                                    />
                                    {errors.confirmarPassword && (
                                        <p className="text-sm text-red-500">
                                            {errors.confirmarPassword.message}
                                        </p>
                                    )}
                                </div>

                                {/* Botones */}
                                <div className="flex gap-3">
                                    <Button
                                        type="submit"
                                        disabled={isLoadingPassword}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        {isLoadingPassword ? 'Guardando...' : 'Guardar Cambios'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditingPassword(false);
                                            reset();
                                        }}
                                        disabled={isLoadingPassword}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Cambiar tu contraseña regularmente ayuda a mantener tu cuenta segura
                                    </AlertDescription>
                                </Alert>
                                <Button
                                    onClick={() => setIsEditingPassword(true)}
                                    variant="outline"
                                >
                                    Cambiar Contraseña
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};