import { useState, useEffect, useMemo } from 'react';
import { useRolStore } from '@/stores/rolStore';
import type { RolFormData } from '@/schema';
import type { RolResponse } from '@/types/rol';
import { toast } from 'react-toastify';

export const useRoles = () => {
    const {
        roles,
        isLoading,
        cargarRoles,
        crearRol,
        actualizarRol,
        activarRol,
        desactivarRol,
    } = useRolStore();

    // UI State
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [rolSeleccionado, setRolSeleccionado] = useState<RolResponse | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActivo, setFilterActivo] = useState<boolean | undefined>(undefined);
    const [rolParaDesactivar, setRolParaDesactivar] = useState<RolResponse | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Initial Load
    useEffect(() => {
        cargarRoles();
    }, [cargarRoles]);

    // Filter Logic
    const filteredRoles = useMemo(() => {
        return roles.filter((rol) => {
            const matchesSearch =
                searchTerm === '' ||
                rol.nombre.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter =
                filterActivo === undefined ||
                rol.activo === filterActivo;

            return matchesSearch && matchesFilter;
        });
    }, [roles, searchTerm, filterActivo]);

    // Actions
    const handleCreateOrUpdate = async (data: RolFormData) => {
        try {
            if (rolSeleccionado) {
                // Actualizar
                await actualizarRol(rolSeleccionado.nombre, data);
                toast.success('Rol actualizado correctamente');
            } else {
                // Crear
                await crearRol(data);
                toast.success('Rol creado correctamente');
            }
            await cargarRoles();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al guardar el rol';
            toast.error(message);
            throw error;
        }
    };

    const handleActivate = async (rol: RolResponse) => {
        try {
            await activarRol(rol.nombre);
            toast.success('Rol activado');
            await cargarRoles();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al activar';
            toast.error(message);
        }
    };

    const handleDeactivateConfirm = async () => {
        if (!rolParaDesactivar) return;

        try {
            await desactivarRol(rolParaDesactivar.nombre);
            toast.success('Rol desactivado');
            await cargarRoles();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al desactivar';
            toast.error(message);
        } finally {
            setShowConfirmDialog(false);
            setRolParaDesactivar(null);
        }
    };

    // Dialog Handlers
    const openCreate = () => {
        setRolSeleccionado(null);
        setIsCreateDialogOpen(true);
    };

    const openEdit = (rol: RolResponse) => {
        setRolSeleccionado(rol);
        setIsEditDialogOpen(true);
    };

    const openDeactivate = (rol: RolResponse) => {
        setRolParaDesactivar(rol);
        setShowConfirmDialog(true);
    };

    const closeDialogs = () => {
        setIsCreateDialogOpen(false);
        setIsEditDialogOpen(false);
        setShowConfirmDialog(false);
        setRolSeleccionado(null);
        setRolParaDesactivar(null);
    };

    return {
        // Data
        roles: filteredRoles,
        totalRoles: filteredRoles.length,
        isLoading,

        // State
        searchTerm,
        setSearchTerm,
        filterActivo,
        setFilterActivo,
        isCreateDialogOpen,
        isEditDialogOpen,
        showConfirmDialog,
        rolSeleccionado,
        rolParaDesactivar,

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
