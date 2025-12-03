import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
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
import { usuarioCreateSchema, type UsuarioCreateFormData } from '@/schema';
import type { RolResponse } from '@/types/rol';

interface UsuarioFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UsuarioCreateFormData) => Promise<void>;
    roles: RolResponse[];
}

export const UsuarioFormDialog: React.FC<UsuarioFormDialogProps> = ({
    isOpen,
    onClose,
    onSubmit,
    roles,
}) => {
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

    const handleFormSubmit = async (data: UsuarioCreateFormData) => {
        await onSubmit(data);
        reset();
        onClose();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Nuevo Usuario</DialogTitle>
                    <DialogDescription>
                        Crea una nueva cuenta de usuario
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
                            onClick={handleClose}
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
