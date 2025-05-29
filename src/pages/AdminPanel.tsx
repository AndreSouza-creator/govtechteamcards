
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserPlus, Shield, ShieldX } from 'lucide-react';

type TeamMember = Database['public']['Tables']['team_members']['Row'];

const AdminPanel = () => {
  const { isAdmin, loading } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchTeamMembers();
    }
  }, [isAdmin]);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Erro ao buscar membros:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar membros da equipe.",
          variant: "destructive"
        });
        return;
      }

      setMembers(data || []);
    } catch (error) {
      console.error('Erro inesperado:', error);
    } finally {
      setLoadingMembers(false);
    }
  };

  const toggleAdminStatus = async (member: TeamMember) => {
    try {
      const newAdminStatus = !member.administrador;
      
      const { error } = await supabase
        .from('team_members')
        .update({ administrador: newAdminStatus })
        .eq('id', member.id);

      if (error) {
        console.error('Erro ao atualizar status de admin:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar status de administrador.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Status atualizado",
        description: `${member.nome} ${newAdminStatus ? 'agora é' : 'não é mais'} administrador.`,
      });

      fetchTeamMembers();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar status.",
        variant: "destructive"
      });
    }
  };

  const syncUserWithEmail = async () => {
    if (!searchEmail.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Digite um email para sincronizar.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Buscar o usuário autenticado pelo email na tabela team_members
      const { data: teamMember, error: teamMemberError } = await supabase
        .from('team_members')
        .select('*')
        .eq('email', searchEmail.trim())
        .single();

      if (teamMemberError || !teamMember) {
        toast({
          title: "Membro não encontrado",
          description: "Não foi encontrado um membro da equipe com este email.",
          variant: "destructive"
        });
        return;
      }

      // Buscar o usuário no sistema de autenticação
      const { data: authResponse, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Erro ao buscar usuários:', authError);
        toast({
          title: "Erro",
          description: "Erro ao buscar usuários no sistema de autenticação.",
          variant: "destructive"
        });
        return;
      }

      const authUser = authResponse.users.find((user: any) => user.email === searchEmail.trim());
      
      if (!authUser) {
        toast({
          title: "Usuário não encontrado",
          description: "Não foi encontrado um usuário com este email no sistema de autenticação.",
          variant: "destructive"
        });
        return;
      }

      // Atualizar team_member com o user_id
      const { error: updateError } = await supabase
        .from('team_members')
        .update({ user_id: authUser.id })
        .eq('email', searchEmail.trim());

      if (updateError) {
        console.error('Erro ao sincronizar:', updateError);
        toast({
          title: "Erro",
          description: "Erro ao sincronizar usuário.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Sincronização realizada",
        description: "Usuário sincronizado com sucesso.",
      });

      setSearchEmail('');
      fetchTeamMembers();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado durante a sincronização.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="content">
        <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
          <div className="text-white">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/team" replace />;
  }

  return (
    <div className="content">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">Painel de Administração</h1>
          <h2 className="text-white text-lg">
            Gerencie permissões e sincronize usuários
          </h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Sincronizar Usuário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email do usuário</Label>
                  <Input
                    id="email"
                    type="email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    placeholder="usuario@tecnocomp.com.br"
                  />
                </div>
                <Button onClick={syncUserWithEmail} className="w-full">
                  Sincronizar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {members.length}
                  </div>
                  <div className="text-sm text-gray-600">Total de Membros</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {members.filter(m => m.administrador).length}
                  </div>
                  <div className="text-sm text-gray-600">Administradores</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Membros da Equipe</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingMembers ? (
              <div className="text-center py-8">Carregando membros...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.nome}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.cargo}</TableCell>
                      <TableCell>{member.departamento}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {member.user_id ? (
                            <Badge variant="default">Sincronizado</Badge>
                          ) : (
                            <Badge variant="destructive">Não sincronizado</Badge>
                          )}
                          {member.administrador && (
                            <Badge variant="secondary">Admin</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {member.user_id && (
                          <Button
                            variant={member.administrador ? "destructive" : "default"}
                            size="sm"
                            onClick={() => toggleAdminStatus(member)}
                            className="flex items-center gap-2"
                          >
                            {member.administrador ? (
                              <>
                                <ShieldX className="h-4 w-4" />
                                Remover Admin
                              </>
                            ) : (
                              <>
                                <Shield className="h-4 w-4" />
                                Tornar Admin
                              </>
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
