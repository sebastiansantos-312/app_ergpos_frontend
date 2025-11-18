import { useEffect } from 'react';
import { useRolStore } from '../stores/rolStore';

export const useRoles = () => {
    const {
        rolesActivos,
        isLoading,
        error,
        fetchRolesActivos
    } = useRolStore();

    useEffect(() => {
        if (rolesActivos.length === 0) {
            fetchRolesActivos();
        }
    }, [rolesActivos.length, fetchRolesActivos]);

    // Obtener solo los nombres de los roles activos
    const nombresRoles = rolesActivos
        .filter(rol => rol.activo)
        .map(rol => rol.nombre);

    return {
        roles: rolesActivos,
        nombresRoles,
        isLoading,
        error,
        refetch: fetchRolesActivos
    };
};