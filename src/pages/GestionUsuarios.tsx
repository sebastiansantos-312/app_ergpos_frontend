import React, { useState, useEffect } from 'react';


interface Producto {
  id?: string; 
  codigo: string;
  nombre: string;
  cantidad: number;
  precio: number;
  stock: number;
  proveedor: string;
  fechaEntrada?: string;
}

const initialState: Producto = {
  codigo: '',
  nombre: '',
  cantidad: 0,
  precio: 0,
  stock: 0,
  proveedor: '',
};

const GestionProductos: React.FC = () => {
 
  const [productos, setProductos] = useState<Producto[]>([]);
  const [newProducto, setNewProducto] = useState<Producto>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/productos`);
        if (!response.ok) {
          throw new Error('No se pudieron cargar los productos.');
        }
        const data: Producto[] = await response.json();
        setProductos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductos();
  }, []); 


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProducto(prevState => ({
      ...prevState,
      [name]: name === 'cantidad' || name === 'precio' || name === 'stock' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProducto),
      });

      if (!response.ok) {
        throw new Error('Error al registrar el producto.');
      }

      const productoGuardado: Producto = await response.json();
      
     
      setProductos(prevProductos => [...prevProductos, productoGuardado]);
      setNewProducto(initialState);
      alert('Producto registrado con éxito!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };


  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800">Gestión de Inventario</h1>
      
    
      <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-xl font-semibold">Registrar Entrada de Producto</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          <input name="codigo" value={newProducto.codigo} onChange={handleInputChange} placeholder="Código del Producto" required className="rounded-md border-gray-300 shadow-sm" />
          <input name="nombre" value={newProducto.nombre} onChange={handleInputChange} placeholder="Nombre del Producto" required className="rounded-md border-gray-300 shadow-sm" />
          <input name="cantidad" type="number" value={newProducto.cantidad} onChange={handleInputChange} placeholder="Cantidad" required className="rounded-md border-gray-300 shadow-sm" />
          <input name="stock" type="number" value={newProducto.stock} onChange={handleInputChange} placeholder="Stock Inicial" required className="rounded-md border-gray-300 shadow-sm" />
          <input name="precio" type="number" step="0.01" value={newProducto.precio} onChange={handleInputChange} placeholder="Precio" required className="rounded-md border-gray-300 shadow-sm" />
          <input name="proveedor" value={newProducto.proveedor} onChange={handleInputChange} placeholder="Proveedor" className="rounded-md border-gray-300 shadow-sm" />
          <button type="submit" className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 md:col-span-2">Registrar Producto</button>
        </form>
      </div>

      
      <div className="mt-8 overflow-x-auto rounded-lg bg-white shadow-md">
        <h2 className="p-6 text-xl font-semibold">Listado de Productos</h2>
        {isLoading ? <p className="p-6">Cargando productos...</p> : error ? <p className="p-6 text-red-500">{error}</p> : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Precio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {productos.map(producto => (
                <tr key={producto.id || producto.codigo}>
                  <td className="whitespace-nowrap px-6 py-4">{producto.codigo}</td>
                  <td className="whitespace-nowrap px-6 py-4">{producto.nombre}</td>
                  <td className="whitespace-nowrap px-6 py-4">{producto.stock}</td>
                  <td className="whitespace-nowrap px-6 py-4">${producto.precio.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GestionProductos;