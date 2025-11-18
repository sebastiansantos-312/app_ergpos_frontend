import React, { useState, useEffect } from 'react';
import { usuarioService } from '../services/usuarioService';
import type { UsuarioResponseDTO, CambiarPasswordRequestDTO } from '../types/usuario/usuario';
import { Layout } from '../components/shared/Layout';
import { CambiarPassword } from '../components/usuarios/CambiarPassword'; // ← IMPORTAR

export const PerfilPage: React.FC = () => {
    const [perfil, setPerfil] = useState<UsuarioResponseDTO | null>(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadPerfil();
    }, []);

    const loadPerfil = async () => {
        try {
            const data = await usuarioService.obtenerMiPerfil();
            setPerfil(data);
        } catch (error) {
            console.error('Error cargando perfil:', error);
        }
    };

    const handleChangePassword = async (passwordData: CambiarPasswordRequestDTO) => {
        setLoading(true);
        try {
            await usuarioService.cambiarPassword(passwordData);
            setShowPasswordForm(false);
            alert('Contraseña cambiada exitosamente');
        } catch (error) {
            console.error('Error cambiando contraseña:', error);
            throw error; // Propagar error para que el componente lo maneje
        } finally {
            setLoading(false);
        }
    };

    if (!perfil) return <div>Cargando...</div>;

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="font-semibold">Nombre:</label>
                            <p>{perfil.nombre}</p>
                        </div>
                        <div>
                            <label className="font-semibold">Email:</label>
                            <p>{perfil.email}</p>
                        </div>
                        <div>
                            <label className="font-semibold">Código:</label>
                            <p>{perfil.codigo || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="font-semibold">Departamento:</label>
                            <p>{perfil.departamento || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="font-semibold">Puesto:</label>
                            <p>{perfil.puesto || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="font-semibold">Estado:</label>
                            <p className={perfil.activo ? 'text-green-600' : 'text-red-600'}>
                                {perfil.activo ? 'Activo' : 'Inactivo'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="font-semibold">Roles:</label>
                        <div className="flex gap-2 mt-2">
                            {perfil.roles.map((rol) => (
                                <span key={rol} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {rol}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Seguridad</h2>
                        <button
                            onClick={() => setShowPasswordForm(!showPasswordForm)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            {showPasswordForm ? 'Cancelar' : 'Cambiar Contraseña'}
                        </button>
                    </div>

                    {showPasswordForm && (
                        <CambiarPassword
                            onSubmit={handleChangePassword}
                            onCancel={() => setShowPasswordForm(false)}
                            loading={loading}
                        />
                    )}
                </div>
            </div>
        </Layout>
    );
};