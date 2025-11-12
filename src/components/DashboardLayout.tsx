// src/components/DashboardLayout.tsx

import React from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const activeLinkStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Barra Lateral de Navegación */}
      <aside className="flex w-64 flex-col bg-gray-800 text-white">
        <div className="p-4 text-center text-2xl font-bold">
          ERG-POS
        </div>
        
        {/* ======================================================= */}
        {/* ===== ESTA ES LA SECCIÓN CORREGIDA Y ACTUALIZADA ===== */}
        {/* ======================================================= */}
        <nav className="flex-1 p-2">
          <NavLink
            to="/dashboard"
            className="block rounded px-4 py-2 hover:bg-gray-700"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          >
            Inicio
          </NavLink>

          {/* CAMBIO AQUÍ: Ahora busca 'admin', que coincide con 'ADMIN'.toLowerCase() */}
          {user && user.rol.nombre.toLowerCase() === 'admin' && (
            <NavLink
              to="/gestion-usuarios"
              className="mt-2 block rounded px-4 py-2 hover:bg-gray-700"
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            >
              Gestión de Usuarios
            </NavLink>
          )}

          {/* CAMBIO AQUÍ: Ahora busca 'admin' y 'inventario' */}
          {user && ['admin', 'inventario'].includes(user.rol.nombre.toLowerCase()) && (
            <NavLink
              to="/gestion-productos"
              className="mt-2 block rounded px-4 py-2 hover:bg-gray-700"
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            >
              Gestión de Productos
            </NavLink>
          )}
        </nav>
        
        <div className="border-t border-gray-700 p-4">
          <p className="font-semibold">{user ? user.nombre : 'Usuario'}</p>
          <p className="text-sm text-gray-400">{user ? user.rol.nombre : 'Rol'}</p>
          <button
            onClick={handleLogout}
            className="mt-4 w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Área de Contenido Principal */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;