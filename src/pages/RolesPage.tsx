import React, { useState, useEffect } from 'react';
import { rolService } from '../services/rolService';
import type { RolResponseDTO } from '../types/rol/rol';
import { Layout } from '../components/shared/Layout';

export const RolesPage: React.FC = () => {
    const [roles, setRoles] = useState<RolResponseDTO[]>([]);
    const [inactiveRoles, setInactiveRoles] = useState<RolResponseDTO[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newRolName, setNewRolName] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'activos' | 'inactivos'>('activos');

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        try {
            setLoading(true);
            const [activos, inactivos] = await Promise.all([
                rolService.listarActivos(),
                rolService.listarInactivos()
            ]);

            setRoles(activos);
            setInactiveRoles(inactivos);
        } catch (error) {
            console.error('Error cargando roles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRol = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRolName.trim()) return;

        try {
            await rolService.crearRol({ nombre: newRolName });
            setNewRolName('');
            setShowForm(false);
            await loadRoles();
            setActiveTab('activos'); // Cambiar a pestaña de activos después de crear
        } catch (error: any) {
            console.error('Error creando rol:', error);
            alert(error.response?.data?.message || 'Error al crear el rol');
        }
    };

    const handleToggleStatus = async (rol: RolResponseDTO) => {
        try {
            if (rol.activo) {
                await rolService.desactivarRol(rol.nombre);
            } else {
                await rolService.activarRol(rol.nombre);
            }
            await loadRoles();
        } catch (error: any) {
            console.error('Error cambiando estado del rol:', error);
            alert(error.response?.data?.message || 'Error al cambiar el estado del rol');
        }
    };

    const currentRoles = activeTab === 'activos' ? roles : inactiveRoles;

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex justify-center items-center h-32">
                    <div className="text-lg">Cargando roles...</div>
                </div>
            </div>
        );
    }

    return (
        <Layout>

            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Gestión de Roles</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                    >
                        Nuevo Rol
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Crear Nuevo Rol</h2>
                        <form onSubmit={handleCreateRol} className="flex gap-4">
                            <input
                                type="text"
                                value={newRolName}
                                onChange={(e) => setNewRolName(e.target.value.toUpperCase())}
                                placeholder="Nombre del rol (ej: ADMIN, USER)"
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                            >
                                Crear
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                            >
                                Cancelar
                            </button>
                        </form>
                    </div>
                )}

                {/* Tabs para activos/inactivos */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('activos')}
                                className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'activos'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Roles Activos ({roles.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('inactivos')}
                                className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'inactivos'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Roles Inactivos ({inactiveRoles.length})
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Lista de roles */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold">
                            {activeTab === 'activos' ? 'Roles Activos' : 'Roles Inactivos'}
                        </h2>
                    </div>

                    {currentRoles.length === 0 ? (
                        <div className="px-6 py-8 text-center text-gray-500">
                            No hay roles {activeTab === 'activos' ? 'activos' : 'inactivos'}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {currentRoles.map((rol) => (
                                <div key={rol.nombre} className="px-6 py-4 flex justify-between items-center">
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-3 ${rol.activo ? 'bg-green-500' : 'bg-red-500'
                                            }`}></div>
                                        <span className="font-medium text-gray-800">{rol.nombre}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(rol)}
                                            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${rol.activo
                                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                }`}
                                        >
                                            {rol.activo ? 'Desactivar' : 'Activar'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};