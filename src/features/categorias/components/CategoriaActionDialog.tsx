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
import type { CategoriaResponse } from '@/types/categoria';

interface CategoriaActionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    categoria: CategoriaResponse | null;
}

export const CategoriaActionDialog: React.FC<CategoriaActionDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    categoria,
}) => {
    if (!categoria) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Confirmar desactivación</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de desactivar la categoría{" "}
                        <span className="font-semibold text-foreground">
                            "{categoria.nombre}"
                        </span>
                        ? Los productos asociados podrían verse afectados.
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
