// UsuariosPage.tsx - VERSIÓN COMPLETA CORREGIDA
import React, { useState, useEffect } from 'react';
import { UsuarioForm } from '../components/usuarios/UsuarioForm';
import { UsuarioList } from '../components/usuarios/UsuarioList';
import { RolEditor } from '../components/usuarios/RolEditor';
import { usuarioService } from '../services/usuarioService';
import { Layout } from '../components/shared/Layout';
import type { Usuario, UsuarioRequest } from '../types';

export const UsuariosPage: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingUsuario, setEditingUsuario] = useState<Usuario | undefined>();
    const [editingRolesUsuario, setEditingRolesUsuario] = useState<Usuario | undefined>();
    const [loading, setLoading] = useState(true);

    // Estados para búsqueda y filtros
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroEmail, setFiltroEmail] = useState('');
    const [filtroDepartamento, setFiltroDepartamento] = useState('');
    const [filtroPuesto, setFiltroPuesto] = useState('');
    const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activos' | 'inactivos'>('todos');

    const loadUsuarios = async () => {
        try {
            setLoading(true);
            const data = await usuarioService.listarTodos();
            setUsuarios(data);
            setUsuariosFiltrados(data);
        } catch (error) {
            console.error('Error cargando usuarios:', error);
        } finally {
            setLoading(false);
        }
    };

    // Cargar por estado específico
    const cargarPorEstado = async (estado: 'activos' | 'inactivos') => {
        try {
            setLoading(true);
            const data = estado === 'activos'
                ? await usuarioService.listarActivos()
                : await usuarioService.listarInactivos();
            setUsuariosFiltrados(data);
        } catch (error) {
            console.error(`Error cargando usuarios ${estado}:`, error);
            // Si falla, volver a cargar todos
            await loadUsuarios();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsuarios();
    }, []);

    // Aplicar filtros cuando cambien los valores
    useEffect(() => {
        aplicarFiltros();
    }, [usuarios, filtroNombre, filtroEmail, filtroDepartamento, filtroPuesto, filtroEstado]);

    const aplicarFiltros = () => {
        let resultados = [...usuarios];

        // Filtro por nombre
        if (filtroNombre) {
            resultados = resultados.filter(usuario =>
                usuario.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
            );
        }

        // Filtro por email
        if (filtroEmail) {
            resultados = resultados.filter(usuario =>
                usuario.email.toLowerCase().includes(filtroEmail.toLowerCase())
            );
        }

        // Filtro por departamento
        if (filtroDepartamento) {
            resultados = resultados.filter(usuario =>
                usuario.departamento?.toLowerCase().includes(filtroDepartamento.toLowerCase())
            );
        }

        // Filtro por puesto
        if (filtroPuesto) {
            resultados = resultados.filter(usuario =>
                usuario.puesto?.toLowerCase().includes(filtroPuesto.toLowerCase())
            );
        }

        // Filtro por estado - si es "todos" no filtra, si es específico carga del servidor
        if (filtroEstado === 'activos' || filtroEstado === 'inactivos') {
            // Para filtros de estado, usamos los endpoints específicos
            cargarPorEstado(filtroEstado);
            return; // Salimos porque cargarPorEstado actualizará usuariosFiltrados
        }

        setUsuariosFiltrados(resultados);
    };

    const handleBuscarUsuarios = async () => {
        try {
            setLoading(true);
            const data = await usuarioService.buscarUsuarios({
                nombre: filtroNombre || undefined,
                email: filtroEmail || undefined,
                departamento: filtroDepartamento || undefined,
                puesto: filtroPuesto || undefined
            });
            setUsuariosFiltrados(data);
        } catch (error) {
            console.error('Error buscando usuarios:', error);
        } finally {
            setLoading(false);
        }
    };

    const limpiarFiltros = async () => {
        setFiltroNombre('');
        setFiltroEmail('');
        setFiltroDepartamento('');
        setFiltroPuesto('');
        setFiltroEstado('todos');
        // Recargar todos los usuarios
        await loadUsuarios();
    };

    const handleCreateUsuario = async (usuarioData: UsuarioRequest) => {
        try {
            await usuarioService.crearUsuario(usuarioData);
            await loadUsuarios();
            setShowForm(false);
        } catch (error) {
            console.error('Error creando usuario:', error);
            throw error;
        }
    };

    const handleUpdateUsuario = async (usuarioData: UsuarioRequest) => {
        if (!editingUsuario?.codigo) return;

        try {
            await usuarioService.actualizarUsuario(editingUsuario.codigo, usuarioData);
            await loadUsuarios();
            setEditingUsuario(undefined);
        } catch (error) {
            console.error('Error actualizando usuario:', error);
            throw error;
        }
    };

    const handleToggleStatus = async (usuario: Usuario) => {
        try {
            if (usuario.activo) {
                await usuarioService.desactivarUsuario(usuario.email);
            } else {
                await usuarioService.activarUsuario(usuario.email);
            }
            await loadUsuarios();
        } catch (error) {
            console.error('Error cambiando estado:', error);
            throw error;
        }
    };

    const handleEditRoles = async (usuario: Usuario, nuevosRoles: string[]) => {
        try {
            await usuarioService.cambiarRoles(usuario.email, nuevosRoles);
            await loadUsuarios();
            setEditingRolesUsuario(undefined);
        } catch (error) {
            console.error('Error actualizando roles:', error);
            throw error;
        }
    };

    if (loading && usuarios.length === 0) {
        return (
            <Layout>
                <div className="container mx-auto p-4">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg">Cargando usuarios...</div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Nuevo Usuario
                    </button>
                </div>

                {/* Panel de Búsqueda y Filtros */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Buscar y Filtrar Usuarios</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                        {/* Filtro Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre
                            </label>
                            <input
                                type="text"
                                value={filtroNombre}
                                onChange={(e) => setFiltroNombre(e.target.value)}
                                placeholder="Buscar por nombre..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Filtro Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="text"
                                value={filtroEmail}
                                onChange={(e) => setFiltroEmail(e.target.value)}
                                placeholder="Buscar por email..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Filtro Departamento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Departamento
                            </label>
                            <input
                                type="text"
                                value={filtroDepartamento}
                                onChange={(e) => setFiltroDepartamento(e.target.value)}
                                placeholder="Filtrar por departamento..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Filtro Puesto */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Puesto
                            </label>
                            <input
                                type="text"
                                value={filtroPuesto}
                                onChange={(e) => setFiltroPuesto(e.target.value)}
                                placeholder="Filtrar por puesto..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Filtro Estado */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estado
                            </label>
                            <select
                                value={filtroEstado}
                                onChange={(e) => setFiltroEstado(e.target.value as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="todos">Todos</option>
                                <option value="activos">Solo Activos</option>
                                <option value="inactivos">Solo Inactivos</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleBuscarUsuarios}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
                        >
                            <span>🔍</span>
                            Buscar en Servidor
                        </button>
                        <button
                            onClick={limpiarFiltros}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
                        >
                            <span>🗑️</span>
                            Limpiar Filtros
                        </button>
                        <button
                            onClick={loadUsuarios}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                        >
                            <span>🔄</span>
                            Recargar Todos
                        </button>
                    </div>
                </div>

                {/* Contador de resultados */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios
                        {filtroEstado !== 'todos' && ` (Filtrado: ${filtroEstado})`}
                    </p>
                </div>

                {showForm && (
                    <div className="mb-6">
                        <h2 className="text-xl mb-4">Crear Usuario</h2>
                        <UsuarioForm
                            onSubmit={handleCreateUsuario}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                )}

                {editingUsuario && (
                    <div className="mb-6">
                        <h2 className="text-xl mb-4">Editar Usuario</h2>
                        <UsuarioForm
                            usuario={editingUsuario}
                            onSubmit={handleUpdateUsuario}
                            onCancel={() => setEditingUsuario(undefined)}
                        />
                    </div>
                )}

                {/* Editor de Roles */}
                {editingRolesUsuario && (
                    <RolEditor
                        usuario={editingRolesUsuario}
                        onSave={handleEditRoles}
                        onCancel={() => setEditingRolesUsuario(undefined)}
                    />
                )}

                <UsuarioList
                    usuarios={usuariosFiltrados}
                    onEdit={setEditingUsuario}
                    onToggleStatus={handleToggleStatus}
                    onEditRoles={setEditingRolesUsuario}
                />
            </div>
        </Layout>
    );
};