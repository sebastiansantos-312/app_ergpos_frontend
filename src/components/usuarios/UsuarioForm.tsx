// UsuarioForm.tsx - CORREGIDO
import React, { useState, useEffect } from 'react';
import type { Usuario, UsuarioRequest } from '../../types'; 

interface UsuarioFormProps {
    usuario?: Usuario;
    onSubmit: (usuario: UsuarioRequest) => Promise<void>; // Cambiar tipo y hacer async
    onCancel: () => void;
}

export const UsuarioForm: React.FC<UsuarioFormProps> = ({ usuario, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<UsuarioRequest>({
        nombre: '',
        email: '',
        password: '',
        codigo: '',
        departamento: '',
        puesto: '',
        roles: [],
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (usuario) {
            setFormData({
                nombre: usuario.nombre,
                email: usuario.email,
                password: '', // No mostrar password existente
                codigo: usuario.codigo || '',
                departamento: usuario.departamento || '',
                puesto: usuario.puesto || '',
                roles: usuario.roles || [],
            });
        }
    }, [usuario]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Error en formulario:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                    <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={!!usuario} // No permitir cambiar email en edición
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                </div>
            </div>

            {!usuario && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            )}

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                    <input
                        type="text"
                        value={formData.codigo}
                        onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                    <input
                        type="text"
                        value={formData.departamento}
                        onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Puesto</label>
                    <input
                        type="text"
                        value={formData.puesto}
                        onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Guardando...' : (usuario ? 'Actualizar' : 'Crear')} Usuario
                </button>
            </div>
        </form>
    );
};