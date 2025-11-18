// DashboardPage.tsx - CORREGIDO
import React, { useState, useEffect } from 'react';
import { usuarioService } from '../services/usuarioService';
import { rolService } from '../services/rolService';
import { productoService } from '../services/productoService';
import type { UsuarioResponseDTO } from '../types/usuario/usuario';
//import type { RolResponseDTO } from '../types/rol/rol';
import type { ProductoResponseDTO } from '../types/producto';
import { Link } from 'react-router-dom';
import { Layout } from '../components/shared/Layout';

export const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState({
        totalUsuarios: 0,
        usuariosActivos: 0,
        usuariosInactivos: 0,
        totalRoles: 0,
        rolesActivos: 0,
        totalProductos: 0,
        productosActivos: 0,
        productosInactivos: 0,
    });

    const [recentUsuarios, setRecentUsuarios] = useState<UsuarioResponseDTO[]>([]);
    const [recentProductos, setRecentProductos] = useState<ProductoResponseDTO[]>([]);
    //const [availableRoles, setAvailableRoles] = useState<RolResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Cargar datos en paralelo
            const [
                usuariosTodos,
                usuariosActivos,
                usuariosInactivos,
                rolesActivos,
                productosRecientes,
                estadisticasProductos
            ] = await Promise.all([
                usuarioService.listarTodos(),
                usuarioService.listarActivos(),
                usuarioService.listarInactivos(),
                rolService.listarActivos(),
                productoService.productosRecientes(),
                productoService.obtenerEstadisticas()
            ]);

            setStats({
                totalUsuarios: usuariosTodos.length,
                usuariosActivos: usuariosActivos.length,
                usuariosInactivos: usuariosInactivos.length,
                totalRoles: rolesActivos.length,
                rolesActivos: rolesActivos.length,
                totalProductos: estadisticasProductos.totalProductos,
                productosActivos: estadisticasProductos.productosActivos,
                productosInactivos: estadisticasProductos.productosInactivos,
            });

            // Mostrar últimos 5 usuarios
            setRecentUsuarios(usuariosTodos.slice(0, 5));
            setRecentProductos(productosRecientes.slice(0, 5));
            //setAvailableRoles(rolesActivos.slice(0, 5));

        } catch (error) {
            console.error('Error cargando datos del dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Cargando dashboard...</div>
                </div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-600">Resumen general del sistema</p>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Usuarios */}
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-500">👥</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsuarios}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-500">✅</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.usuariosActivos}</p>
                            </div>
                        </div>
                    </div>

                    {/* Productos */}
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <span className="text-purple-500">📦</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Productos</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.totalProductos}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                    <span className="text-orange-500">✅</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Productos Activos</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.productosActivos}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenido en dos columnas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Últimos Usuarios */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800">Últimos Usuarios</h2>
                                <Link
                                    to="/usuarios"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    Ver todos
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            {recentUsuarios.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No hay usuarios registrados</p>
                            ) : (
                                <div className="space-y-4">
                                    {recentUsuarios.map((usuario) => (
                                        <div key={usuario.email} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                                            <div className="flex items-center">
                                                <div className={`w-3 h-3 rounded-full mr-3 ${usuario.activo ? 'bg-green-500' : 'bg-red-500'
                                                    }`}></div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{usuario.nombre}</p>
                                                    <p className="text-sm text-gray-500">{usuario.email}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">{usuario.departamento || 'N/A'}</p>
                                                <p className="text-xs text-gray-500">{usuario.puesto || 'Sin puesto'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Últimos Productos */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800">Productos Recientes</h2>
                                <Link
                                    to="/productos"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    Ver todos
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            {recentProductos.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No hay productos registrados</p>
                            ) : (
                                <div className="space-y-4">
                                    {recentProductos.map((producto) => (
                                        <div key={producto.codigo} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                                            <div className="flex items-center">
                                                <div className={`w-3 h-3 rounded-full mr-3 ${producto.activo ? 'bg-green-500' : 'bg-red-500'
                                                    }`}></div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{producto.nombre}</p>
                                                    <p className="text-sm text-gray-500">{producto.codigo}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">${producto.precio.toFixed(2)}</p>
                                                <p className={`text-xs ${producto.activo ? 'text-green-500' : 'text-red-500'}`}>
                                                    {producto.activo ? 'Activo' : 'Inactivo'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Acciones Rápidas */}
                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Link
                            to="/usuarios"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        >
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                <span className="text-blue-600">👥</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Gestionar Usuarios</p>
                                <p className="text-sm text-gray-500">Crear, editar y administrar usuarios</p>
                            </div>
                        </Link>

                        <Link
                            to="/productos"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
                        >
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                                <span className="text-purple-600">📦</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Gestionar Productos</p>
                                <p className="text-sm text-gray-500">Administrar inventario de productos</p>
                            </div>
                        </Link>

                        <Link
                            to="/movimientos"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors"
                        >
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                                <span className="text-orange-600">🔄</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Movimientos</p>
                                <p className="text-sm text-gray-500">Registrar entradas y salidas</p>
                            </div>
                        </Link>

                        <Link
                            to="/perfil"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
                        >
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                <span className="text-green-600">👤</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Mi Perfil</p>
                                <p className="text-sm text-gray-500">Ver y editar mi información</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};