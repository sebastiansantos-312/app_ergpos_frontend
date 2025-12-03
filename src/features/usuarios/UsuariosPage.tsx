import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useUsuarios } from './hooks/useUsuarios';
import { UsuarioHeader } from './components/UsuarioHeader';
import { UsuarioFilters } from './components/UsuarioFilters';
import { UsuarioTable } from './components/UsuarioTable';
import { UsuarioFormDialog } from './components/UsuarioFormDialog';
import { UsuarioActionDialog } from './components/UsuarioActionDialog';

export const UsuariosPage: React.FC = () => {
    const {
        usuarios,
        totalUsuarios,
        isLoading,
        roles,
        currentUser,
        searchTerm,
        setSearchTerm,
        filterActivo,
        setFilterActivo,
        isCreateDialogOpen,
        showConfirmDialog,
        usuarioParaDesactivar,
        handleCreate,
        handleActivate,
        handleDeactivateConfirm,
        openCreate,
        openEdit,
        openDeactivate,
        closeDialogs,
    } = useUsuarios();

    return (
        <AppLayout>
            <div className="space-y-6">
                <UsuarioHeader
                    totalUsuarios={totalUsuarios}
                    onCreate={openCreate}
                />

                <UsuarioFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterActivo={filterActivo}
                    onFilterChange={setFilterActivo}
                />

                <UsuarioTable
                    usuarios={usuarios}
                    isLoading={isLoading}
                    currentUser={currentUser}
                    onEdit={openEdit}
                    onActivate={handleActivate}
                    onDeactivate={openDeactivate}
                />
            </div>

            <UsuarioFormDialog
                isOpen={isCreateDialogOpen}
                onClose={closeDialogs}
                onSubmit={handleCreate}
                roles={roles}
            />

            <UsuarioActionDialog
                isOpen={showConfirmDialog}
                onClose={closeDialogs}
                onConfirm={handleDeactivateConfirm}
                usuario={usuarioParaDesactivar}
            />
        </AppLayout>
    );
};
