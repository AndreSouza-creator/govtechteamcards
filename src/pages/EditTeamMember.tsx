
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import HeaderMenu from '@/components/HeaderMenu';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

type TeamMember = Database['public']['Tables']['team_members']['Row'];

const EditTeamMember = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const [member, setMember] = useState({
    nome: '',
    cargo: '',
    tel: '',
    email: '',
    site: 'www.tecnocomp.com.br',
    portfolio: 'www.tecnocomp.com.br/portfiolio',
    image: ''
  });
  
  // Check if user is admin
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  
  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para editar membros da equipe.",
        variant: "destructive"
      });
      navigate('/team');
      return;
    }

    const fetchMember = async () => {
      if (name) {
        try {
          const { data, error } = await supabase
            .from('team_members')
            .select('*')
            .eq('nome', decodeURIComponent(name))
            .single();

          if (error) {
            console.error('Error fetching team member:', error);
            toast({
              title: "Erro",
              description: "Membro não encontrado",
              variant: "destructive"
            });
            navigate('/team');
            return;
          }

          if (data) {
            setMember({
              nome: data.nome,
              cargo: data.cargo,
              tel: data.tel || '',
              email: data.email,
              site: data.site || 'www.tecnocomp.com.br',
              portfolio: data.portfolio || 'www.tecnocomp.com.br/portfiolio',
              image: data.image_url || ''
            });
          }
        } catch (error) {
          console.error('Error fetching member:', error);
          toast({
            title: "Erro",
            description: "Erro ao carregar dados do membro",
            variant: "destructive"
          });
          navigate('/team');
        }
      }
    };

    fetchMember();
  }, [name, navigate, isAdmin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!member.nome || !member.cargo || !member.email) {
      toast({
        title: "Erro",
        description: "Por favor, preencha os campos obrigatórios (Nome, Cargo e Email).",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('team_members')
        .update({
          nome: member.nome,
          cargo: member.cargo,
          tel: member.tel,
          email: member.email,
          site: member.site,
          portfolio: member.portfolio,
          image_url: member.image
        })
        .eq('nome', decodeURIComponent(name || ''));

      if (error) {
        console.error('Error updating team member:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar membro da equipe.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: `Informações de ${member.nome} foram atualizadas.`
      });
      
      // Navigate back to the team page
      navigate('/team');
    } catch (error) {
      console.error('Error updating team member:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar membro da equipe.",
        variant: "destructive"
      });
    }
  };

  return (
    <HeaderMenu>
      <div className="content">
        <div className="max-w-2xl mx-auto p-6">
          <header className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/team')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold">Editar Membro da Equipe</h1>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={member.nome}
                  onChange={handleInputChange}
                  placeholder="Nome completo do colaborador"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cargo">Cargo *</Label>
                <Input
                  id="cargo"
                  name="cargo"
                  value={member.cargo}
                  onChange={handleInputChange}
                  placeholder="Cargo ou função"
                  required
                />
              </div>

              <div>
                <Label htmlFor="tel">Telefone</Label>
                <Input
                  id="tel"
                  name="tel"
                  value={member.tel}
                  onChange={handleInputChange}
                  placeholder="+55 00 00000-0000"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={member.email}
                  onChange={handleInputChange}
                  placeholder="email@tecnocomp.com.br"
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">URL da Imagem (opcional)</Label>
                <Input
                  id="image"
                  name="image"
                  value={member.image}
                  onChange={handleInputChange}
                  placeholder="Link para foto do colaborador"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Salvar Alterações
            </Button>
          </form>
        </div>
      </div>
    </HeaderMenu>
  );
};

export default EditTeamMember;
