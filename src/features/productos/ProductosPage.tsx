import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useProductos } from './hooks/useProductos';
import { ProductoHeader } from './components/ProductoHeader';
import { ProductoFilters } from './components/ProductoFilters';
import { ProductoTable } from './components/ProductoTable';
import { ProductoFormDialog } from './components/ProductoFormDialog';
import { ProductoActionDialog } from './components/ProductoActionDialog';

export const ProductosPage: React.FC = () => {
    const {
        productos,
        totalProductos,
        productosBajoStock,
        isLoading,
        searchTerm,
        setSearchTerm,
        filterActivo,
        setFilterActivo,
        isCreateDialogOpen,
        isEditDialogOpen,
        showConfirmDialog,
        productoSeleccionado,
        productoParaDesactivar,
        handleCreate,
        handleUpdate,
        handleActivate,
        handleDeactivateConfirm,
        openCreate,
        openEdit,
        openDeactivate,
        closeDialogs,
    } = useProductos();

    return (
        <AppLayout>
            <div className="space-y-6">
                <ProductoHeader
                    totalProductos={totalProductos}
                    productosBajoStock={productosBajoStock}
                    onCreate={openCreate}
                />

                <ProductoFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterActivo={filterActivo}
                    onFilterChange={setFilterActivo}
                />

                <ProductoTable
                    productos={productos}
                    isLoading={isLoading}
                    onEdit={openEdit}
                    onActivate={handleActivate}
                    onDeactivate={openDeactivate}
                />
            </div>

            <ProductoFormDialog
                isOpen={isCreateDialogOpen}
                onClose={closeDialogs}
                onSubmit={handleCreate}
            />

            <ProductoFormDialog
                isOpen={isEditDialogOpen}
                onClose={closeDialogs}
                producto={productoSeleccionado}
                onSubmit={handleUpdate}
            />

            <ProductoActionDialog
                isOpen={showConfirmDialog}
                onClose={closeDialogs}
                onConfirm={handleDeactivateConfirm}
                producto={productoParaDesactivar}
                type="deactivate"
            />
        </AppLayout>
    );
};
