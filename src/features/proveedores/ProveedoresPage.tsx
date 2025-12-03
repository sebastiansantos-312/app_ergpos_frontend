import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useProveedores } from './hooks/useProveedores';
import { ProveedorHeader } from './components/ProveedorHeader';
import { ProveedorFilters } from './components/ProveedorFilters';
import { ProveedorTable } from './components/ProveedorTable';
import { ProveedorFormDialog } from './components/ProveedorFormDialog';
import { ProveedorActionDialog } from './components/ProveedorActionDialog';

export const ProveedoresPage: React.FC = () => {
    const {
        proveedores,
        totalProveedores,
        isLoading,
        searchTerm,
        setSearchTerm,
        filterActivo,
        setFilterActivo,
        isCreateDialogOpen,
        isEditDialogOpen,
        showConfirmDialog,
        proveedorSeleccionado,
        proveedorParaDesactivar,
        handleCreateOrUpdate,
        handleActivate,
        handleDeactivateConfirm,
        openCreate,
        openEdit,
        openDeactivate,
        closeDialogs,
    } = useProveedores();

    return (
        <AppLayout>
            <div className="space-y-6">
                <ProveedorHeader
                    totalProveedores={totalProveedores}
                    onCreate={openCreate}
                />

                <ProveedorFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterActivo={filterActivo}
                    onFilterChange={setFilterActivo}
                />

                <ProveedorTable
                    proveedores={proveedores}
                    isLoading={isLoading}
                    onEdit={openEdit}
                    onActivate={handleActivate}
                    onDeactivate={openDeactivate}
                />
            </div>

            {/* Create Dialog */}
            <ProveedorFormDialog
                isOpen={isCreateDialogOpen}
                onClose={closeDialogs}
                onSubmit={handleCreateOrUpdate}
            />

            {/* Edit Dialog */}
            <ProveedorFormDialog
                isOpen={isEditDialogOpen}
                onClose={closeDialogs}
                proveedor={proveedorSeleccionado}
                onSubmit={handleCreateOrUpdate}
            />

            <ProveedorActionDialog
                isOpen={showConfirmDialog}
                onClose={closeDialogs}
                onConfirm={handleDeactivateConfirm}
                proveedor={proveedorParaDesactivar}
            />
        </AppLayout>
    );
};
