import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usuarioService } from '../services/usuarioService';
import type { UsuarioResponseDTO } from '../types/index';
import { Layout } from '../components/shared/Layout';

export const UsuarioDetailPage: React.FC = () => {
    const { codigo } = useParams<{ codigo: string }>();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState<UsuarioResponseDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (codigo) {
            loadUsuario(codigo);
        }
    }, [codigo]);

    const loadUsuario = async (codigo: string) => {
        try {
            setLoading(true);
            const data = await usuarioService.obtenerPorCodigo(codigo);
            setUsuario(data);
            setError(null);
        } catch (err) {
            setError('Usuario no encontrado');
            console.error('Error cargando usuario:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!usuario) return;

        try {
            if (usuario.activo) {
                await usuarioService.desactivarUsuario(usuario.email);
            } else {
                await usuarioService.activarUsuario(usuario.email);
            }
            // Recargar datos
            await loadUsuario(usuario.codigo);
        } catch (error) {
            console.error('Error cambiando estado:', error);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Cargando usuario...</div>
                </div>
            </div>
        );
    }

    if (error || !usuario) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center">
                        <span className="text-red-500 text-2xl mr-3">❌</span>
                        <div>
                            <h2 className="text-lg font-semibold text-red-800">Error</h2>
                            <p className="text-red-600">{error || 'Usuario no encontrado'}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/usuarios')}
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Volver a Usuarios
                    </button>
                </div>
            </div>
        );
    }

    return (
        <Layout>

            <div className="container mx-auto p-6">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        to="/usuarios"
                        className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center"
                    >
                        ← Volver a Usuarios
                    </Link>
                    <div className="flex justify-between items-start mt-2">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{usuario.nombre}</h1>
                            <p className="text-gray-600">{usuario.email}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleToggleStatus}
                                className={`px-4 py-2 rounded ${usuario.activo
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                            >
                                {usuario.activo ? 'Desactivar' : 'Activar'}
                            </button>
                            <Link
                                to={`/usuarios`} // En un caso real, iría a edición
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Editar
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Información del usuario */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Información principal */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Código</label>
                                    <p className="mt-1 text-sm text-gray-900">{usuario.codigo || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <p className="mt-1 text-sm text-gray-900">{usuario.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Departamento</label>
                                    <p className="mt-1 text-sm text-gray-900">{usuario.departamento || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Puesto</label>
                                    <p className="mt-1 text-sm text-gray-900">{usuario.puesto || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${usuario.activo
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {usuario.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Roles y acciones */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Roles Asignados</h2>
                            {usuario.roles.length === 0 ? (
                                <p className="text-gray-500 text-sm">No hay roles asignados</p>
                            ) : (
                                <div className="space-y-2">
                                    {usuario.roles.map((rol) => (
                                        <div
                                            key={rol}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded"
                                        >
                                            <span className="font-medium text-gray-900">{rol}</span>
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                                Asignado
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded">
                                Gestionar Roles
                            </button>
                        </div>

                        {/* Estadísticas rápidas */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Acciones</h2>
                            <div className="space-y-2">
                                <button className="w-full text-left p-3 hover:bg-gray-50 rounded border">
                                    📧 Enviar correo
                                </button>
                                <button className="w-full text-left p-3 hover:bg-gray-50 rounded border">
                                    🔄 Resetear contraseña
                                </button>
                                <button className="w-full text-left p-3 hover:bg-gray-50 rounded border">
                                    📊 Ver actividad
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};