
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { teamMembers } from '@/data/teamMembers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import HeaderMenu from '@/components/HeaderMenu';

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

    if (name) {
      const decodedName = decodeURIComponent(name);
      const existingMember = teamMembers.find(m => m.nome === decodedName);
      
      if (existingMember) {
        setMember({
          nome: existingMember.nome,
          cargo: existingMember.cargo,
          tel: existingMember.tel,
          email: existingMember.email,
          site: existingMember.site,
          portfolio: existingMember.portfolio,
          image: existingMember.image || ''
        });
      } else {
        toast({
          title: "Erro",
          description: "Membro não encontrado",
          variant: "destructive"
        });
        navigate('/team');
      }
    }
  }, [name, navigate, isAdmin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    // Find and update the team member
    const memberIndex = teamMembers.findIndex(m => m.nome === decodeURIComponent(name));
    
    if (memberIndex !== -1) {
      teamMembers[memberIndex] = {
        ...teamMembers[memberIndex],
        ...member
      };
      
      toast({
        title: "Sucesso",
        description: `Informações de ${member.nome} foram atualizadas.`
      });
      
      // Navigate back to the team page
      navigate('/team');
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
