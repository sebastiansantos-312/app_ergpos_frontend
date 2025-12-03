import React from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { useUsuarioDetail } from './hooks/useUsuarioDetail';
import { UsuarioInfoCard } from './components/UsuarioInfoCard';
import { UsuarioEditDialog } from './components/UsuarioEditDialog';

export const UsuarioDetailPage: React.FC = () => {
    const { email } = useParams<{ email: string }>();
    const {
        usuario,
        isLoading,
        roles,
        isEditDialogOpen,
        handleUpdate,
        openEditDialog,
        closeEditDialog,
    } = useUsuarioDetail(email);

    if (isLoading) {
        return (
            <AppLayout>
                <div className="flex justify-center items-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            </AppLayout>
        );
    }

    if (!usuario) {
        return (
            <AppLayout>
                <div className="text-center py-12">
                    <p className="text-gray-500">Usuario no encontrado</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="space-y-6 max-w-2xl">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{usuario.nombre}</h1>
                        <p className="text-gray-600 mt-1">{usuario.email}</p>
                    </div>
                    <Button
                        onClick={openEditDialog}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Editar Usuario
                    </Button>
                </div>

                <UsuarioInfoCard usuario={usuario} />

                <UsuarioEditDialog
                    isOpen={isEditDialogOpen}
                    onClose={closeEditDialog}
                    usuario={usuario}
                    roles={roles}
                    onSubmit={handleUpdate}
                />
            </div>
        </AppLayout>
    );
};
