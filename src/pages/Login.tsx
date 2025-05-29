
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();  
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // Check if user is already authenticated
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };
    
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('username', session.user.email || '');
        navigate('/team', { replace: true });
      } else {
        setUser(null);
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('username');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // If user is already authenticated, redirect to team page
  if (user) {
    return <Navigate to="/team" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Login error:', error);
        
        let errorMessage = 'Erro ao fazer login';
        
        switch (error.message) {
          case 'Invalid login credentials':
            errorMessage = 'Email ou senha incorretos';
            break;
          case 'Email not confirmed':
            errorMessage = 'Email não confirmado. Verifique sua caixa de entrada';
            break;
          case 'Too many requests':
            errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos';
            break;
          default:
            errorMessage = error.message;
        }

        toast({
          variant: "destructive",
          title: "Erro de Autenticação",
          description: errorMessage,
        });
        setIsLoading(false);
        return;
      }

      if (data.user) {
        console.log('Login successful:', data.user.email);
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo, ${data.user.email}!`,
        });
        // Navigation will be handled by the auth state change listener
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-500 to-orange-400 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Tecnocomp</CardTitle>
          <p className="text-center text-gray-500">Entre para ver a equipe completa</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? "Autenticando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-orange-500 hover:text-orange-700"
          >
            Voltar para página inicial
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
