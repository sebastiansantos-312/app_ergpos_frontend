import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { AppLayout } from '../components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useProductoStore } from '../stores/productoStore';
import { useUsuarioStore } from '../stores/usuarioStore';
import { useCategoriaStore } from '../stores/categoriaStore';
import { useProveedorStore } from '../stores/proveedorStore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Package, Users, Tag, Truck, BarChart3, TrendingUp } from 'lucide-react';

export const DashboardPage: React.FC = () => {
    const { user } = useAuthStore();
    const { productos, cargarProductos, isLoading: loadingProductos } = useProductoStore();
    const { usuarios, cargarUsuarios, isLoading: loadingUsuarios } = useUsuarioStore();
    const { categorias, cargarCategorias, isLoading: loadingCategorias } = useCategoriaStore();
    const { proveedores, cargarProveedores, isLoading: loadingProveedores } = useProveedorStore();

    useEffect(() => {
        cargarProductos({ activo: true });
        cargarUsuarios({ activo: true });
        cargarCategorias({ activo: true });
        cargarProveedores({ activo: true });
    }, []);

    const isLoading = loadingProductos || loadingUsuarios || loadingCategorias || loadingProveedores;

    const stats = [
        {
            title: 'Productos',
            value: productos.length,
            icon: <Package className="w-6 h-6" />,
            color: 'bg-blue-500',
            href: '/productos'
        },
        {
            title: 'Usuarios',
            value: usuarios.length,
            icon: <Users className="w-6 h-6" />,
            color: 'bg-green-500',
            href: '/usuarios'
        },
        {
            title: 'Categorías',
            value: categorias.length,
            icon: <Tag className="w-6 h-6" />,
            color: 'bg-purple-500',
            href: '/categorias'
        },
        {
            title: 'Proveedores',
            value: proveedores.length,
            icon: <Truck className="w-6 h-6" />,
            color: 'bg-orange-500',
            href: '../proveedores'
        },
    ];

    const hasPermission = (module: string) => user?.modules.includes(module) ?? false;

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

                {/* Stats Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat) => (
                            <a
                                key={stat.title}
                                href={stat.href}
                                className="hover:scale-105 transition-transform cursor-pointer"
                                onClick={(e) => {
                                    if (!hasPermission(stat.href.replace('/', '').toLowerCase())) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <Card className={hasPermission(stat.href.replace('/', '').toLowerCase()) ? '' : 'opacity-50 cursor-not-allowed'}>
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
                            </a>
                        ))}
                    </div>
                )}

                {/* Quick Actions */}
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
                            {[
                                { name: 'Gestionar Productos', module: 'productos', href: '/productos' },
                                { name: 'Gestionar Usuarios', module: 'usuarios', href: '/usuarios' },
                                { name: 'Gestionar Categorías', module: 'categorias', href: '/categorias' },
                                { name: 'Gestionar Proveedores', module: 'proveedores', href: '/proveedores' },
                                { name: 'Ver Movimientos', module: 'movimientos', href: '/movimientos' },
                                { name: 'Ver Auditoría', module: 'auditoria', href: '/auditoria' },
                            ].map((action) => (
                                hasPermission(action.module) && (
                                    <a
                                        key={action.name}
                                        href={action.href}
                                        className="p-4 border rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        <p className="font-medium text-gray-900">{action.name}</p>
                                    </a>
                                )
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="bg-blue-50">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            <span>Información del Sistema</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700">
                            Usa la barra lateral izquierda para navegar entre los diferentes módulos del sistema.
                            Los módulos disponibles dependen de tu rol y permisos.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};