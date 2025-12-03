import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { usuarioService } from '@/services/usuarioService';
import type { CambiarPasswordFormData } from '@/schema';
import { toast } from 'react-toastify';

export const usePerfil = () => {
    const { user } = useAuthStore();
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);

    const handlePasswordSubmit = async (data: CambiarPasswordFormData) => {
        if (!user?.email) return;

        setIsLoadingPassword(true);
        try {
            await usuarioService.cambiarPassword(user.email, {
                passwordActual: data.passwordActual,
                nuevoPassword: data.nuevoPassword,
            });
            toast.success('Contraseña actualizada correctamente');
            setIsEditingPassword(false);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al cambiar la contraseña';
            toast.error(message);
            throw error;
        } finally {
            setIsLoadingPassword(false);
        }
    };

    return {
        user,
        isEditingPassword,
        isLoadingPassword,
        setIsEditingPassword,
        handlePasswordSubmit,
    };
};
