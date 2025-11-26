import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useProductoStore } from '../stores/productoStore';
import { useUsuarioStore } from '../stores/usuarioStore';
import { useCategoriaStore } from '../stores/categoriaStore';
import { useProveedorStore } from '../stores/proveedorStore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Package, Users, Tag, Truck, BarChart3, TrendingUp, Lock } from 'lucide-react';

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

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { productos, cargarProductos, isLoading: loadingProductos } = useProductoStore();
    const { usuarios, cargarUsuarios, isLoading: loadingUsuarios } = useUsuarioStore();
    const { categorias, cargarCategorias, isLoading: loadingCategorias } = useCategoriaStore();
    const { proveedores, cargarProveedores, isLoading: loadingProveedores } = useProveedorStore();

    useEffect(() => {
        // Cargar solo los datos de los módulos disponibles
        if (user?.modules.includes('productos')) {
            cargarProductos({ activo: true });
        }
        if (user?.modules.includes('usuarios')) {
            cargarUsuarios({ activo: true });
        }
        if (user?.modules.includes('categorias')) {
            cargarCategorias({ activo: true });
        }
        if (user?.modules.includes('proveedores')) {
            cargarProveedores({ activo: true });
        }
    }, [user?.modules]);

    const isLoading = loadingProductos || loadingUsuarios || loadingCategorias || loadingProveedores;

    // Solo mostrar stats de módulos disponibles
    const availableStats: StatCard[] = [
        {
            title: 'Productos',
            value: productos.length,
            icon: <Package className="w-6 h-6" />,
            color: 'bg-blue-500',
            module: 'productos',
            href: '/productos'
        },
        {
            title: 'Usuarios',
            value: usuarios.length,
            icon: <Users className="w-6 h-6" />,
            color: 'bg-green-500',
            module: 'usuarios',
            href: '/usuarios'
        },
        {
            title: 'Categorías',
            value: categorias.length,
            icon: <Tag className="w-6 h-6" />,
            color: 'bg-purple-500',
            module: 'categorias',
            href: '/categorias'
        },
        {
            title: 'Proveedores',
            value: proveedores.length,
            icon: <Truck className="w-6 h-6" />,
            color: 'bg-orange-500',
            module: 'proveedores',
            href: '/proveedores'
        },
    ].filter(stat => user?.modules.includes(stat.module));

    // Acciones rápidas disponibles según rol
    const allQuickActions: QuickAction[] = [
        { name: 'Gestionar Productos', module: 'productos', href: '/productos' },
        { name: 'Gestionar Usuarios', module: 'usuarios', href: '/usuarios' },
        { name: 'Gestionar Categorías', module: 'categorias', href: '/categorias' },
        { name: 'Gestionar Proveedores', module: 'proveedores', href: '/proveedores' },
        { name: 'Ver Movimientos', module: 'movimientos', href: '/movimientos' },
        { name: 'Ver Auditoría', module: 'auditoria', href: '/auditoria' },
        { name: 'Gestionar Roles', module: 'roles', href: '/roles' },
    ];

    const availableActions = allQuickActions.filter(action =>
        user?.modules.includes(action.module)
    );

    const handleNavigate = (href: string) => {
        navigate(href);
    };

    return (
        <AppLayout>
            <div className="space-y-8">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Bienvenido, {user?.nombre}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Rol: <span className="font-semibold">{user?.rol}</span>
                    </p>
                </div>

                {/* Stats Grid - Solo mostrar stats disponibles */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : availableStats.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {availableStats.map((stat) => (
                            <div
                                key={stat.title}
                                onClick={() => handleNavigate(stat.href)}
                                className="cursor-pointer hover:scale-105 transition-transform"
                            >
                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            {stat.title}
                                        </CardTitle>
                                        <div className={`${stat.color} text-white p-2 rounded-lg`}>
                                            {stat.icon}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                ) : null}

                {/* Quick Actions - Solo mostrar acciones disponibles */}
                {availableActions.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <BarChart3 className="w-5 h-5" />
                                <span>Acciones Rápidas</span>
                            </CardTitle>
                            <CardDescription>
                                Accede rápidamente a los módulos principales
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {availableActions.map((action) => (
                                    <button
                                        key={action.name}
                                        onClick={() => handleNavigate(action.href)}
                                        className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all text-left"
                                    >
                                        <p className="font-medium text-gray-900 hover:text-blue-600">
                                            {action.name}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Info Card */}
                <Card className="bg-blue-50">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            <span>Información del Sistema</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="text-gray-700">
                                Usa la barra lateral izquierda para navegar entre los diferentes módulos del sistema.
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Los módulos disponibles dependen de tu rol y permisos.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};