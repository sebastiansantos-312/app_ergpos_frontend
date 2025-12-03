import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { usePerfil } from './hooks/usePerfil';
import { PerfilInfoCard } from './components/PerfilInfoCard';
import { ModulosCard } from './components/ModulosCard';
import { PasswordCard } from './components/PasswordCard';

export const PerfilPage: React.FC = () => {
    const {
        user,
        isEditingPassword,
        isLoadingPassword,
        setIsEditingPassword,
        handlePasswordSubmit,
    } = usePerfil();

    if (!user) {
        return <div>No autenticado</div>;
    }

    return (
        <AppLayout>
            <div className="space-y-6 max-w-4xl">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
                    <p className="text-gray-600 mt-2">Gestiona tu información personal y seguridad</p>
                </div>

                <PerfilInfoCard user={user} />

                <ModulosCard modules={user.modules} />

                <PasswordCard
                    isEditing={isEditingPassword}
                    isLoading={isLoadingPassword}
                    onStartEdit={() => setIsEditingPassword(true)}
                    onCancelEdit={() => setIsEditingPassword(false)}
                    onSubmit={handlePasswordSubmit}
                />
            </div>
        </AppLayout>
    );
};
