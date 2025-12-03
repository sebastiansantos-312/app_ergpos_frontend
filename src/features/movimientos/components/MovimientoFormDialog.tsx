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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowRightLeft, AlertCircle } from 'lucide-react';
import { movimientoSchema, type MovimientoFormData } from '@/schema';
import type { ProductoResponse } from '@/types/producto';
import type { UsuarioResponse } from '@/types/usuario';
import type { ProveedorResponse } from '@/types/proveedor';

interface MovimientoFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: MovimientoFormData) => Promise<void>;
    productos: ProductoResponse[];
    usuarios: UsuarioResponse[];
    proveedores: ProveedorResponse[];
}

export const MovimientoFormDialog: React.FC<MovimientoFormDialogProps> = ({
    isOpen,
    onClose,
    onSubmit,
    productos,
    usuarios,
    proveedores,
}) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<MovimientoFormData>({
        resolver: zodResolver(movimientoSchema) as any,
        defaultValues: {
            tipo: 'ENTRADA',
            estado: 'ACTIVO',
            costoUnitario: 0,
            cantidad: 1,
        }
    });

    const tipo = watch('tipo');
    const codigoProducto = watch('codigoProducto');
    const estado = watch('estado');
    const codigoUsuario = watch('codigoUsuario');
    const rucProveedor = watch('rucProveedor');

    // Obtener producto seleccionado
    const productoSeleccionado = productos.find(p => p.codigo === codigoProducto);

    const handleFormSubmit = async (data: MovimientoFormData) => {
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
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ArrowRightLeft className="w-5 h-5" />
                        Nuevo Movimiento
                    </DialogTitle>
                    <DialogDescription>
                        Registra un movimiento de entrada o salida de productos
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    {/* Tipo */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tipo de Movimiento *</label>
                        <Select
                            value={tipo}
                            onValueChange={(value: 'ENTRADA' | 'SALIDA') => setValue('tipo', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ENTRADA">Entrada</SelectItem>
                                <SelectItem value="SALIDA">Salida</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.tipo && (
                            <p className="text-sm text-red-500">{errors.tipo.message?.toString()}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Producto */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Producto *</label>
                            <Select
                                value={codigoProducto}
                                onValueChange={(value) => setValue('codigoProducto', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona producto" />
                                </SelectTrigger>
                                <SelectContent>
                                    {productos.map((prod) => (
                                        <SelectItem key={prod.id} value={prod.codigo}>
                                            {prod.nombre} ({prod.codigo})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.codigoProducto && (
                                <p className="text-sm text-red-500">{errors.codigoProducto.message?.toString()}</p>
                            )}
                        </div>

                        {/* Cantidad */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Cantidad *</label>
                            <Input
                                {...register('cantidad', { valueAsNumber: true })}
                                type="number"
                                min="1"
                                placeholder="0"
                                disabled={isSubmitting}
                            />
                            {errors.cantidad && (
                                <p className="text-sm text-red-500">{errors.cantidad.message?.toString()}</p>
                            )}
                        </div>
                    </div>

                    {/* Alerta si stock insuficiente */}
                    {tipo === 'SALIDA' && productoSeleccionado && (
                        <div className={`p-3 rounded flex items-start gap-2 ${productoSeleccionado.stockActual < 10
                            ? 'bg-yellow-50 border border-yellow-200'
                            : 'bg-blue-50 border border-blue-200'
                            }`}>
                            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-600" />
                            <div className="text-sm">
                                <p className="font-medium">Stock actual: <span className="font-bold">{productoSeleccionado.stockActual}</span></p>
                                <p className="text-xs">Stock mínimo: {productoSeleccionado.stockMinimo}</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        {/* Usuario */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Usuario *</label>
                            <Select
                                value={codigoUsuario}
                                onValueChange={(value) => setValue('codigoUsuario', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona usuario" />
                                </SelectTrigger>
                                <SelectContent>
                                    {usuarios.map((usr) => (
                                        <SelectItem key={usr.id} value={usr.codigo}>
                                            {usr.nombre} ({usr.codigo})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.codigoUsuario && (
                                <p className="text-sm text-red-500">{errors.codigoUsuario.message?.toString()}</p>
                            )}
                        </div>

                        {/* Proveedor (solo para entrada) */}
                        {tipo === 'ENTRADA' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Proveedor (Opcional)</label>
                                <Select
                                    value={rucProveedor || ""}
                                    onValueChange={(value) => setValue('rucProveedor', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona proveedor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {proveedores.map((prov) => (
                                            <SelectItem key={prov.id} value={prov.ruc || prov.nombre}>
                                                {prov.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Costo Unitario */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Costo Unitario</label>
                            <Input
                                {...register('costoUnitario', { valueAsNumber: true })}
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                disabled={isSubmitting}
                            />
                            {errors.costoUnitario && (
                                <p className="text-sm text-red-500">{errors.costoUnitario.message?.toString()}</p>
                            )}
                        </div>

                        {/* Estado */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Estado Inicial</label>
                            <Select
                                value={estado}
                                onValueChange={(value: 'ACTIVO' | 'PENDIENTE') => setValue('estado', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVO">Activo</SelectItem>
                                    <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.estado && (
                                <p className="text-sm text-red-500">{errors.estado.message?.toString()}</p>
                            )}
                        </div>
                    </div>

                    {/* Observación */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Observación</label>
                        <Textarea
                            {...register('observacion')}
                            placeholder="Notas sobre este movimiento..."
                            disabled={isSubmitting}
                            className="h-20"
                        />
                        {errors.observacion && (
                            <p className="text-sm text-red-500">{errors.observacion.message?.toString()}</p>
                        )}
                    </div>

                    {/* Referencia Documento */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Documento Referencia</label>
                        <Input
                            {...register('documentoRef')}
                            placeholder="Ej: FAC-001, NC-123"
                            disabled={isSubmitting}
                        />
                        {errors.documentoRef && (
                            <p className="text-sm text-red-500">{errors.documentoRef.message?.toString()}</p>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 flex-1"
                        >
                            {isSubmitting ? 'Creando...' : 'Crear Movimiento'}
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
