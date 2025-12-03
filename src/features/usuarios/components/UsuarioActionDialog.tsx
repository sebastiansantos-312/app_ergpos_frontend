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
import type { UsuarioResponse } from '@/types/usuario';

interface UsuarioActionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    usuario: UsuarioResponse | null;
}

export const UsuarioActionDialog: React.FC<UsuarioActionDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    usuario,
}) => {
    if (!usuario) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Confirmar desactivación</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de desactivar al usuario{" "}
                        <span className="font-semibold text-foreground">
                            "{usuario.nombre}"
                        </span>
                        ? El usuario no podrá acceder al sistema hasta que sea reactivado.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                    >
                        Desactivar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
