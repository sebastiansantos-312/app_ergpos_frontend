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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Package } from 'lucide-react';
import { productoSchema, type ProductoFormData } from '@/schema';
import type { ProductoResponse } from '@/types/producto';
import { useCategoriaStore } from '@/stores/categoriaStore';

const UNIDADES_MEDIDA = [
    'UNIDAD', 'KILO', 'LITRO', 'METRO', 'GRAMO',
    'CAJA', 'PAQUETE', 'ROLLO', 'PAR', 'DOCENA'
];

interface ProductoFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    producto?: ProductoResponse | null;
    onSubmit: (data: ProductoFormData) => Promise<void>;
}

export const ProductoFormDialog: React.FC<ProductoFormDialogProps> = ({
    isOpen,
    onClose,
    producto,
    onSubmit,
}) => {
    const { categorias } = useCategoriaStore();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
        trigger
    } = useForm<ProductoFormData>({
        resolver: zodResolver(productoSchema) as any,
        defaultValues: {
            codigo: '',
            nombre: '',
            descripcion: null,
            codigoCategoria: undefined,
            precio: 0,
            stockMinimo: 0,
            stockActual: 0,
            unidadMedida: 'UNIDAD'
        },
        mode: 'onChange'
    });

    const codigoCategoria = watch('codigoCategoria');
    const stockActual = watch('stockActual');
    const stockMinimo = watch('stockMinimo');

    // Reset form when dialog opens or product changes
    useEffect(() => {
        if (isOpen) {
            if (producto) {
                // Buscar categoría por código o nombre si es necesario
                const categoriaEncontrada = categorias.find(
                    cat => cat.codigo === producto.categoriaCodigo ||
                        cat.nombre === producto.categoriaNombre
                );

                reset({
                    codigo: producto.codigo,
                    nombre: producto.nombre,
                    descripcion: producto.descripcion || null,
                    codigoCategoria: producto.categoriaCodigo || categoriaEncontrada?.codigo || '',
                    precio: producto.precio,
                    stockMinimo: producto.stockMinimo,
                    stockActual: producto.stockActual,
                    unidadMedida: producto.unidadMedida,
                });
            } else {
                reset({
                    codigo: '',
                    nombre: '',
                    descripcion: null,
                    codigoCategoria: undefined,
                    precio: 0,
                    stockMinimo: 0,
                    stockActual: 0,
                    unidadMedida: 'UNIDAD'
                });
            }
        }
    }, [isOpen, producto, reset, categorias]);

    // Validar stock
    useEffect(() => {
        if (stockActual !== undefined && stockMinimo !== undefined) {
            trigger('stockActual');
        }
    }, [stockActual, stockMinimo, trigger]);

    const handleFormSubmit = async (data: ProductoFormData) => {
        await onSubmit(data);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        {producto ? 'Editar Producto' : 'Nuevo Producto'}
                    </DialogTitle>
                    <DialogDescription>
                        {producto ? 'Modifica los datos del producto' : 'Crea un nuevo producto en el inventario'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Código */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Código *</label>
                            <Input
                                {...register('codigo')}
                                placeholder="PRD001"
                                disabled={!!producto || isSubmitting}
                            />
                            {errors.codigo && (
                                <p className="text-sm text-red-500">{errors.codigo.message?.toString()}</p>
                            )}
                        </div>

                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nombre *</label>
                            <Input
                                {...register('nombre')}
                                placeholder="Laptop Dell"
                                disabled={isSubmitting}
                            />
                            {errors.nombre && (
                                <p className="text-sm text-red-500">{errors.nombre.message?.toString()}</p>
                            )}
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Descripción</label>
                        <Textarea
                            {...register('descripcion')}
                            placeholder="Descripción del producto..."
                            disabled={isSubmitting}
                            className="h-20"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Categoría */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Categoría *</label>
                            <Select
                                value={codigoCategoria || ""}
                                onValueChange={(value) => setValue("codigoCategoria", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categorias.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.codigo || String(cat.id)}>
                                            {cat.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.codigoCategoria && (
                                <p className="text-sm text-red-500">{errors.codigoCategoria.message?.toString()}</p>
                            )}
                        </div>

                        {/* Precio */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Precio *</label>
                            <Input
                                {...register('precio', { valueAsNumber: true })}
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="0.00"
                                disabled={isSubmitting}
                            />
                            {errors.precio && (
                                <p className="text-sm text-red-500">{errors.precio.message?.toString()}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {/* Stock Mínimo */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Stock Mínimo</label>
                            <Input
                                {...register('stockMinimo', {
                                    valueAsNumber: true,
                                    min: 0
                                })}
                                type="number"
                                min="0"
                                placeholder="0"
                                disabled={isSubmitting}
                            />
                            {errors.stockMinimo && (
                                <p className="text-sm text-red-500">{errors.stockMinimo.message?.toString()}</p>
                            )}
                        </div>

                        {/* Stock Actual */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Stock Actual *</label>
                            <Input
                                {...register('stockActual', {
                                    valueAsNumber: true,
                                    min: 0
                                })}
                                type="number"
                                min="0"
                                placeholder="0"
                                disabled={isSubmitting}
                            />
                            {errors.stockActual && (
                                <p className="text-sm text-red-500">{errors.stockActual.message?.toString()}</p>
                            )}
                            {stockActual < stockMinimo && (
                                <p className="text-sm text-red-500">
                                    ⚠️ El stock actual no puede ser menor al stock mínimo
                                </p>
                            )}
                        </div>

                        {/* Unidad de Medida */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Unidad Medida *</label>
                            <Select
                                value={watch('unidadMedida')}
                                onValueChange={(value) => setValue('unidadMedida', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona unidad" />
                                </SelectTrigger>
                                <SelectContent>
                                    {UNIDADES_MEDIDA.map((unidad) => (
                                        <SelectItem key={unidad} value={unidad}>
                                            {unidad}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.unidadMedida && (
                                <p className="text-sm text-red-500">{errors.unidadMedida.message?.toString()}</p>
                            )}
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting || stockActual < stockMinimo}
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
