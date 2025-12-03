import { useState, useEffect, useMemo } from 'react';
import { useUsuarioStore } from '@/stores/usuarioStore';
import { useRolStore } from '@/stores/rolStore';
import { useAuthStore } from '@/stores/authStore';
import { usuarioService } from '@/services/usuarioService';
import type { UsuarioCreateFormData } from '@/schema';
import type { UsuarioResponse } from '@/types/usuario';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const useUsuarios = () => {
    const navigate = useNavigate();
    const {
        usuarios,
        isLoading,
        cargarUsuarios,
    } = useUsuarioStore();

    const { roles, cargarRoles } = useRolStore();
    const { user: currentUser } = useAuthStore();

    // UI State
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActivo, setFilterActivo] = useState<boolean | undefined>(undefined);
    const [usuarioParaDesactivar, setUsuarioParaDesactivar] = useState<UsuarioResponse | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Initial Load
    useEffect(() => {
        cargarUsuarios();
        cargarRoles();
    }, [cargarUsuarios, cargarRoles]);

    // Filter Logic
    const filteredUsuarios = useMemo(() => {
        return usuarios.filter((usr) => {
            const matchesSearch =
                searchTerm === '' ||
                usr.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                usr.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                usr.codigo.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter =
                filterActivo === undefined ||
                usr.activo === filterActivo;

            return matchesSearch && matchesFilter;
        });
    }, [usuarios, searchTerm, filterActivo]);

    // Actions
    const handleCreate = async (data: UsuarioCreateFormData) => {
        try {
            await usuarioService.crearUsuario(data);
            toast.success('Usuario creado correctamente');
            await cargarUsuarios();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al crear el usuario';
            toast.error(message);
            throw error;
        }
    };

    const handleActivate = async (usuario: UsuarioResponse) => {
        try {
            await usuarioService.activarUsuario(usuario.email);
            toast.success('Usuario activado');
            await cargarUsuarios();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al activar');
        }
    };

    const handleDeactivateConfirm = async () => {
        if (!usuarioParaDesactivar) return;

        try {
            await usuarioService.desactivarUsuario(usuarioParaDesactivar.email);
            toast.success('Usuario desactivado');
            await cargarUsuarios();
            setShowConfirmDialog(false);
            setUsuarioParaDesactivar(null);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al desactivar');
        }
    };

    // Dialog Handlers
    const openCreate = () => setIsCreateDialogOpen(true);

    const openEdit = (usuario: UsuarioResponse) => {
        navigate(`/usuarios/${usuario.email}`);
    };

    const openDeactivate = (usuario: UsuarioResponse) => {
        // Validar si es el mismo usuario
        if (currentUser && usuario.email === currentUser.email) {
            toast.error('No puedes desactivar tu propia cuenta');
            return;
        }
        setUsuarioParaDesactivar(usuario);
        setShowConfirmDialog(true);
    };

    const closeDialogs = () => {
        setIsCreateDialogOpen(false);
        setShowConfirmDialog(false);
        setUsuarioParaDesactivar(null);
    };

    return {
        // Data
        usuarios: filteredUsuarios,
        totalUsuarios: filteredUsuarios.length,
        isLoading,
        roles,
        currentUser,

        // State
        searchTerm,
        setSearchTerm,
        filterActivo,
        setFilterActivo,
        isCreateDialogOpen,
        showConfirmDialog,
        usuarioParaDesactivar,

        // Actions
        handleCreate,
        handleActivate,
        handleDeactivateConfirm,
        openCreate,
        openEdit,
        openDeactivate,
        closeDialogs,
    };
};
