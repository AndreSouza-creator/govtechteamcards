
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type TeamMemberData = {
  id: string;
  nome: string;
  cargo: string;
  email: string;
  administrador: boolean;
  departamento: string;
} | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  teamMemberData: TeamMemberData;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  teamMemberData: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [teamMemberData, setTeamMemberData] = useState<TeamMemberData>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserTeamData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('id, nome, cargo, email, administrador, departamento')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        setIsAdmin(false);
        setTeamMemberData(null);
        sessionStorage.setItem('isAdmin', 'false');
        sessionStorage.removeItem('userTeamData');
        return;
      }

      if (data) {
        setTeamMemberData(data);
        setIsAdmin(data.administrador || false);
        
        // Atualizar sessionStorage
        sessionStorage.setItem('isAdmin', data.administrador ? 'true' : 'false');
        sessionStorage.setItem('userTeamData', JSON.stringify(data));
      } else {
        setIsAdmin(false);
        setTeamMemberData(null);
        sessionStorage.setItem('isAdmin', 'false');
        sessionStorage.removeItem('userTeamData');
      }
    } catch (error) {
      console.error('Erro inesperado ao buscar dados do usuário:', error);
      setIsAdmin(false);
      setTeamMemberData(null);
    }
  };

  useEffect(() => {
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          sessionStorage.setItem('isAuthenticated', 'true');
          sessionStorage.setItem('username', session.user.email || '');
          
          // Buscar dados do usuário com delay para evitar problemas
          setTimeout(() => {
            fetchUserTeamData(session.user.id);
          }, 100);
        } else {
          setIsAdmin(false);
          setTeamMemberData(null);
          sessionStorage.removeItem('isAuthenticated');
          sessionStorage.removeItem('username');
          sessionStorage.removeItem('isAdmin');
          sessionStorage.removeItem('userTeamData');
        }
        
        setLoading(false);
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('username', session.user.email || '');
        fetchUserTeamData(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isAdmin, 
      teamMemberData, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
