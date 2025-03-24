
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamMembers } from '@/data/teamMembers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import HeaderMenu from '@/components/HeaderMenu';

const AddTeamMember = () => {
  const navigate = useNavigate();
  const [newMember, setNewMember] = useState({
    nome: '',
    cargo: '',
    tel: '',
    email: '',
    site: 'www.tecnocomp.com.br',
    portfolio: 'www.tecnocomp.com.br/portfiolio',
    image: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newMember.nome || !newMember.cargo || !newMember.email) {
      toast({
        title: "Erro",
        description: "Por favor, preencha os campos obrigatórios (Nome, Cargo e Email).",
        variant: "destructive"
      });
      return;
    }

    // Add new member to the team members array
    teamMembers.push(newMember);
    
    toast({
      title: "Sucesso",
      description: `${newMember.nome} foi adicionado à equipe.`
    });
    
    // Navigate back to the team page
    navigate('/team');
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
            <h1 className="text-xl font-bold">Adicionar Novo Membro da Equipe</h1>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={newMember.nome}
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
                  value={newMember.cargo}
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
                  value={newMember.tel}
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
                  value={newMember.email}
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
                  value={newMember.image}
                  onChange={handleInputChange}
                  placeholder="Link para foto do colaborador"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Adicionar Membro
            </Button>
          </form>
        </div>
      </div>
    </HeaderMenu>
  );
};

export default AddTeamMember;
