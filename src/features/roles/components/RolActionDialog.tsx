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
import type { RolResponse } from '@/types/rol';

interface RolActionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    rol: RolResponse | null;
}

export const RolActionDialog: React.FC<RolActionDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    rol,
}) => {
    if (!rol) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Confirmar desactivación</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de desactivar el rol{" "}
                        <span className="font-semibold text-foreground">
                            "{rol.nombre}"
                        </span>
                        ? Los usuarios con este rol podrían perder permisos.
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
