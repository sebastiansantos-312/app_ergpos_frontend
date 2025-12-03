import { useState, useEffect, useMemo } from 'react';
import { useProductoStore } from '@/stores/productoStore';
import { useCategoriaStore } from '@/stores/categoriaStore';
import { productoService } from '@/services/productoService';
import { handleApiError } from '@/core/errors';
import type { ProductoFormData } from '@/schema';
import type { ProductoRequest, ProductoResponse } from '@/types/producto';
import { toast } from 'react-toastify';

/**
 * useProductos Hook - Business Logic Layer
 * 
 * This hook handles ALL business logic for the productos feature:
 * - API calls
 * - Error handling
 * - Data transformations
 * - UI state management
 * 
 * The store is only used for global state persistence.
 */
export interface UseProductosReturn {
    productos: ProductoResponse[];
    totalProductos: number;
    productosBajoStock: number;
    isLoading: boolean;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterActivo: boolean | undefined;
    setFilterActivo: (active: boolean | undefined) => void;
    isCreateDialogOpen: boolean;
    isEditDialogOpen: boolean;
    showConfirmDialog: boolean;
    productoSeleccionado: ProductoResponse | null;
    productoParaDesactivar: ProductoResponse | null;
    handleCreate: (data: ProductoFormData) => Promise<void>;
    handleUpdate: (data: ProductoFormData) => Promise<void>;
    handleActivate: (producto: ProductoResponse) => Promise<void>;
    handleDeactivateConfirm: () => Promise<void>;
    openCreate: () => void;
    openEdit: (producto: ProductoResponse) => void;
    openDeactivate: (producto: ProductoResponse) => void;
    closeDialogs: () => void;
}

export const useProductos = (): UseProductosReturn => {
    const store = useProductoStore();
    const { cargarCategorias } = useCategoriaStore();

    // UI State
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoResponse | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActivo, setFilterActivo] = useState<boolean | undefined>(undefined);
    const [productoParaDesactivar, setProductoParaDesactivar] = useState<ProductoResponse | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Initial Load
    useEffect(() => {
        cargarProductos();
        cargarCategorias({ activo: true });
    }, []);

    // API Operations
    const cargarProductos = async (): Promise<void> => {
        store.setLoading(true);
        store.clearError();

        try {
            const { productos, total } = await productoService.listarProductos();
            store.setProductos(productos);
            store.setTotal(total);
        } catch (error) {
            const apiError = handleApiError(error);
            store.setError(apiError.message);
            toast.error(apiError.message);
        } finally {
            store.setLoading(false);
        }
    };

    // Filter Logic
    const filteredProductos = useMemo(() => {
        return store.productos.filter((prod) => {
            const matchesSearch =
                searchTerm === '' ||
                prod.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                prod.codigo.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter =
                filterActivo === undefined ||
                prod.activo === filterActivo;

            return matchesSearch && matchesFilter;
        });
    }, [store.productos, searchTerm, filterActivo]);

    const productosBajoStock = useMemo(() =>
        filteredProductos.filter(p => p.stockActual < p.stockMinimo).length,
        [filteredProductos]
    );

    // Actions
    const handleCreate = async (data: ProductoFormData): Promise<void> => {
        store.setLoading(true);
        store.clearError();

        try {
            const productoRequest: ProductoRequest = {
                codigo: data.codigo,
                nombre: data.nombre,
                descripcion: data.descripcion || undefined,
                codigoCategoria: data.codigoCategoria,
                precio: data.precio,
                stockMinimo: data.stockMinimo ?? 0,
                stockActual: data.stockActual ?? 0,
                unidadMedida: data.unidadMedida || 'UNIDAD'
            };

            const nuevoProducto = await productoService.crearProducto(productoRequest);
            store.addProducto(nuevoProducto);
            toast.success('Producto creado correctamente');
            setIsCreateDialogOpen(false);
        } catch (error: any) {
            const apiError = handleApiError(error);
            store.setError(apiError.message);
            toast.error(apiError.message);
            throw error;
        } finally {
            store.setLoading(false);
        }
    };

    const handleUpdate = async (data: ProductoFormData): Promise<void> => {
        if (!productoSeleccionado) return;

        store.setLoading(true);
        store.clearError();

        try {
            const productoRequest: ProductoRequest = {
                codigo: data.codigo,
                nombre: data.nombre,
                descripcion: data.descripcion || undefined,
                codigoCategoria: data.codigoCategoria || '',
                precio: data.precio,
                stockMinimo: data.stockMinimo ?? 0,
                stockActual: data.stockActual ?? 0,
                unidadMedida: data.unidadMedida || 'UNIDAD'
            };

            const productoActualizado = await productoService.actualizarProducto(
                productoSeleccionado.codigo,
                productoRequest
            );

            store.updateProducto(productoSeleccionado.codigo, productoActualizado);
            toast.success('Producto actualizado correctamente');
            setIsEditDialogOpen(false);
        } catch (error: any) {
            const apiError = handleApiError(error);
            store.setError(apiError.message);
            toast.error(apiError.message);
            throw error;
        } finally {
            store.setLoading(false);
        }
    };

    const handleActivate = async (producto: ProductoResponse): Promise<void> => {
        store.setLoading(true);
        store.clearError();

        try {
            const productoActivado = await productoService.activarProducto(producto.codigo);
            store.updateProducto(producto.codigo, productoActivado);
            toast.success('Producto activado');
        } catch (error: any) {
            const apiError = handleApiError(error);
            store.setError(apiError.message);
            toast.error(apiError.message);
        } finally {
            store.setLoading(false);
        }
    };

    const handleDeactivateConfirm = async (): Promise<void> => {
        if (!productoParaDesactivar) return;

        store.setLoading(true);
        store.clearError();

        try {
            const productoDesactivado = await productoService.desactivarProducto(
                productoParaDesactivar.codigo
            );

            store.updateProducto(productoParaDesactivar.codigo, productoDesactivado);
            toast.success('Producto desactivado');
            setShowConfirmDialog(false);
            setProductoParaDesactivar(null);
        } catch (error: any) {
            const apiError = handleApiError(error);
            store.setError(apiError.message);
            toast.error(apiError.message);
        } finally {
            store.setLoading(false);
        }
    };

    // Dialog Handlers
    const openCreate = () => {
        setProductoSeleccionado(null);
        setIsCreateDialogOpen(true);
    };

    const openEdit = (producto: ProductoResponse) => {
        setProductoSeleccionado(producto);
        setIsEditDialogOpen(true);
    };

    const openDeactivate = (producto: ProductoResponse) => {
        setProductoParaDesactivar(producto);
        setShowConfirmDialog(true);
    };

    const closeDialogs = () => {
        setIsCreateDialogOpen(false);
        setIsEditDialogOpen(false);
        setShowConfirmDialog(false);
        setProductoSeleccionado(null);
        setProductoParaDesactivar(null);
    };

    return {
        // Data
        productos: filteredProductos,
        totalProductos: filteredProductos.length,
        productosBajoStock,
        isLoading: store.isLoading,

        // State
        searchTerm,
        setSearchTerm,
        filterActivo,
        setFilterActivo,
        isCreateDialogOpen,
        isEditDialogOpen,
        showConfirmDialog,
        productoSeleccionado,
        productoParaDesactivar,

        // Actions
        handleCreate,
        handleUpdate,
        handleActivate,
        handleDeactivateConfirm,
        openCreate,
        openEdit,
        openDeactivate,
        closeDialogs,
    };
};
