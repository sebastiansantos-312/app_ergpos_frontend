import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { ProductoResponse } from '@/types/producto';

interface ProductoActionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    producto: ProductoResponse | null;
    type: 'deactivate'; // Por ahora solo desactivar, extensible a eliminar
}

export const ProductoActionDialog: React.FC<ProductoActionDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    producto,
    // type,
}) => {
    if (!producto) return null;

    // const isDeactivate = type === 'deactivate';
    const hasStock = producto.stockActual > 0;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Confirmar desactivación</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de desactivar el producto{" "}
                        <span className="font-semibold text-foreground">
                            "{producto.nombre}"
                        </span>
                        ? No podrá ser utilizado en nuevos movimientos.
                        {hasStock && (
                            <div className="mt-2 p-2 bg-yellow-50 text-yellow-700 rounded">
                                ⚠️ Este producto tiene {producto.stockActual} unidades en stock.
                                Se recomienda realizar una salida de inventario primero.
                            </div>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={hasStock}
                        className="flex-1"
                    >
                        {hasStock ? 'Stock Pendiente' : 'Desactivar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
