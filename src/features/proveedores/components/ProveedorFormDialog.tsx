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
import { Textarea } from '@/components/ui/textarea';
import { Truck } from 'lucide-react';
import { proveedorSchema, type ProveedorFormData } from '@/schema';
import type { ProveedorResponse } from '@/types/proveedor';

interface ProveedorFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    proveedor?: ProveedorResponse | null;
    onSubmit: (data: ProveedorFormData) => Promise<void>;
}

export const ProveedorFormDialog: React.FC<ProveedorFormDialogProps> = ({
    isOpen,
    onClose,
    proveedor,
    onSubmit,
}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProveedorFormData>({
        resolver: zodResolver(proveedorSchema),
    });

    useEffect(() => {
        if (isOpen) {
            if (proveedor) {
                reset({
                    nombre: proveedor.nombre,
                    ruc: proveedor.ruc || '',
                    telefono: proveedor.telefono || '',
                    email: proveedor.email || '',
                    direccion: proveedor.direccion || '',
                });
            } else {
                reset({
                    nombre: '',
                    ruc: '',
                    telefono: '',
                    email: '',
                    direccion: '',
                });
            }
        }
    }, [isOpen, proveedor, reset]);

    const handleFormSubmit = async (data: ProveedorFormData) => {
        await onSubmit(data);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Truck className="w-5 h-5" />
                        {proveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                    </DialogTitle>
                    <DialogDescription>
                        {proveedor ? 'Modifica los datos del proveedor' : 'Crea un nuevo proveedor en el sistema'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    {/* Nombre */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nombre *</label>
                        <Input
                            {...register('nombre')}
                            placeholder="Ej: Distribuidora XYZ"
                            disabled={isSubmitting}
                        />
                        {errors.nombre && (
                            <p className="text-sm text-red-500">{errors.nombre.message?.toString()}</p>
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
                                <p className="text-sm text-red-500">{errors.ruc.message?.toString()}</p>
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
                                <p className="text-sm text-red-500">{errors.email.message?.toString()}</p>
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
                            <p className="text-sm text-red-500">{errors.telefono.message?.toString()}</p>
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
