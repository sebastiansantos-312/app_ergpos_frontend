// RolEditor.tsx - ACTUALIZADO
import React, { useState, useEffect } from 'react';
import type { Usuario } from '../../types';
import { useRoles } from '../../hooks/useRoles';

interface RolEditorProps {
    usuario: Usuario;
    onSave: (usuario: Usuario, nuevosRoles: string[]) => Promise<void>;
    onCancel: () => void;
}

export const RolEditor: React.FC<RolEditorProps> = ({
    usuario,
    onSave,
    onCancel
}) => {
    const { nombresRoles, isLoading: loadingRoles } = useRoles();
    const [rolesSeleccionados, setRolesSeleccionados] = useState<string[]>(usuario.roles);
    const [loading, setLoading] = useState(false);

    // Actualizar roles seleccionados cuando cambia el usuario
    useEffect(() => {
        setRolesSeleccionados(usuario.roles);
    }, [usuario]);

    const handleToggleRol = (rol: string) => {
        setRolesSeleccionados(prev =>
            prev.includes(rol)
                ? prev.filter(r => r !== rol)
                : [...prev, rol]
        );
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onSave(usuario, rolesSeleccionados);
        } catch (error) {
            console.error('Error actualizando roles:', error);
            throw error; // Propagar error para manejo en el componente padre
        } finally {
            setLoading(false);
        }
    };

    if (loadingRoles) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <div className="text-center">Cargando roles...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Editar Roles - {usuario.nombre}</h3>

                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Selecciona los roles para este usuario:</p>
                    <div className="space-y-2">
                        {nombresRoles.map(rol => (
                            <label key={rol} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                                <input
                                    type="checkbox"
                                    checked={rolesSeleccionados.includes(rol)}
                                    onChange={() => handleToggleRol(rol)}
                                    className="rounded text-blue-500 focus:ring-blue-500"
                                />
                                <span className="flex-1 text-sm font-medium">{rol}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {rolesSeleccionados.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                        <p className="text-yellow-800 text-sm">
                            ⚠️ El usuario no tendrá ningún rol asignado
                        </p>
                    </div>
                )}

                <div className="flex gap-2 justify-end pt-4 border-t">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : 'Guardar Roles'}
                    </button>
                </div>
            </div>
        </div>
    );
};