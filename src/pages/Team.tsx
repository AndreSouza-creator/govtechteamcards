
import React, { useState } from 'react';
import { teamMembers, Departamento } from '@/data/teamMembers';
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
import "./CSS/teamstyle.css";

const Team = () => {
  const [members, setMembers] = useState(teamMembers);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  
  const [newMember, setNewMember] = useState({
    nome: '',
    cargo: '',
    tel: '',
    email: '',
    site: 'www.tecnocomp.com.br',
    portfolio: 'www.tecnocomp.com.br/portfiolio',
    departamento: 'Govtech' as Departamento,
    image: ''
  });
  
  const [memberToEdit, setMemberToEdit] = useState(null);
  
  const departamentos: Departamento[] = [
    "Govtech",
    "Marketing",
    "Inovação",
    "ServiceDesk",
    "Grandes Contas",
    "Varejo",
    "Financeiro",
    "Fiscal",
    "Projetos"
  ];
  
  const resetNewMember = () => {
    setNewMember({
      nome: '',
      cargo: '',
      tel: '',
      email: '',
      site: 'www.tecnocomp.com.br',
      portfolio: 'www.tecnocomp.com.br/portfiolio',
      departamento: 'Govtech',
      image: ''
    });
  };
  
  const handleInputChange = (e) => {
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
  
  const handleSelectChange = (value, field) => {
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
  
  const handleAddMember = (e) => {
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
    setMembers([...teamMembers]);
    
    toast({
      title: "Sucesso",
      description: `${newMember.nome} foi adicionado à equipe.`
    });
    
    // Reset form and close modal
    resetNewMember();
    setOpenAddModal(false);
  };
  
  const handleEditMember = (e) => {
    e.preventDefault();
    
    // Validation
    if (!memberToEdit.nome || !memberToEdit.cargo || !memberToEdit.email) {
      toast({
        title: "Erro",
        description: "Por favor, preencha os campos obrigatórios (Nome, Cargo e Email).",
        variant: "destructive"
      });
      return;
    }

    // Store original name to find member
    const originalNome = memberToEdit.originalNome || memberToEdit.nome;
    
    // Find and update the team member
    const memberIndex = teamMembers.findIndex(m => m.nome === originalNome);
    
    if (memberIndex !== -1) {
      // Create a new object without the originalNome property
      const { originalNome: _, ...memberWithoutOriginalNome } = memberToEdit;
      
      teamMembers[memberIndex] = {
        ...memberWithoutOriginalNome
      };
      
      setMembers([...teamMembers]);
      
      toast({
        title: "Sucesso",
        description: `Informações de ${memberToEdit.nome} foram atualizadas.`
      });
      
      // Close modal
      setOpenEditModal(false);
      setMemberToEdit(null);
    }
  };
  
  const handleDeleteMember = (memberToDelete) => {
    // Find the index of the member to delete
    const memberIndex = teamMembers.findIndex(m => m.nome === memberToDelete.nome);
    
    // Remove the member from the array
    if (memberIndex !== -1) {
      teamMembers.splice(memberIndex, 1);
      setMembers([...teamMembers]);
      
      toast({
        title: "Membro excluído",
        description: `${memberToDelete.nome} foi removido da equipe com sucesso.`
      });
    }
  };
  
  const openEditModalForMember = (member) => {
    // Create a copy of the member with an additional property to store the original name
    // This helps us find the member later if the name changes
    const memberForEdit = {
      ...member,
      originalNome: member.nome
    };
    setMemberToEdit(memberForEdit);
    setOpenEditModal(true);
  };
  
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
          {members.map((member, index) => (
            <TeamMemberCard 
              key={index} 
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
                    onValueChange={(value) => handleSelectChange(value, 'departamento')}
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
                    value={newMember.tel}
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
                  <Label htmlFor="image" className="text-white">URL da Imagem (opcional)</Label>
                  <Input
                    id="image"
                    name="image"
                    value={newMember.image}
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
                      onValueChange={(value) => handleSelectChange(value, 'departamento')}
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
                      value={memberToEdit.tel}
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
                    <Label htmlFor="edit-image" className="text-white">URL da Imagem (opcional)</Label>
                    <Input
                      id="edit-image"
                      name="image"
                      value={memberToEdit.image}
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
