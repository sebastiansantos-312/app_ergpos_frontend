// App.tsx - CORREGIDO
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routes/AppRoutes';
import { useAuthStore } from './stores/authStore';
import './index.css';

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