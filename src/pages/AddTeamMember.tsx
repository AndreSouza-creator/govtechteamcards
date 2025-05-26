
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import HeaderMenu from '@/components/HeaderMenu';
import ImageUpload from '@/components/ImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Departamento = Database['public']['Enums']['departamento'];
type TeamMemberInsert = Database['public']['Tables']['team_members']['Insert'];

const AddTeamMember = () => {
  const navigate = useNavigate();
  const [newMember, setNewMember] = useState<TeamMemberInsert>({
    nome: '',
    cargo: '',
    tel: '',
    departamento: 'Govtech',
    email: '',
    site: 'www.tecnocomp.com.br',
    portfolio: 'www.tecnocomp.com.br/portfiolio',
    image_url: ''
  });

  const departamentos: Departamento[] = [
    "Govtech",
    "Marketing",
    "Inovação",
    "ServiceDesk",
    "Grandes Contas",
    "Varejo",
    "Financeiro",
    "Fiscal",
    "Saúde",
    "Projetos",
    "Corporativo",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: Departamento) => {
    setNewMember(prev => ({
      ...prev,
      departamento: value
    }));
  };

  const handleImageUrlChange = (url: string | null) => {
    setNewMember(prev => ({
      ...prev,
      image_url: url || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      const { error } = await supabase
        .from('team_members')
        .insert([newMember]);

      if (error) {
        console.error('Error adding team member:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar membro da equipe.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: `${newMember.nome} foi adicionado à equipe.`
      });
      
      // Navigate back to the team page
      navigate('/team');
    } catch (error) {
      console.error('Error adding team member:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar membro da equipe.",
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
            <h1 className="text-xl font-bold">Adicionar Novo Membro da Equipe</h1>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <ImageUpload
              currentImageUrl={newMember.image_url}
              onImageUrlChange={handleImageUrlChange}
              memberName={newMember.nome}
            />

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
                <Label htmlFor="departamento">Departamento *</Label>
                <Select value={newMember.departamento} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos.map((departamento) => (
                      <SelectItem key={departamento} value={departamento}>
                        {departamento}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tel">Telefone</Label>
                <Input
                  id="tel"
                  name="tel"
                  value={newMember.tel || ''}
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
