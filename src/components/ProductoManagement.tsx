// components/ProductoManagement.tsx
import React, { useState, useEffect } from 'react';
import { productoService } from '../services/productoService';
import type { ProductoRequestDTO, ProductoResponseDTO } from '../types/producto';

const ProductoManagement: React.FC = () => {
    const [productos, setProductos] = useState<ProductoResponseDTO[]>([]);
    const [filterActivo, setFilterActivo] = useState<boolean | undefined>(undefined);
    const [showForm, setShowForm] = useState(false);
    const [editingProducto, setEditingProducto] = useState<ProductoResponseDTO | null>(null);
    const [formData, setFormData] = useState<ProductoRequestDTO>({
        codigo: '',
        nombre: '',
        descripcion: '',
        precio: 0,
    });

    useEffect(() => {
        loadProductos();
    }, [filterActivo]);

    const loadProductos = async () => {
        try {
            const data = await productoService.listarProductos(filterActivo);
            setProductos(data);
        } catch (error) {
            console.error('Error loading productos:', error);
            alert('Error al cargar productos');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProducto) {
                await productoService.actualizarProducto(editingProducto.codigo, formData);
            } else {
                await productoService.crearProducto(formData);
            }
            resetForm();
            loadProductos();
            alert('Producto guardado exitosamente');
        } catch (error: any) {
            console.error('Error saving producto:', error);
            alert(error.response?.data?.message || 'Error al guardar producto');
        }
    };

    const handleEdit = (producto: ProductoResponseDTO) => {
        setEditingProducto(producto);
        setFormData({
            codigo: producto.codigo,
            nombre: producto.nombre,
            descripcion: producto.descripcion || '',
            precio: producto.precio,
        });
        setShowForm(true);
    };

    const handleStatusChange = async (codigo: string, activar: boolean) => {
        try {
            if (activar) {
                await productoService.activarProducto(codigo);
            } else {
                await productoService.desactivarProducto(codigo);
            }
            loadProductos();
            alert(`Producto ${activar ? 'activado' : 'desactivado'} exitosamente`);
        } catch (error) {
            console.error('Error changing status:', error);
            alert('Error al cambiar estado del producto');
        }
    };

    const resetForm = () => {
        setFormData({ codigo: '', nombre: '', descripcion: '', precio: 0 });
        setEditingProducto(null);
        setShowForm(false);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>

            {/* Filtros */}
            <div className="mb-4 flex gap-4">
                <button
                    onClick={() => setFilterActivo(undefined)}
                    className={`px-4 py-2 rounded ${filterActivo === undefined ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                >
                    Todos
                </button>
                <button
                    onClick={() => setFilterActivo(true)}
                    className={`px-4 py-2 rounded ${filterActivo === true ? 'bg-green-500 text-white' : 'bg-gray-200'
                        }`}
                >
                    Activos
                </button>
                <button
                    onClick={() => setFilterActivo(false)}
                    className={`px-4 py-2 rounded ${filterActivo === false ? 'bg-red-500 text-white' : 'bg-gray-200'
                        }`}
                >
                    Inactivos
                </button>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded ml-auto"
                >
                    Nuevo Producto
                </button>
            </div>

            {/* Formulario */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">
                            {editingProducto ? 'Editar Producto' : 'Nuevo Producto'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Código</label>
                                <input
                                    type="text"
                                    value={formData.codigo}
                                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                    disabled={!!editingProducto}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Nombre</label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Descripción</label>
                                <textarea
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    rows={3}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Precio</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.precio}
                                    onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                                    Guardar
                                </button>
                                <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-500 text-white rounded">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tabla de productos */}
            <div className="bg-white shadow-md rounded">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 text-left">Código</th>
                            <th className="py-2 px-4 text-left">Nombre</th>
                            <th className="py-2 px-4 text-left">Precio</th>
                            <th className="py-2 px-4 text-left">Estado</th>
                            <th className="py-2 px-4 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.codigo} className="border-b">
                                <td className="py-2 px-4">{producto.codigo}</td>
                                <td className="py-2 px-4">{producto.nombre}</td>
                                <td className="py-2 px-4">${producto.precio.toFixed(2)}</td>
                                <td className="py-2 px-4">
                                    <span className={`px-2 py-1 rounded text-xs ${producto.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {producto.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="py-2 px-4">
                                    <button
                                        onClick={() => handleEdit(producto)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm mr-2"
                                    >
                                        Editar
                                    </button>
                                    {producto.activo ? (
                                        <button
                                            onClick={() => handleStatusChange(producto.codigo, false)}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                                        >
                                            Desactivar
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleStatusChange(producto.codigo, true)}
                                            className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                                        >
                                            Activar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductoManagement;