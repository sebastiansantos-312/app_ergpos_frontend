import { useState, useEffect, useMemo } from 'react';
import { useProveedorStore } from '@/stores/proveedorStore';
import type { ProveedorFormData } from '@/schema';
import type { ProveedorResponse } from '@/types/proveedor';
import { toast } from 'react-toastify';

export const useProveedores = () => {
    const {
        proveedores,
        isLoading,
        cargarProveedores,
        crearProveedor,
        actualizarProveedor,
        activarProveedor,
        desactivarProveedor,
    } = useProveedorStore();

    // UI State
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState<ProveedorResponse | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActivo, setFilterActivo] = useState<boolean | undefined>(undefined);
    const [proveedorParaDesactivar, setProveedorParaDesactivar] = useState<ProveedorResponse | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Initial Load
    useEffect(() => {
        cargarProveedores();
    }, [cargarProveedores]);

    // Filter Logic
    const filteredProveedores = useMemo(() => {
        return proveedores.filter((prov) => {
            const matchesSearch =
                searchTerm === '' ||
                prov.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (prov.ruc?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
                (prov.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

            const matchesFilter =
                filterActivo === undefined ||
                prov.activo === filterActivo;

            return matchesSearch && matchesFilter;
        });
    }, [proveedores, searchTerm, filterActivo]);

    // Actions
    const handleCreateOrUpdate = async (data: ProveedorFormData) => {
        try {
            if (proveedorSeleccionado) {
                // Actualizar
                await actualizarProveedor(proveedorSeleccionado.ruc || proveedorSeleccionado.nombre, data);
                toast.success('Proveedor actualizado correctamente');
            } else {
                // Crear
                await crearProveedor(data);
                toast.success('Proveedor creado correctamente');
            }
            await cargarProveedores();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al guardar el proveedor';
            toast.error(message);
            throw error;
        }
    };

    const handleActivate = async (proveedor: ProveedorResponse) => {
        try {
            await activarProveedor(proveedor.ruc || proveedor.nombre);
            toast.success('Proveedor activado');
            await cargarProveedores();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al activar');
        }
    };

    const handleDeactivateConfirm = async () => {
        if (!proveedorParaDesactivar) return;

        try {
            await desactivarProveedor(proveedorParaDesactivar.ruc || proveedorParaDesactivar.nombre);
            toast.success('Proveedor desactivado');
            await cargarProveedores();
            setShowConfirmDialog(false);
            setProveedorParaDesactivar(null);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al desactivar');
        }
    };

    // Dialog Handlers
    const openCreate = () => {
        setProveedorSeleccionado(null);
        setIsCreateDialogOpen(true);
    };

    const openEdit = (proveedor: ProveedorResponse) => {
        setProveedorSeleccionado(proveedor);
        setIsEditDialogOpen(true);
    };

    const openDeactivate = (proveedor: ProveedorResponse) => {
        setProveedorParaDesactivar(proveedor);
        setShowConfirmDialog(true);
    };

    const closeDialogs = () => {
        setIsCreateDialogOpen(false);
        setIsEditDialogOpen(false);
        setShowConfirmDialog(false);
        setProveedorSeleccionado(null);
        setProveedorParaDesactivar(null);
    };

    return {
        // Data
        proveedores: filteredProveedores,
        totalProveedores: filteredProveedores.length,
        isLoading,

        // State
        searchTerm,
        setSearchTerm,
        filterActivo,
        setFilterActivo,
        isCreateDialogOpen,
        isEditDialogOpen,
        showConfirmDialog,
        proveedorSeleccionado,
        proveedorParaDesactivar,

        // Actions
        handleCreateOrUpdate,
        handleActivate,
        handleDeactivateConfirm,
        openCreate,
        openEdit,
        openDeactivate,
        closeDialogs,
    };
};
