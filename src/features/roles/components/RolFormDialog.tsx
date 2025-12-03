import React, { useEffect } from 'react';
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
import { Shield } from 'lucide-react';
import { rolSchema, type RolFormData } from '@/schema';
import type { RolResponse } from '@/types/rol';

interface RolFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    rol?: RolResponse | null;
    onSubmit: (data: RolFormData) => Promise<void>;
}

export const RolFormDialog: React.FC<RolFormDialogProps> = ({
    isOpen,
    onClose,
    rol,
    onSubmit,
}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RolFormData>({
        resolver: zodResolver(rolSchema),
    });

    useEffect(() => {
        if (isOpen) {
            if (rol) {
                reset({
                    nombre: rol.nombre,
                });
            } else {
                reset({
                    nombre: '',
                });
            }
        }
    }, [isOpen, rol, reset]);

    const handleFormSubmit = async (data: RolFormData) => {
        await onSubmit(data);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        {rol ? 'Editar Rol' : 'Nuevo Rol'}
                    </DialogTitle>
                    <DialogDescription>
                        {rol ? 'Modifica los datos del rol' : 'Crea un nuevo rol para el sistema'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    {/* Nombre */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nombre del Rol *</label>
                        <Input
                            {...register('nombre')}
                            placeholder="Ej: GERENTE"
                            disabled={isSubmitting}
                        />
                        {errors.nombre && (
                            <p className="text-sm text-red-500">{errors.nombre.message?.toString()}</p>
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
