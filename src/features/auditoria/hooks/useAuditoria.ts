import { useState, useEffect, useMemo } from 'react';
import api from '@/services/api';
import { toast } from 'react-toastify';
import type { AuditRecord } from '../components/AuditoriaTable';

export const useAuditoria = () => {
    const [auditoria, setAuditoria] = useState<AuditRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTipo, setFilterTipo] = useState<string | undefined>(undefined);
    const [selectedDetalle, setSelectedDetalle] = useState<string>('');
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    // Initial Load
    useEffect(() => {
        cargarAuditoria();
    }, []);

    const cargarAuditoria = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/auditoria');
            // Asegurar que los campos nunca sean null
            const safeData = data.map((record: AuditRecord) => ({
                id: record.id,
                eventoTipo: record.eventoTipo || 'DESCONOCIDO',
                tablaNombre: record.tablaNombre || 'Sin tabla',
                registroId: record.registroId ? String(record.registroId) : 'N/A',
                usuarioId: record.usuarioId ? String(record.usuarioId) : 'ANÓNIMO',
                detalle: record.detalle || '{}',
                createdAt: record.createdAt
            }));
            setAuditoria(safeData);
        } catch (error: any) {
            toast.error('Error cargando auditoría');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter Logic
    const filteredAuditoria = useMemo(() => {
        return auditoria.filter((record) => {
            const matchesSearch =
                searchTerm === '' ||
                record.tablaNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.usuarioId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (record.registroId && record.registroId.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesTipo =
                filterTipo === undefined ||
                record.eventoTipo === filterTipo;

            return matchesSearch && matchesTipo;
        });
    }, [auditoria, searchTerm, filterTipo]);

    // Actions
    const toggleRowExpand = (id: number) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const viewDetalle = (detalle: string) => {
        const safeDetalle = detalle || '{}';
        setSelectedDetalle(safeDetalle);
        setShowDetalleModal(true);
    };

    const closeDetalleModal = () => {
        setShowDetalleModal(false);
        setSelectedDetalle('');
    };

    return {
        // Data
        auditoria: filteredAuditoria,
        totalRegistros: filteredAuditoria.length,
        isLoading,

        // State
        searchTerm,
        setSearchTerm,
        filterTipo,
        setFilterTipo,
        expandedRows,
        selectedDetalle,
        showDetalleModal,

        // Actions
        cargarAuditoria,
        toggleRowExpand,
        viewDetalle,
        closeDetalleModal,
    };
};
