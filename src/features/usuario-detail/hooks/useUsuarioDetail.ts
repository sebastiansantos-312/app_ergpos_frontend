import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRolStore } from '@/stores/rolStore';
import { usuarioService } from '@/services/usuarioService';
import type { UsuarioUpdateFormData } from '@/schema';
import { toast } from 'react-toastify';

export const useUsuarioDetail = (email: string | undefined) => {
    const navigate = useNavigate();
    const { roles, cargarRoles } = useRolStore();

    const [usuario, setUsuario] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // Cargar usuario
    useEffect(() => {
        const cargarUsuario = async () => {
            if (!email) return;
            setIsLoading(true);
            try {
                const data = await usuarioService.obtenerPorEmail(email);
                setUsuario(data);
                cargarRoles();
            } catch (error: any) {
                toast.error('Error cargando usuario');
                navigate('/usuarios');
            } finally {
                setIsLoading(false);
            }
        };
        cargarUsuario();
    }, [email, navigate, cargarRoles]);

    const handleUpdate = async (data: UsuarioUpdateFormData) => {
        if (!usuario?.email) return;

        try {
            // Crear objeto con el formato que espera el backend
            const updateData: any = {
                nombre: data.nombre,
                email: data.email,
                nombreRol: data.nombreRol,
                codigo: data.codigo,
            };

            // Solo incluir password si se proporcionó
            if (data.password && data.password.trim() !== '') {
                updateData.password = data.password;
            }

            await usuarioService.actualizarUsuario(usuario.email, updateData);
            toast.success('Usuario actualizado correctamente');

            // Recargar usuario
            const usuarioActualizado = await usuarioService.obtenerPorEmail(usuario.email);
            setUsuario(usuarioActualizado);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al actualizar');
            throw error;
        }
    };

    const openEditDialog = () => setIsEditDialogOpen(true);
    const closeEditDialog = () => setIsEditDialogOpen(false);

    return {
        usuario,
        isLoading,
        roles,
        isEditDialogOpen,
        handleUpdate,
        openEditDialog,
        closeEditDialog,
    };
};
