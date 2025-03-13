// ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificación de autenticación
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    const isLoggedIn = !!token && !!userData;
    
    if (!isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [navigate]);
  
  // Verificación adicional en tiempo de renderizado
  const token = localStorage.getItem('userToken');
  const userData = localStorage.getItem('userData');
  const isLoggedIn = !!token && !!userData;
  
  if (!isLoggedIn) {
    return null; // No renderizar nada mientras redirige
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;