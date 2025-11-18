// UsuarioList.tsx - CORREGIDO
import React from 'react';
import type { Usuario } from '../../types'; // Cambiar importación

interface UsuarioListProps {
    usuarios: Usuario[];
    onEdit: (usuario: Usuario) => void;
    onToggleStatus: (usuario: Usuario) => void;
    onEditRoles: (usuario: Usuario, roles: string[]) => void; // Cambiar firma
}

export const UsuarioList: React.FC<UsuarioListProps> = ({
    usuarios,
    onEdit,
    onToggleStatus,
    onEditRoles,
}) => {
    return (
        <div className="space-y-4">
            {usuarios.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No hay usuarios registrados
                </div>
            ) : (
                usuarios.map((usuario) => (
                    <div key={usuario.email} className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg text-gray-800">{usuario.nombre}</h3>
                                <p className="text-gray-600">{usuario.email}</p>
                                <p className="text-sm text-gray-500">Código: {usuario.codigo || 'N/A'}</p>
                                <p className="text-sm text-gray-500">
                                    {usuario.departamento} {usuario.puesto && `- ${usuario.puesto}`}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {usuario.roles.map((rol) => (
                                        <span
                                            key={rol}
                                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
                                        >
                                            {rol}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => onEdit(usuario)}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => onEditRoles(usuario, usuario.roles)} // Pasar roles actuales
                                    className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                >
                                    Roles
                                </button>
                                <button
                                    onClick={() => onToggleStatus(usuario)}
                                    className={`px-3 py-1 text-white rounded focus:outline-none focus:ring-2 text-sm ${usuario.activo
                                            ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
                                            : 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
                                        }`}
                                >
                                    {usuario.activo ? 'Desactivar' : 'Activar'}
                                </button>
                            </div>
                        </div>
                        <div className={`mt-2 text-sm font-medium ${usuario.activo ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {usuario.activo ? '✅ Activo' : '❌ Inactivo'}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};