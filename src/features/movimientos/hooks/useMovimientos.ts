import { useState, useEffect, useMemo } from 'react';
import { useMovimientoStore } from '@/stores/movimientoStore';
import { useProductos } from '@/features/productos/hooks/useProductos';
import { useUsuarioStore } from '@/stores/usuarioStore';
import { useProveedorStore } from '@/stores/proveedorStore';
import type { MovimientoFormData } from '@/schema';
import type { MovimientoInventarioResponse } from '@/types/movimiento';
import { toast } from 'react-toastify';

export const useMovimientos = () => {
    const {
        movimientos,
        isLoading,
        cargarMovimientos,
        crearMovimiento,
        anularMovimiento,
        activarMovimiento,
    } = useMovimientoStore();

    const { productos } = useProductos();
    const { usuarios, cargarUsuarios } = useUsuarioStore();
    const { proveedores, cargarProveedores } = useProveedorStore();

    // UI State
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTipo, setFilterTipo] = useState<string | undefined>(undefined);
    const [filterEstado, setFilterEstado] = useState<string | undefined>(undefined);
    const [movimientoParaAnular, setMovimientoParaAnular] = useState<MovimientoInventarioResponse | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Initial Load
    useEffect(() => {
        cargarMovimientos();
        // cargarProductos is handled by useProductos hook
        cargarUsuarios({ activo: true });
        cargarProveedores({ activo: true });
    }, []);

    // Filter Logic
    const filteredMovimientos = useMemo(() => {
        return movimientos.filter((mov) => {
            const matchesSearch =
                searchTerm === '' ||
                mov.codigoProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                mov.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                mov.usuarioNombre.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesTipo =
                filterTipo === undefined ||
                mov.tipo === filterTipo;

            const matchesEstado =
                filterEstado === undefined ||
                mov.estado === filterEstado;

            return matchesSearch && matchesTipo && matchesEstado;
        });
    }, [movimientos, searchTerm, filterTipo, filterEstado]);

    // Actions
    const handleCreate = async (formData: MovimientoFormData) => {
        // Validar stock para salidas
        if (formData.tipo === 'SALIDA' && formData.estado !== 'PENDIENTE') {
            const producto = productos.find(p => p.codigo === formData.codigoProducto);
            if (producto && producto.stockActual < formData.cantidad) {
                toast.error(`Stock insuficiente. Disponible: ${producto.stockActual}, Solicitado: ${formData.cantidad}`);
                return;
            }
        }

        try {
            const data: MovimientoFormData = {
                ...formData,
                estado: formData.estado || 'ACTIVO',
                costoUnitario: formData.costoUnitario || 0,
            };

            await crearMovimiento(data);
            toast.success('Movimiento creado correctamente');
            await cargarMovimientos();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al crear el movimiento';
            toast.error(message);
            throw error;
        }
    };

    const handleActivar = async (movimiento: MovimientoInventarioResponse) => {
        try {
            await activarMovimiento(movimiento.id);
            toast.success('Movimiento activado');
            await cargarMovimientos();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al activar');
        }
    };

    const handleAnularConfirm = async () => {
        if (!movimientoParaAnular) return;
        try {
            await anularMovimiento(movimientoParaAnular.id);
            toast.success('Movimiento anulado');
            await cargarMovimientos();
            setShowConfirmDialog(false);
            setMovimientoParaAnular(null);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al anular');
        }
    };

    // Dialog Handlers
    const openCreate = () => setIsCreateDialogOpen(true);

    const openAnular = (movimiento: MovimientoInventarioResponse) => {
        setMovimientoParaAnular(movimiento);
        setShowConfirmDialog(true);
    };

    const closeDialogs = () => {
        setIsCreateDialogOpen(false);
        setShowConfirmDialog(false);
        setMovimientoParaAnular(null);
    };

    return {
        // Data
        movimientos: filteredMovimientos,
        totalMovimientos: filteredMovimientos.length,
        isLoading,
        productos,
        usuarios,
        proveedores,

        // State
        searchTerm,
        setSearchTerm,
        filterTipo,
        setFilterTipo,
        filterEstado,
        setFilterEstado,
        isCreateDialogOpen,
        showConfirmDialog,
        movimientoParaAnular,

        // Actions
        handleCreate,
        handleActivar,
        handleAnularConfirm,
        openCreate,
        openAnular,
        closeDialogs,
    };
};
