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
import type { ProveedorResponse } from '@/types/proveedor';

interface ProveedorActionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    proveedor: ProveedorResponse | null;
}

export const ProveedorActionDialog: React.FC<ProveedorActionDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    proveedor,
}) => {
    if (!proveedor) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Confirmar desactivación</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de desactivar al proveedor{" "}
                        <span className="font-semibold text-foreground">
                            "{proveedor.nombre}"
                        </span>
                        ? No podrá ser utilizado en nuevos movimientos de entrada.
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
                        Desactivar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
