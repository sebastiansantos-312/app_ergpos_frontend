import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { PublicRoute } from '../components/PublicRoute';
import { PermissionGuard } from '../components/PermissionGuard';

// Pages
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { PerfilPage } from '../features/perfil/PerfilPage';
import { RolesPage } from '../features/roles/RolesPage';
import { UsuarioDetailPage } from '../features/usuario-detail/UsuarioDetailPage';
import { UsuariosPage } from '../features/usuarios/UsuariosPage';
import { CategoriasPage } from '../features/categorias/CategoriasPage';
import { ProductosPage } from '../features/productos/ProductosPage';
import { MovimientosPage } from '../features/movimientos/MovimientosPage';
import { ProveedoresPage } from '../features/proveedores/ProveedoresPage';
import { LoadingSpinner } from './../components/ui/LoadingSpinner';
import { AuditoriaPage } from './../features/auditoria/AuditoriaPage';
import { ReportesPage } from '@/pages/ReportesPage';
export const AppRoutes: React.FC = () => {
    const { isLoading, loadUser } = useAuthStore();

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <Routes>
            {/* Redirect to dashboard by default */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* ==================== AUTH ROUTES ==================== */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />

            {/* ==================== PROTECTED ROUTES ==================== */}

            {/* Dashboard - All authenticated users */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <PermissionGuard requiredModules={['dashboard']}>
                            <DashboardPage />
                        </PermissionGuard>
                    </ProtectedRoute>
                }
            />

            {/* Usuarios - ADMINISTRADOR only */}
            <Route
                path="/usuarios"
                element={
                    <ProtectedRoute>
                        <PermissionGuard requiredModules={['usuarios']}>
                            <UsuariosPage />
                        </PermissionGuard>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/usuarios/:email"
                element={
                    <ProtectedRoute>
                        <PermissionGuard requiredModules={['usuarios']}>
                            <UsuarioDetailPage />
                        </PermissionGuard>
                    </ProtectedRoute>
                }
            />

            {/* Roles - ADMINISTRADOR only */}
            <Route
                path="/roles"
                element={
                    <ProtectedRoute>
                        <PermissionGuard requiredModules={['roles']}>
                            <RolesPage />
                        </PermissionGuard>
                    </ProtectedRoute>
                }
            />

            {/* Productos - ADMINISTRADOR, SUPERVISOR, OPERADOR */}
            <Route
                path="/productos"
                element={
                    <ProtectedRoute>
                        <PermissionGuard requiredModules={['productos']}>
                            <ProductosPage />
                        </PermissionGuard>
                    </ProtectedRoute>
                }
            />

            {/* Categorías - ADMINISTRADOR, SUPERVISOR, OPERADOR */}
            <Route
                path="/categorias"
                element={
                    <ProtectedRoute>
                        <PermissionGuard requiredModules={['categorias']}>
                            <CategoriasPage />
                        </PermissionGuard>
                    </ProtectedRoute>
                }
            />

            {/* Proveedores - ADMINISTRADOR, SUPERVISOR, OPERADOR */}
            <Route
                path="/proveedores"
                element={
                    <ProtectedRoute>
                        <PermissionGuard requiredModules={['proveedores']}>
                            <ProveedoresPage />
                        </PermissionGuard>
                    </ProtectedRoute>
                }
            />

            {/* Movimientos - ADMINISTRADOR, SUPERVISOR, OPERADOR */}
            <Route
                path="/movimientos"
                element={
                    <ProtectedRoute>
                        <PermissionGuard requiredModules={['movimientos']}>
                            <MovimientosPage />
                        </PermissionGuard>
                    </ProtectedRoute>
                }
            />

            {/* Auditoría - ADMINISTRADOR only */}
            <Route
                path="/auditoria"
                element={
                    <ProtectedRoute>
                        <PermissionGuard requiredModules={['auditoria']}>
                            <AuditoriaPage />
                        </PermissionGuard>
                    </ProtectedRoute>
                }
            />

            {/* Perfil - All authenticated users (sin permisos específicos) */}
            <Route
                path="/perfil"
                element={
                    <ProtectedRoute>
                        <PerfilPage />
                    </ProtectedRoute>
                }
            />
            {/* Reportes - ADMINISTRADOR, SUPERVISOR */}
            <Route
                path="/reportes"
                element={
                    <ProtectedRoute>
                        <PermissionGuard requiredModules={['reportes']}>
                            <ReportesPage />
                        </PermissionGuard>
                    </ProtectedRoute>
                }
            />

            {/* 404 - Not Found */}
            <Route
                path="*"
                element={
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                        <div className="text-center space-y-4">
                            <h1 className="text-6xl font-bold text-gray-800">404</h1>
                            <p className="text-xl text-gray-600">Página no encontrada</p>
                            <a
                                href="/dashboard"
                                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Volver al Dashboard
                            </a>
                        </div>
                    </div>
                }
            />
        </Routes>
    );
};