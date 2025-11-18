import { useAuthStore } from '../stores/authStore';
import type { Rol } from '../types';

export const useAuth = () => {
    const {
        user,
        token,
        isAuthenticated,
        login,
        logout,
        setUser,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        getUserPermissions
    } = useAuthStore();

    // ✅ CORREGIDO: Asegurar que siempre retorne un array
    const roleNames = user?.roles || [];

    // ✅ CORREGIDO: activeRoles debería ser un array de objetos Role
    const activeRoles: Rol[] = roleNames.map((roleName, index) => ({
        id: `temp-${index}`, // ID temporal ya que el backend no envía la estructura completa
        nombre: roleName,
        activo: true, // Asumimos que están activos
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }));

    // Obtener permisos
    const permissions = getUserPermissions();

    return {
        // Estado
        user,
        token,
        isAuthenticated,

        // Acciones
        login,
        logout,
        setUser,

        // Helpers de roles
        hasRole,
        hasAnyRole,
        hasAllRoles,
        roleNames,
        activeRoles, // ✅ Ahora siempre será un array

        // Permisos
        permissions,

        // Atajos comunes para roles específicos
        isSuperAdmin: hasRole('SUPER_ADMIN'),
        isAdministrador: hasRole('ADMINISTRADOR'),
        isGerente: hasRole('GERENTE'),
        isAlmacenista: hasRole('ALMACENISTA'),
        isContador: hasRole('CONTADOR'),
        isVendedor: hasRole('VENDEDOR'),
        isAuditor: hasRole('AUDITOR'),

        // Atajos para permisos comunes
        canEdit: permissions.canEditProducts,
        canManageUsers: permissions.canManageUsers,
        canViewFinancials: permissions.canViewFinancials,
    };
};