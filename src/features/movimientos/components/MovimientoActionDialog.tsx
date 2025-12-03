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
import type { MovimientoInventarioResponse } from '@/types/movimiento';

interface MovimientoActionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    movimiento: MovimientoInventarioResponse | null;
}

export const MovimientoActionDialog: React.FC<MovimientoActionDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    movimiento,
}) => {
    if (!movimiento) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Confirmar anulación</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de anular el movimiento del producto{" "}
                        <span className="font-semibold text-foreground">
                            "{movimiento.nombreProducto}"
                        </span>
                        ? Esta acción afectará el stock y no se puede deshacer.
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
                        className="flex-1"
                    >
                        Anular
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
