import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface PermissionGuardProps {
    children: React.ReactNode;
    requiredPermission?: keyof ReturnType<typeof useAuth>['permissions'];
    requiredRole?: 'isSuperAdmin' | 'isAdministrador' | 'isGerente' | 'isAlmacenista' | 'isContador' | 'isVendedor' | 'isAuditor';
    requireAll?: boolean; // Si true, requiere TODOS los permisos/roles. Si false, requiere AL MENOS uno
    fallback?: React.ReactNode; // Componente a mostrar si no tiene permisos
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
    children,
    requiredPermission,
    requiredRole,
    requireAll = false,
    fallback = null
}) => {
    const auth = useAuth();

    // Si no se especifica ningún requisito, mostrar el contenido por defecto
    if (!requiredPermission && !requiredRole) {
        return <>{children}</>;
    }

    let hasPermission = false;

    // Verificar permisos específicos
    if (requiredPermission) {
        hasPermission = auth.permissions[requiredPermission] || false;
    }

    // Verificar roles específicos
    if (requiredRole) {
        const roleValue = auth[requiredRole] || false;

        if (requireAll && requiredPermission) {
            // Requiere AMBOS: el permiso Y el rol
            hasPermission = hasPermission && roleValue;
        } else {
            // Requiere AL MENOS UNO: el permiso O el rol
            hasPermission = hasPermission || roleValue;
        }
    }

    // Si tiene permisos, mostrar el contenido
    if (hasPermission) {
        return <>{children}</>;
    }

    // Si no tiene permisos, mostrar el fallback (o nada)
    return <>{fallback}</>;
};

// Componente adicional para múltiples permisos
interface MultiplePermissionGuardProps {
    children: React.ReactNode;
    requiredPermissions?: Array<keyof ReturnType<typeof useAuth>['permissions']>;
    requiredRoles?: Array<'isSuperAdmin' | 'isAdministrador' | 'isGerente' | 'isAlmacenista' | 'isContador' | 'isVendedor' | 'isAuditor'>;
    requireAll?: boolean;
    fallback?: React.ReactNode;
}

export const MultiplePermissionGuard: React.FC<MultiplePermissionGuardProps> = ({
    children,
    requiredPermissions = [],
    requiredRoles = [],
    requireAll = false,
    fallback = null
}) => {
    const auth = useAuth();

    let hasPermission = false;

    if (requireAll) {
        // Requiere TODOS los permisos Y TODOS los roles
        const allPermissions = requiredPermissions.every(
            permission => auth.permissions[permission]
        );
        const allRoles = requiredRoles.every(
            role => auth[role]
        );
        hasPermission = allPermissions && allRoles;
    } else {
        // Requiere AL MENOS UN permiso O AL MENOS UN rol
        const somePermissions = requiredPermissions.some(
            permission => auth.permissions[permission]
        );
        const someRoles = requiredRoles.some(
            role => auth[role]
        );
        hasPermission = somePermissions || someRoles;
    }

    if (hasPermission) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};

// HOC (Higher Order Component) para proteger componentes completos
export const withPermission = <P extends object>(
    Component: React.ComponentType<P>,
    requiredPermission?: keyof ReturnType<typeof useAuth>['permissions'],
    requiredRole?: 'isSuperAdmin' | 'isAdministrador' | 'isGerente' | 'isAlmacenista' | 'isContador' | 'isVendedor' | 'isAuditor'
) => {
    return (props: P) => {
        return (
            <PermissionGuard requiredPermission={requiredPermission} requiredRole={requiredRole}>
                <Component {...props} />
            </PermissionGuard>
        );
    };
};