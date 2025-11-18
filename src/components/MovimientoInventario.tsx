// components/MovimientoInventario.tsx - CORREGIDO
import React, { useState, useEffect } from 'react';
import { movimientoService } from '../services/movimientoService';
import { productoService } from '../services/productoService';
import type { MovimientoInventarioRequestDTO, MovimientoInventarioResponseDTO } from '../types/movimiento';
import type { ProductoResponseDTO } from '../types/producto';

const MovimientoInventario: React.FC = () => {
    const [movimientos, setMovimientos] = useState<MovimientoInventarioResponseDTO[]>([]);
    const [productos, setProductos] = useState<ProductoResponseDTO[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [filterProducto, setFilterProducto] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<MovimientoInventarioRequestDTO>({
        codigoProducto: '',
        cantidad: 0,
        tipo: 'ENTRADA',
        proveedor: '',
        observacion: '',
    });

    useEffect(() => {
        loadMovimientos();
        loadProductos();
    }, []);

    useEffect(() => {
        if (filterProducto) {
            loadMovimientosPorProducto(filterProducto);
        } else {
            loadMovimientos();
        }
    }, [filterProducto]);

    const loadMovimientos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await movimientoService.listarTodos();
            setMovimientos(data);
        } catch (error: any) {
            console.error('Error loading movimientos:', error);
            setError(error.response?.data?.message || 'Error al cargar movimientos');
        } finally {
            setLoading(false);
        }
    };

    const loadMovimientosPorProducto = async (codigo: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await movimientoService.listarPorProducto(codigo);
            setMovimientos(data);
        } catch (error: any) {
            console.error('Error loading movimientos by product:', error);
            setError(error.response?.data?.message || 'Error al cargar movimientos del producto');
        } finally {
            setLoading(false);
        }
    };

    const loadProductos = async () => {
        try {
            const data = await productoService.listarProductos(true);
            setProductos(data);
        } catch (error) {
            console.error('Error loading productos:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError(null);
            await movimientoService.registrarMovimiento(formData);
            resetForm();
            if (filterProducto) {
                loadMovimientosPorProducto(filterProducto);
            } else {
                loadMovimientos();
            }
            alert('Movimiento registrado exitosamente');
        } catch (error: any) {
            console.error('Error registering movimiento:', error);
            setError(error.response?.data?.message || 'Error al registrar movimiento');
        }
    };

    const resetForm = () => {
        setFormData({
            codigoProducto: '',
            cantidad: 0,
            tipo: 'ENTRADA',
            proveedor: '',
            observacion: '',
        });
        setShowForm(false);
        setError(null);
    };

    const getTipoColor = (tipo: string) => {
        return tipo === 'ENTRADA' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Movimientos de Inventario</h1>

            {/* Mostrar error general */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong>Error: </strong> {error}
                    <button
                        onClick={() => setError(null)}
                        className="float-right font-bold"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Filtros y controles */}
            <div className="mb-4 flex gap-4 items-center">
                <div>
                    <label className="block text-sm font-medium mb-1">Filtrar por Producto</label>
                    <select
                        value={filterProducto}
                        onChange={(e) => setFilterProducto(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="">Todos los productos</option>
                        {productos.map((producto) => (
                            <option key={producto.codigo} value={producto.codigo}>
                                {producto.codigo} - {producto.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded mt-6"
                    disabled={loading}
                >
                    {loading ? 'Cargando...' : 'Nuevo Movimiento'}
                </button>
                <button
                    onClick={loadMovimientos}
                    className="px-4 py-2 bg-gray-500 text-white rounded mt-6"
                    disabled={loading}
                >
                    Actualizar
                </button>
            </div>

            {/* Formulario de movimiento */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 max-h-screen overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Registrar Movimiento</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Producto *</label>
                                <select
                                    value={formData.codigoProducto}
                                    onChange={(e) => setFormData({ ...formData, codigoProducto: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="">Seleccionar producto</option>
                                    {productos.map((producto) => (
                                        <option key={producto.codigo} value={producto.codigo}>
                                            {producto.codigo} - {producto.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Cantidad *</label>
                                <input
                                    type="number"
                                    value={formData.cantidad}
                                    onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value) || 0 })}
                                    className="w-full p-2 border rounded"
                                    required
                                    min="1"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Tipo *</label>
                                <select
                                    value={formData.tipo}
                                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'ENTRADA' | 'SALIDA' })}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="ENTRADA">Entrada</option>
                                    <option value="SALIDA">Salida</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Proveedor</label>
                                <input
                                    type="text"
                                    value={formData.proveedor}
                                    onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Observación</label>
                                <textarea
                                    value={formData.observacion}
                                    onChange={(e) => setFormData({ ...formData, observacion: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded"
                                    disabled={loading}
                                >
                                    {loading ? 'Registrando...' : 'Registrar'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 bg-gray-500 text-white rounded"
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Estado de carga */}
            {loading && (
                <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2">Cargando movimientos...</p>
                </div>
            )}

            {/* Tabla de movimientos */}
            {!loading && (
                <div className="bg-white shadow-md rounded">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 text-left">Producto</th>
                                <th className="py-2 px-4 text-left">Cantidad</th>
                                <th className="py-2 px-4 text-left">Tipo</th>
                                <th className="py-2 px-4 text-left">Proveedor</th>
                                <th className="py-2 px-4 text-left">Observación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimientos.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-4 px-4 text-center text-gray-500">
                                        No hay movimientos registrados
                                    </td>
                                </tr>
                            ) : (
                                movimientos.map((movimiento, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="py-2 px-4">
                                            <div>
                                                <div className="font-medium">{movimiento.codigoProducto}</div>
                                                <div className="text-sm text-gray-600">{movimiento.nombreProducto}</div>
                                            </div>
                                        </td>
                                        <td className="py-2 px-4">{movimiento.cantidad}</td>
                                        <td className="py-2 px-4">
                                            <span className={`px-2 py-1 rounded text-xs ${getTipoColor(movimiento.tipo)}`}>
                                                {movimiento.tipo}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4">{movimiento.proveedor || '-'}</td>
                                        <td className="py-2 px-4">{movimiento.observacion || '-'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MovimientoInventario;