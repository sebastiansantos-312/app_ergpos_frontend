import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useAuditoria } from './hooks/useAuditoria';
import { AuditoriaHeader } from './components/AuditoriaHeader';
import { AuditoriaFilters } from './components/AuditoriaFilters';
import { AuditoriaTable } from './components/AuditoriaTable';
import { DetalleModal } from './components/DetalleModal';

export const AuditoriaPage: React.FC = () => {
    const {
        auditoria,
        totalRegistros,
        isLoading,
        searchTerm,
        setSearchTerm,
        filterTipo,
        setFilterTipo,
        expandedRows,
        selectedDetalle,
        showDetalleModal,
        cargarAuditoria,
        toggleRowExpand,
        viewDetalle,
        closeDetalleModal,
    } = useAuditoria();

    return (
        <AppLayout>
            <div className="space-y-6">
                <AuditoriaHeader totalRegistros={totalRegistros} />

                <AuditoriaFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterTipo={filterTipo}
                    onFilterChange={setFilterTipo}
                    onRefresh={cargarAuditoria}
                />

                <AuditoriaTable
                    auditoria={auditoria}
                    isLoading={isLoading}
                    expandedRows={expandedRows}
                    onToggleExpand={toggleRowExpand}
                    onViewDetalle={viewDetalle}
                />
            </div>

            <DetalleModal
                detalle={selectedDetalle}
                isOpen={showDetalleModal}
                onClose={closeDetalleModal}
            />
        </AppLayout>
    );
};
