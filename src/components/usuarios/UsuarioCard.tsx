import React from 'react';
import type { UsuarioResponseDTO } from '../../types/usuario/usuario';

interface UsuarioCardProps {
    usuario: UsuarioResponseDTO;
    onEdit: (usuario: UsuarioResponseDTO) => void;
    onToggleStatus: (usuario: UsuarioResponseDTO) => void;
    onEditRoles: (usuario: UsuarioResponseDTO) => void;
    onViewDetails: (usuario: UsuarioResponseDTO) => void;
}

export const UsuarioCard: React.FC<UsuarioCardProps> = ({
    usuario,
    onEdit,
    onToggleStatus,
    onEditRoles,
    onViewDetails
}) => {
    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${usuario.activo ? 'bg-green-500' : 'bg-red-500'}`} />
                        <h3 className="font-semibold text-lg text-gray-800">{usuario.nombre}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${usuario.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </div>

                {/* Información básica */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium mr-2">Email:</span>
                        {usuario.email}
                    </div>
                    {usuario.codigo && (
                        <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium mr-2">Código:</span>
                            {usuario.codigo}
                        </div>
                    )}
                    {(usuario.departamento || usuario.puesto) && (
                        <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium mr-2">Puesto:</span>
                            {[usuario.departamento, usuario.puesto].filter(Boolean).join(' - ')}
                        </div>
                    )}
                </div>

                {/* Roles */}
                <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 mb-2 block">Roles:</span>
                    <div className="flex flex-wrap gap-1">
                        {usuario.roles && usuario.roles.length > 0 ? (
                            usuario.roles.map((rol) => (
                                <span
                                    key={rol}
                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
                                >
                                    {rol}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-500 text-xs">Sin roles asignados</span>
                        )}
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => onViewDetails(usuario)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 px-3 rounded transition-colors"
                    >
                        Ver Detalles
                    </button>
                    <button
                        onClick={() => onEdit(usuario)}
                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm py-2 px-3 rounded transition-colors"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => onEditRoles(usuario)}
                        className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm py-2 px-3 rounded transition-colors"
                    >
                        Roles
                    </button>
                    <button
                        onClick={() => onToggleStatus(usuario)}
                        className={`flex-1 text-sm py-2 px-3 rounded transition-colors ${usuario.activo
                            ? 'bg-red-100 hover:bg-red-200 text-red-700'
                            : 'bg-green-100 hover:bg-green-200 text-green-700'
                            }`}
                    >
                        {usuario.activo ? 'Desactivar' : 'Activar'}
                    </button>
                </div>
            </div>
        </div>
    );
};