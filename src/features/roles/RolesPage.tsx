import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useRoles } from './hooks/useRoles';
import { RolHeader } from './components/RolHeader';
import { RolFilters } from './components/RolFilters';
import { RolTable } from './components/RolTable';
import { RolFormDialog } from './components/RolFormDialog';
import { RolActionDialog } from './components/RolActionDialog';

export const RolesPage: React.FC = () => {
    const {
        roles,
        totalRoles,
        isLoading,
        searchTerm,
        setSearchTerm,
        filterActivo,
        setFilterActivo,
        isCreateDialogOpen,
        isEditDialogOpen,
        showConfirmDialog,
        rolSeleccionado,
        rolParaDesactivar,
        handleCreateOrUpdate,
        handleActivate,
        handleDeactivateConfirm,
        openCreate,
        openEdit,
        openDeactivate,
        closeDialogs,
    } = useRoles();

    return (
        <AppLayout>
            <div className="space-y-6">
                <RolHeader
                    totalRoles={totalRoles}
                    onCreate={openCreate}
                />

                <RolFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterActivo={filterActivo}
                    onFilterChange={setFilterActivo}
                />

                <RolTable
                    roles={roles}
                    isLoading={isLoading}
                    onEdit={openEdit}
                    onActivate={handleActivate}
                    onDeactivate={openDeactivate}
                />
            </div>

            {/* Create Dialog */}
            <RolFormDialog
                isOpen={isCreateDialogOpen}
                onClose={closeDialogs}
                onSubmit={handleCreateOrUpdate}
            />

            {/* Edit Dialog */}
            <RolFormDialog
                isOpen={isEditDialogOpen}
                onClose={closeDialogs}
                rol={rolSeleccionado}
                onSubmit={handleCreateOrUpdate}
            />

            <RolActionDialog
                isOpen={showConfirmDialog}
                onClose={closeDialogs}
                onConfirm={handleDeactivateConfirm}
                rol={rolParaDesactivar}
            />
        </AppLayout>
    );
};
