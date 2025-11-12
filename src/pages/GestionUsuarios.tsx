// src/pages/GestionUsuarios.tsx

import React, { useState, useEffect } from 'react';

// --- Definición de Tipos (Buena práctica en TypeScript) ---
interface Rol {
  id: string;
  nombre: string;
}

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
}

const GestionUsuarios: React.FC = () => {
  // --- Estados del Componente ---
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- useEffect para Cargar Datos del Backend ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Obtenemos la URL base de las variables de entorno
        const apiUrl = import.meta.env.VITE_API_BASE_URL;

        // Hacemos las peticiones para usuarios y roles en paralelo
        const [usuariosResponse, rolesResponse] = await Promise.all([
          fetch(`${apiUrl}/usuarios`),
          fetch(`${apiUrl}/roles`),
        ]);

        if (!usuariosResponse.ok || !rolesResponse.ok) {
          throw new Error('No se pudieron cargar los datos del servidor.');
        }

        const usuariosData: Usuario[] = await usuariosResponse.json();
        const rolesData: Rol[] = await rolesResponse.json();

        setUsuarios(usuariosData);
        setRoles(rolesData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // El array vacío asegura que esto se ejecute solo una vez, al montar el componente

  // --- Función para Manejar el Cambio de Rol ---
  const handleRoleChange = async (userId: string, newRoleId: string) => {
    // Buscamos el usuario que vamos a modificar en el estado local
    const usuarioOriginal = usuarios.find(u => u.id === userId);
    if (!usuarioOriginal) return;

    // Creamos el objeto con los datos a enviar al backend
    const updatedUsuarioPayload = {
      ...usuarioOriginal,
      rol: { id: newRoleId }, // Solo necesitamos enviar el ID del nuevo rol
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/usuarios/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUsuarioPayload),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar el rol.');
      }

      // Si la actualización fue exitosa, actualizamos el estado local para reflejar el cambio
      // sin necesidad de volver a cargar toda la lista.
      setUsuarios(prevUsuarios =>
        prevUsuarios.map(u =>
          u.id === userId ? { ...u, rol: roles.find(r => r.id === newRoleId)! } : u
        )
      );
    } catch (err: any) {
      alert(`Error: ${err.message}`); // Mostramos un error al usuario
      // (En una app real, usarías un sistema de notificaciones más elegante)
    }
  };


  // --- Renderizado del Componente ---
  if (isLoading) {
    return <div className="p-8 text-center">Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
      <p className="mt-2 text-gray-600">
        Selecciona un empleado de la lista para asignarle o cambiar su rol.
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Rol Asignado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td className="whitespace-nowrap px-6 py-4">{usuario.nombre}</td>
                <td className="whitespace-nowrap px-6 py-4">{usuario.email}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  {/* El desplegable para cambiar el rol */}
                  <select
                    value={usuario.rol.id}
                    onChange={(e) => handleRoleChange(usuario.id, e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    {roles.map(rol => (
                      <option key={rol.id} value={rol.id}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionUsuarios;