import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { usuarioUpdateSchema, type UsuarioUpdateFormData } from '@/schema';
import type { RolResponse } from '@/types/rol';

interface UsuarioEditDialogProps {
    isOpen: boolean;
    onClose: () => void;
    usuario: any;
    roles: RolResponse[];
    onSubmit: (data: UsuarioUpdateFormData) => Promise<void>;
}

export const UsuarioEditDialog: React.FC<UsuarioEditDialogProps> = ({
    isOpen,
    onClose,
    usuario,
    roles,
    onSubmit,
}) => {
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

    useEffect(() => {
        if (isOpen && usuario) {
            reset({
                nombre: usuario.nombre,
                email: usuario.email,
                nombreRol: usuario.rol,
                codigo: usuario.codigo || '',
                password: undefined,
            });
        }
    }, [isOpen, usuario, reset]);

    const handleFormSubmit = async (data: UsuarioUpdateFormData) => {
        await onSubmit(data);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Usuario</DialogTitle>
                    <DialogDescription>
                        Modifica los datos del usuario. Deja la contraseña vacía para no cambiarla.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
