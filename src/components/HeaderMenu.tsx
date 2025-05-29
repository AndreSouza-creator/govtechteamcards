
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import tecnologo from './../img/Logo.svg'

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const HeaderMenu: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isAdmin, teamMemberData, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast({
          variant: "destructive",
          title: "Erro ao sair",
          description: "Ocorreu um erro ao fazer logout.",
        });
      } else {
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso.",
        });
      }
    } catch (error) {
      console.error('Unexpected logout error:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-500 to-orange-400 flex items-center justify-center">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return (
    <>
      <div className="headernavbar">
        <img src={tecnologo || ""} alt="Tecnocomp Logo"/>
        <div className="flex items-center gap-2">
          {teamMemberData && (
            <span className="text-white text-sm">
              Bem-vindo, {teamMemberData.nome}
              {isAdmin && <span className="ml-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs">Admin</span>}
            </span>
          )}
          {!teamMemberData && (
            <span className="text-white text-sm">Bem-vindo, {user.email}</span>
          )}
          
          {isAdmin && (
            <Button 
              variant="ghost" 
              className="text-white hover:bg-orange-600" 
              onClick={() => navigate('/admin')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Admin
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            className="text-white hover:bg-orange-600" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      {children}
    </>
  );
};

export default HeaderMenu;
