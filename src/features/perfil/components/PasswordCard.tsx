import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, AlertCircle } from 'lucide-react';
import { cambiarPasswordSchema, type CambiarPasswordFormData } from '@/schema';

interface PasswordCardProps {
    isEditing: boolean;
    isLoading: boolean;
    onStartEdit: () => void;
    onCancelEdit: () => void;
    onSubmit: (data: CambiarPasswordFormData) => Promise<void>;
}

export const PasswordCard: React.FC<PasswordCardProps> = ({
    isEditing,
    isLoading,
    onStartEdit,
    onCancelEdit,
    onSubmit,
}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CambiarPasswordFormData>({
        resolver: zodResolver(cambiarPasswordSchema),
    });

    const handleFormSubmit = async (data: CambiarPasswordFormData) => {
        await onSubmit(data);
        reset();
    };

    const handleCancel = () => {
        reset();
        onCancelEdit();
    };

    return (
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
                {isEditing ? (
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                        {/* Contraseña Actual */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Contraseña Actual
                            </label>
                            <Input
                                {...register('passwordActual')}
                                type="password"
                                placeholder="••••••••"
                                disabled={isLoading}
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
                                disabled={isLoading}
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
                                disabled={isLoading}
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
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isLoading}
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
                            onClick={onStartEdit}
                            variant="outline"
                        >
                            Cambiar Contraseña
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
