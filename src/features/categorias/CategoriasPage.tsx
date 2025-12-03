import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useCategorias } from './hooks/useCategorias';
import { CategoriaHeader } from './components/CategoriaHeader';
import { CategoriaFilters } from './components/CategoriaFilters';
import { CategoriaTable } from './components/CategoriaTable';
import { CategoriaFormDialog } from './components/CategoriaFormDialog';
import { CategoriaActionDialog } from './components/CategoriaActionDialog';

export const CategoriasPage: React.FC = () => {
    const {
        categorias,
        totalCategorias,
        isLoading,
        searchTerm,
        setSearchTerm,
        filterActivo,
        setFilterActivo,
        isCreateDialogOpen,
        isEditDialogOpen,
        showConfirmDialog,
        categoriaSeleccionada,
        categoriaParaDesactivar,
        handleCreateOrUpdate,
        handleActivate,
        handleDeactivateConfirm,
        openCreate,
        openEdit,
        openDeactivate,
        closeDialogs,
    } = useCategorias();

    return (
        <AppLayout>
            <div className="space-y-6">
                <CategoriaHeader
                    totalCategorias={totalCategorias}
                    onCreate={openCreate}
                />

                <CategoriaFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterActivo={filterActivo}
                    onFilterChange={setFilterActivo}
                />

                <CategoriaTable
                    categorias={categorias}
                    isLoading={isLoading}
                    onEdit={openEdit}
                    onActivate={handleActivate}
                    onDeactivate={openDeactivate}
                />
            </div>

            {/* Create Dialog */}
            <CategoriaFormDialog
                isOpen={isCreateDialogOpen}
                onClose={closeDialogs}
                onSubmit={handleCreateOrUpdate}
            />

            {/* Edit Dialog */}
            <CategoriaFormDialog
                isOpen={isEditDialogOpen}
                onClose={closeDialogs}
                categoria={categoriaSeleccionada}
                onSubmit={handleCreateOrUpdate}
            />

            <CategoriaActionDialog
                isOpen={showConfirmDialog}
                onClose={closeDialogs}
                onConfirm={handleDeactivateConfirm}
                categoria={categoriaParaDesactivar}
            />
        </AppLayout>
    );
};
