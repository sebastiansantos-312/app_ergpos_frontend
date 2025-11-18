// App.tsx - CORREGIDO
import  { useEffect } from 'react'; // ← AGREGAR useEffect aquí
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routes/AppRoutes';
import { useAuthStore } from './stores/authStore';

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;