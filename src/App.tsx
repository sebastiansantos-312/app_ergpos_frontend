// src/App.tsx

// --- 1. IMPORTACIONES NECESARIAS ---
// Importa React y los componentes de la librería de rutas

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importa TODOS los componentes y páginas que hemos creado
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import GestionUsuarios from './pages/GestionUsuarios';
import GestionProductos from './pages/GestionProductos';

// --- 2. DEFINICIÓN DEL COMPONENTE PRINCIPAL APP ---
function App() {
  return (
    // BrowserRouter es el componente que habilita el enrutamiento
    <BrowserRouter>
      {/* Routes es el contenedor de todas las rutas individuales */}
      <Routes>
        
        {/* RUTA PÚBLICA: La raíz ("/") muestra el componente de Login */}
        <Route path="/" element={<Login />} />

        {/* GRUPO DE RUTAS PRIVADAS */}
        {/* Usamos una ruta "padre" para aplicar la protección y el layout a todas las rutas hijas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            
            {/* Estas son las rutas hijas. Solo se puede acceder si el usuario está logueado */}
            {/* y se mostrarán dentro del DashboardLayout */}
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/gestion-usuarios" element={<GestionUsuarios />} />
            <Route path="/gestion-productos" element={<GestionProductos />} />

          </Route>
        </Route>
        
        {/* RUTA COMODÍN: Se muestra si ninguna de las rutas anteriores coincide */}
        <Route path="*" element={
          <div className="flex h-screen items-center justify-center">
            <h1 className="text-4xl">404: Página no encontrada</h1>
          </div>
        } />

      </Routes>
    </BrowserRouter>
  );
}

// --- 3. EXPORTACIÓN DEL COMPONENTE ---
// Esto permite que main.tsx pueda importar y renderizar la aplicación
export default App;