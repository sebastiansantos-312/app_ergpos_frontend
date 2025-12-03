import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useMovimientos } from './hooks/useMovimientos';
import { MovimientoHeader } from './components/MovimientoHeader';
import { MovimientoFilters } from './components/MovimientoFilters';
import { MovimientoTable } from './components/MovimientoTable';
import { MovimientoFormDialog } from './components/MovimientoFormDialog';
import { MovimientoActionDialog } from './components/MovimientoActionDialog';

export const MovimientosPage: React.FC = () => {
    const {
        movimientos,
        totalMovimientos,
        isLoading,
        productos,
        usuarios,
        proveedores,
        searchTerm,
        setSearchTerm,
        filterTipo,
        setFilterTipo,
        filterEstado,
        setFilterEstado,
        isCreateDialogOpen,
        showConfirmDialog,
        movimientoParaAnular,
        handleCreate,
        handleActivar,
        handleAnularConfirm,
        openCreate,
        openAnular,
        closeDialogs,
    } = useMovimientos();

    return (
        <AppLayout>
            <div className="space-y-6">
                <MovimientoHeader
                    totalMovimientos={totalMovimientos}
                    onCreate={openCreate}
                />

                <MovimientoFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterTipo={filterTipo}
                    onFilterTipoChange={setFilterTipo}
                    filterEstado={filterEstado}
                    onFilterEstadoChange={setFilterEstado}
                />

                <MovimientoTable
                    movimientos={movimientos}
                    isLoading={isLoading}
                    onActivar={handleActivar}
                    onAnular={openAnular}
                />
            </div>

            <MovimientoFormDialog
                isOpen={isCreateDialogOpen}
                onClose={closeDialogs}
                onSubmit={handleCreate}
                productos={productos}
                usuarios={usuarios}
                proveedores={proveedores}
            />

            <MovimientoActionDialog
                isOpen={showConfirmDialog}
                onClose={closeDialogs}
                onConfirm={handleAnularConfirm}
                movimiento={movimientoParaAnular}
            />
        </AppLayout>
    );
};
