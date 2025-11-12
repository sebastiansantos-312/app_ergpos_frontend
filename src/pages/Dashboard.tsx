// src/pages/Dashboard.tsx

import React from 'react';

const Dashboard: React.FC = () => {
  // Obtenemos los datos del usuario desde localStorage para personalizar el saludo
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Bienvenido al Dashboard, {user ? user.nombre : 'Usuario'}!
      </h1>
      <p className="mt-2 text-gray-600">
        Esta es la página principal de tu aplicación. Navega usando el menú lateral.
      </p>
      <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-xl font-semibold">Información del Usuario</h2>
        {user ? (
          <ul className="mt-4 list-inside list-disc">
            <li><strong>Email:</strong> {user.email}</li>
            <li><strong>Rol:</strong> {user.rol.nombre}</li>
          </ul>
        ) : (
          <p>No se pudo cargar la información del usuario.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;