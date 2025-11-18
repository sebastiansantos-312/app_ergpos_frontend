import React, { useState } from 'react';
import type { CambiarPasswordRequestDTO } from '../../types/usuario/usuario';

interface CambiarPasswordProps {
    onSubmit: (data: CambiarPasswordRequestDTO) => void;
    onCancel: () => void;
    loading?: boolean;
}

export const CambiarPassword: React.FC<CambiarPasswordProps> = ({
    onSubmit,
    onCancel,
    loading = false
}) => {
    const [formData, setFormData] = useState<CambiarPasswordRequestDTO>({
        passwordActual: '',
        nuevoPassword: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.nuevoPassword !== confirmPassword) {
            alert('Las contraseñas nuevas no coinciden');
            return;
        }

        if (formData.nuevoPassword.length < 6) {
            alert('La nueva contraseña debe tener al menos 6 caracteres');
            return;
        }

        onSubmit(formData);
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Cambiar Contraseña</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña Actual
                    </label>
                    <input
                        type="password"
                        value={formData.passwordActual}
                        onChange={(e) => setFormData({
                            ...formData,
                            passwordActual: e.target.value
                        })}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ingresa tu contraseña actual"
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nueva Contraseña
                    </label>
                    <input
                        type="password"
                        value={formData.nuevoPassword}
                        onChange={(e) => setFormData({
                            ...formData,
                            nuevoPassword: e.target.value
                        })}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Mínimo 6 caracteres"
                        minLength={6}
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar Nueva Contraseña
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Repite la nueva contraseña"
                        minLength={6}
                        required
                        disabled={loading}
                    />
                </div>

                {formData.nuevoPassword && confirmPassword && formData.nuevoPassword !== confirmPassword && (
                    <p className="text-red-600 text-sm">Las contraseñas no coinciden</p>
                )}

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};