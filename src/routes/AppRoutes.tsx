// AppRouter.tsx - ACTUALIZADO CON PRODUCTOS Y MOVIMIENTOS
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage';
import { UsuariosPage } from '../pages/UsuariosPage';
import { PerfilPage } from '../pages/PerfilPage';
import { RolesPage } from '../pages/RolesPage';
import { UsuarioDetailPage } from '../pages/UsuarioDetailPage';
import ProductosPage from '../pages/ProductosPage';
import MovimientosPage from '../pages/MovimientosPage';
import LoginForm from '../components/LoginForm';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { PublicRoute } from '../components/PublicRoute';

export const AppRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/login" element={
                <PublicRoute>
                    <LoginForm />
                </PublicRoute>
            } />

            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <DashboardPage />
                </ProtectedRoute>
            } />

            <Route path="/usuarios" element={
                <ProtectedRoute>
                    <UsuariosPage />
                </ProtectedRoute>
            } />

            <Route path="/usuarios/:codigo" element={
                <ProtectedRoute>
                    <UsuarioDetailPage />
                </ProtectedRoute>
            } />

            <Route path="/productos" element={
                <ProtectedRoute>
                    <ProductosPage />
                </ProtectedRoute>
            } />

            <Route path="/movimientos" element={
                <ProtectedRoute>
                    <MovimientosPage />
                </ProtectedRoute>
            } />

            <Route path="/roles" element={
                <ProtectedRoute>
                    <RolesPage />
                </ProtectedRoute>
            } />

            <Route path="/perfil" element={
                <ProtectedRoute>
                    <PerfilPage />
                </ProtectedRoute>
            } />

            {/* Ruta 404 */}
            <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
    );
};