
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import HeaderMenu from './HeaderMenu';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const location = useLocation();
  const { user, loading, isAdmin } = useAuth();
  const { toast } = useToast();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }
  
  if (!user) {
    // Redirect to login page with the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (adminOnly && !isAdmin) {
    toast({
      variant: "destructive",
      title: "Acesso Negado",
      description: "Você não tem permissões de administrador para acessar esta página.",
    });
    return <Navigate to="/team" replace />;
  }
  
  return <HeaderMenu>{children}</HeaderMenu>;
};

export default ProtectedRoute;
