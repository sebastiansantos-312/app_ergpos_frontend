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
import { categoriaSchema, type CategoriaFormData } from '@/schema';
import type { CategoriaResponse } from '@/types/categoria';

interface CategoriaFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    categoria?: CategoriaResponse | null;
    onSubmit: (data: CategoriaFormData) => Promise<void>;
}

export const CategoriaFormDialog: React.FC<CategoriaFormDialogProps> = ({
    isOpen,
    onClose,
    categoria,
    onSubmit,
}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CategoriaFormData>({
        resolver: zodResolver(categoriaSchema),
    });

    useEffect(() => {
        if (isOpen) {
            if (categoria) {
                reset({
                    nombre: categoria.nombre,
                    codigo: categoria.codigo || '',
                });
            } else {
                reset({
                    nombre: '',
                    codigo: '',
                });
            }
        }
    }, [isOpen, categoria, reset]);

    const handleFormSubmit = async (data: CategoriaFormData) => {
        await onSubmit(data);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{categoria ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
                    <DialogDescription>
                        {categoria ? 'Modifica los datos de la categoría' : 'Crea una nueva categoría de productos'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    {/* Nombre */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nombre *</label>
                        <Input
                            {...register('nombre')}
                            placeholder="Ej: Electrónica"
                            disabled={isSubmitting}
                        />
                        {errors.nombre && (
                            <p className="text-sm text-red-500">{errors.nombre.message?.toString()}</p>
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
                            <p className="text-sm text-red-500">{errors.codigo.message?.toString()}</p>
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
