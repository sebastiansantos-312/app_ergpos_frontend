import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useProductoStore } from '@/stores/productoStore';
import { useUsuarioStore } from '@/stores/usuarioStore';
import { useCategoriaStore } from '@/stores/categoriaStore';
import { useProveedorStore } from '@/stores/proveedorStore';
import { useRolStore } from '@/stores/rolStore';
import { useMovimientoStore } from '@/stores/movimientoStore';
import { useAuditoriaStore } from '@/stores/auditoriaStore';
import { productoService } from '@/services/productoService';
import { Package, Users, Tag, Truck, Shield, ArrowRightLeft, BookOpen } from 'lucide-react';
import React from 'react';

interface StatCard {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    module: string;
    href: string;
}

interface QuickAction {
    name: string;
    module: string;
    href: string;
}

export const useDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const {
        productos,
        setProductos,
        setTotal: setTotalProductos,
        setLoading: setLoadingProductos,
        isLoading: loadingProductos
    } = useProductoStore();

    const { usuarios, cargarUsuarios, isLoading: loadingUsuarios } = useUsuarioStore();
    const { categorias, cargarCategorias, isLoading: loadingCategorias } = useCategoriaStore();
    const { proveedores, cargarProveedores, isLoading: loadingProveedores } = useProveedorStore();
    const { roles, cargarRoles, isLoading: loadingRoles } = useRolStore();
    const { movimientos, cargarMovimientos, isLoading: loadingMovimientos } = useMovimientoStore();
    const { registros, cargarTodos, isLoading: loadingAuditoria } = useAuditoriaStore();

    useEffect(() => {
        const loadProductos = async () => {
            setLoadingProductos(true);
            try {
                const { productos, total } = await productoService.listarProductos({ activo: true });
                setProductos(productos);
                setTotalProductos(total);
            } catch (error) {
                console.error('Error loading products for dashboard:', error);
            } finally {
                setLoadingProductos(false);
            }
        };

        // Cargar datos de todos los módulos
        loadProductos();
        cargarUsuarios({ activo: true });
        cargarCategorias({ activo: true });
        cargarProveedores({ activo: true });
        cargarRoles({ activo: true });
        cargarMovimientos();
        cargarTodos();
    }, []);

    const isLoading = loadingProductos || loadingUsuarios || loadingCategorias ||
        loadingProveedores || loadingRoles || loadingMovimientos || loadingAuditoria;

    // TODAS las stats disponibles
    const allStats: StatCard[] = [
        {
            title: 'Productos',
            value: productos.length,
            icon: React.createElement(Package, { className: 'w-6 h-6' }),
            color: 'bg-blue-500',
            module: 'productos',
            href: '/productos'
        },
        {
            title: 'Usuarios',
            value: usuarios.length,
            icon: React.createElement(Users, { className: 'w-6 h-6' }),
            color: 'bg-green-500',
            module: 'usuarios',
            href: '/usuarios'
        },
        {
            title: 'Categorías',
            value: categorias.length,
            icon: React.createElement(Tag, { className: 'w-6 h-6' }),
            color: 'bg-purple-500',
            module: 'categorias',
            href: '/categorias'
        },
        {
            title: 'Proveedores',
            value: proveedores.length,
            icon: React.createElement(Truck, { className: 'w-6 h-6' }),
            color: 'bg-orange-500',
            module: 'proveedores',
            href: '/proveedores'
        },
        {
            title: 'Roles',
            value: roles.length,
            icon: React.createElement(Shield, { className: 'w-6 h-6' }),
            color: 'bg-red-500',
            module: 'roles',
            href: '/roles'
        },
        {
            title: 'Movimientos',
            value: movimientos.length,
            icon: React.createElement(ArrowRightLeft, { className: 'w-6 h-6' }),
            color: 'bg-indigo-500',
            module: 'movimientos',
            href: '/movimientos'
        },
        {
            title: 'Auditoría',
            value: registros.length,
            icon: React.createElement(BookOpen, { className: 'w-6 h-6' }),
            color: 'bg-cyan-500',
            module: 'auditoria',
            href: '/auditoria'
        },
    ];

    // Filtrar stats según permisos del usuario
    const availableStats = useMemo(() =>
        allStats.filter(stat => user?.modules.includes(stat.module)),
        [user, productos, usuarios, categorias, proveedores, roles, movimientos, registros]
    );

    // Acciones rápidas disponibles según rol
    const allQuickActions: QuickAction[] = [
        { name: 'Gestionar Productos', module: 'productos', href: '/productos' },
        { name: 'Gestionar Usuarios', module: 'usuarios', href: '/usuarios' },
        { name: 'Gestionar Categorías', module: 'categorias', href: '/categorias' },
        { name: 'Gestionar Proveedores', module: 'proveedores', href: '/proveedores' },
        { name: 'Gestionar Roles', module: 'roles', href: '/roles' },
        { name: 'Ver Movimientos', module: 'movimientos', href: '/movimientos' },
        { name: 'Ver Auditoría', module: 'auditoria', href: '/auditoria' },
    ];

    const availableActions = useMemo(() =>
        allQuickActions.filter(action => user?.modules.includes(action.module)),
        [user]
    );

    const handleNavigate = (href: string) => {
        navigate(href);
    };

    return {
        user,
        isLoading,
        availableStats,
        availableActions,
        handleNavigate,
    };
};
