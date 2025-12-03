import { useState, useEffect, useMemo } from 'react';
import { useCategoriaStore } from '@/stores/categoriaStore';
import type { CategoriaFormData } from '@/schema';
import type { CategoriaResponse } from '@/types/categoria';
import { toast } from 'react-toastify';

export const useCategorias = () => {
    const {
        categorias,
        isLoading,
        cargarCategorias,
        crearCategoria,
        actualizarCategoria,
        activarCategoria,
        desactivarCategoria,
    } = useCategoriaStore();

    // UI State
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaResponse | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActivo, setFilterActivo] = useState<boolean | undefined>(undefined);
    const [categoriaParaDesactivar, setCategoriaParaDesactivar] = useState<CategoriaResponse | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Initial Load
    useEffect(() => {
        cargarCategorias();
    }, [cargarCategorias]);

    // Filter Logic
    const filteredCategorias = useMemo(() => {
        return categorias.filter((cat) => {
            const matchesSearch =
                searchTerm === '' ||
                cat.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (cat.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

            const matchesFilter =
                filterActivo === undefined ||
                cat.activo === filterActivo;

            return matchesSearch && matchesFilter;
        });
    }, [categorias, searchTerm, filterActivo]);

    // Actions
    const handleCreateOrUpdate = async (data: CategoriaFormData) => {
        try {
            if (categoriaSeleccionada) {
                await actualizarCategoria(categoriaSeleccionada.id, data);
                toast.success('Categoría actualizada correctamente');
            } else {
                await crearCategoria(data);
                toast.success('Categoría creada correctamente');
            }
            await cargarCategorias();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al guardar la categoría';
            toast.error(message);
            throw error;
        }
    };

    const handleActivate = async (categoria: CategoriaResponse) => {
        try {
            await activarCategoria(categoria.id);
            toast.success('Categoría activada');
            await cargarCategorias();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al activar';
            toast.error(message);
        }
    };

    const handleDeactivateConfirm = async () => {
        if (!categoriaParaDesactivar) return;

        try {
            await desactivarCategoria(categoriaParaDesactivar.id);
            toast.success('Categoría desactivada');
            await cargarCategorias();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al desactivar';
            toast.error(message);
        } finally {
            setShowConfirmDialog(false);
            setCategoriaParaDesactivar(null);
        }
    };

    // Dialog Handlers
    const openCreate = () => {
        setCategoriaSeleccionada(null);
        setIsCreateDialogOpen(true);
    };

    const openEdit = (categoria: CategoriaResponse) => {
        setCategoriaSeleccionada(categoria);
        setIsEditDialogOpen(true);
    };

    const openDeactivate = (categoria: CategoriaResponse) => {
        setCategoriaParaDesactivar(categoria);
        setShowConfirmDialog(true);
    };

    const closeDialogs = () => {
        setIsCreateDialogOpen(false);
        setIsEditDialogOpen(false);
        setShowConfirmDialog(false);
        setCategoriaSeleccionada(null);
        setCategoriaParaDesactivar(null);
    };

    return {
        // Data
        categorias: filteredCategorias,
        totalCategorias: filteredCategorias.length,
        isLoading,

        // State
        searchTerm,
        setSearchTerm,
        filterActivo,
        setFilterActivo,
        isCreateDialogOpen,
        isEditDialogOpen,
        showConfirmDialog,
        categoriaSeleccionada,
        categoriaParaDesactivar,

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
