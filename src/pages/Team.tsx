import React, { useState, useEffect } from 'react';
import { TeamMember, TeamMemberInsert, Departamento } from '@/data/teamMembers';
import TeamMemberCard from '@/components/TeamMemberCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import "./CSS/teamstyle.css";

const Team = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  
  const [newMember, setNewMember] = useState<TeamMemberInsert>({
    nome: '',
    cargo: '',
    tel: '',
    email: '',
    site: 'www.tecnocomp.com.br',
    portfolio: 'www.tecnocomp.com.br/portfiolio',
    departamento: 'Govtech',
    image_url: ''
  });
  
  const [memberToEdit, setMemberToEdit] = useState<TeamMember | null>(null);
  
  const departamentos: Departamento[] = [
    "Govtech",
    "Marketing",
    "Inovação",
    "Grandes Contas",
    "Varejo",
    "Financeiro",
    "Fiscal",
    "Saúde",
    "Projetos",
    "Corporativo",
  ];

  // Fetch team members from Supabase
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Error fetching team members:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar membros da equipe.",
          variant: "destructive"
        });
        return;
      }

      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const resetNewMember = () => {
    setNewMember({
      nome: '',
      cargo: '',
      tel: '',
      email: '',
      site: 'www.tecnocomp.com.br',
      portfolio: 'www.tecnocomp.com.br/portfiolio',
      departamento: 'Govtech',
      image_url: ''
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (openEditModal && memberToEdit) {
      setMemberToEdit({
        ...memberToEdit,
        [name]: value
      });
    } else {
      setNewMember({
        ...newMember,
        [name]: value
      });
    }
  };
  
  const handleSelectChange = (value: Departamento, field: string) => {
    if (openEditModal && memberToEdit) {
      setMemberToEdit({
        ...memberToEdit,
        [field]: value
      });
    } else {
      setNewMember({
        ...newMember,
        [field]: value
      });
    }
  };
  
  const handleAddMember = async (e: React.FormEvent) => {
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
      
      // Refresh the list and close modal
      fetchTeamMembers();
      resetNewMember();
      setOpenAddModal(false);
    } catch (error) {
      console.error('Error adding team member:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar membro da equipe.",
        variant: "destructive"
      });
    }
  };
  
  const handleEditMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!memberToEdit) return;
    
    // Validation
    if (!memberToEdit.nome || !memberToEdit.cargo || !memberToEdit.email) {
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
          nome: memberToEdit.nome,
          cargo: memberToEdit.cargo,
          tel: memberToEdit.tel,
          email: memberToEdit.email,
          site: memberToEdit.site,
          portfolio: memberToEdit.portfolio,
          departamento: memberToEdit.departamento,
          image_url: memberToEdit.image_url,
          administrador: memberToEdit.administrador
        })
        .eq('id', memberToEdit.id);

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
        description: `Informações de ${memberToEdit.nome} foram atualizadas.`
      });
      
      // Refresh the list and close modal
      fetchTeamMembers();
      setOpenEditModal(false);
      setMemberToEdit(null);
    } catch (error) {
      console.error('Error updating team member:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar membro da equipe.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteMember = async (memberToDelete: TeamMember) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberToDelete.id);

      if (error) {
        console.error('Error deleting team member:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir membro da equipe.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Membro excluído",
        description: `${memberToDelete.nome} foi removido da equipe com sucesso.`
      });
      
      // Refresh the list
      fetchTeamMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir membro da equipe.",
        variant: "destructive"
      });
    }
  };
  
  const openEditModalForMember = (member: TeamMember) => {
    setMemberToEdit(member);
    setOpenEditModal(true);
  };

  if (loading) {
    return (
      <div className="content">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-white">Carregando membros da equipe...</div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="content">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1>Conheça o time GovTech</h1>
            <h2 className="text-white text-lg max-w-2xl">
              Os profissionais da Tecnocomp dedicados a entregar 
              soluções inovadoras para o setor governamental.
            </h2>
          </div>
          {isAdmin && (
            <Button 
              onClick={() => {
                resetNewMember();
                setOpenAddModal(true);
              }}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Adicionar Membro
            </Button>
          )}
        </header>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <TeamMemberCard
              key={member.id} 
              member={member} 
              onDelete={isAdmin ? handleDeleteMember : undefined}
              onEdit={isAdmin ? openEditModalForMember : undefined}
            />
          ))}
        </div>
        
        {/* Add Member Modal */}
        <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
          <DialogContent className="bg-black/80 border-gray-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">Adicionar Novo Membro da Equipe</DialogTitle>
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 text-white">
                <X className="h-4 w-4" />
              </DialogClose>
            </DialogHeader>
            
            <form onSubmit={handleAddMember} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome" className="text-white">Nome Completo *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={newMember.nome}
                    onChange={handleInputChange}
                    placeholder="Nome completo do colaborador"
                    required
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>

                <div>
                  <Label htmlFor="cargo" className="text-white">Cargo *</Label>
                  <Input
                    id="cargo"
                    name="cargo"
                    value={newMember.cargo}
                    onChange={handleInputChange}
                    placeholder="Cargo ou função"
                    required
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>

                <div>
                  <Label htmlFor="departamento" className="text-white">Departamento *</Label>
                  <Select 
                    value={newMember.departamento} 
                    onValueChange={(value: Departamento) => handleSelectChange(value, 'departamento')}
                  >
                    <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                      <SelectValue placeholder="Selecione um departamento" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
                      {departamentos.map((departamento) => (
                        <SelectItem key={departamento} value={departamento}>
                          {departamento}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tel" className="text-white">Telefone</Label>
                  <Input
                    id="tel"
                    name="tel"
                    value={newMember.tel || ''}
                    onChange={handleInputChange}
                    placeholder="+55 00 00000-0000"
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-white">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newMember.email}
                    onChange={handleInputChange}
                    placeholder="email@tecnocomp.com.br"
                    required
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>

                <div>
                  <Label htmlFor="image_url" className="text-white">URL da Imagem (opcional)</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={newMember.image_url || ''}
                    onChange={handleInputChange}
                    placeholder="Link para foto do colaborador"
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="w-full">
                  Adicionar Membro
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Edit Member Modal */}
        <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
          <DialogContent className="bg-black/80 border-gray-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">Editar Membro da Equipe</DialogTitle>
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 text-white">
                <X className="h-4 w-4" />
              </DialogClose>
            </DialogHeader>
            
            {memberToEdit && (
              <form onSubmit={handleEditMember} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-nome" className="text-white">Nome Completo *</Label>
                    <Input
                      id="edit-nome"
                      name="nome"
                      value={memberToEdit.nome}
                      onChange={handleInputChange}
                      placeholder="Nome completo do colaborador"
                      required
                      className="bg-gray-800 text-white border-gray-700"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-cargo" className="text-white">Cargo *</Label>
                    <Input
                      id="edit-cargo"
                      name="cargo"
                      value={memberToEdit.cargo}
                      onChange={handleInputChange}
                      placeholder="Cargo ou função"
                      required
                      className="bg-gray-800 text-white border-gray-700"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-departamento" className="text-white">Departamento *</Label>
                    <Select 
                      value={memberToEdit.departamento} 
                      onValueChange={(value: Departamento) => handleSelectChange(value, 'departamento')}
                    >
                      <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                        <SelectValue placeholder="Selecione um departamento" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white border-gray-700">
                        {departamentos.map((departamento) => (
                          <SelectItem key={departamento} value={departamento}>
                            {departamento}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="edit-tel" className="text-white">Telefone</Label>
                    <Input
                      id="edit-tel"
                      name="tel"
                      value={memberToEdit.tel || ''}
                      onChange={handleInputChange}
                      placeholder="+55 00 00000-0000"
                      className="bg-gray-800 text-white border-gray-700"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-email" className="text-white">Email *</Label>
                    <Input
                      id="edit-email"
                      name="email"
                      type="email"
                      value={memberToEdit.email}
                      onChange={handleInputChange}
                      placeholder="email@tecnocomp.com.br"
                      required
                      className="bg-gray-800 text-white border-gray-700"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-image_url" className="text-white">URL da Imagem (opcional)</Label>
                    <Input
                      id="edit-image_url"
                      name="image_url"
                      value={memberToEdit.image_url || ''}
                      onChange={handleInputChange}
                      placeholder="Link para foto do colaborador"
                      className="bg-gray-800 text-white border-gray-700"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit" className="w-full">
                    Salvar Alterações
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Team;
