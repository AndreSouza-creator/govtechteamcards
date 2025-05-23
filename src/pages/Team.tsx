
import React, { useState, useEffect } from 'react';
import TeamMemberCard from '@/components/TeamMemberCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
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

import { supabase, TeamMemberFromSupabase } from '@/lib/supabase';
import { fetchTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember, uploadTeamMemberImage } from '@/services/teamMemberService';

const Team = () => {
  const [members, setMembers] = useState<TeamMemberFromSupabase[]>([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  
  const [newMember, setNewMember] = useState<Omit<TeamMemberFromSupabase, 'id'>>({
    nome: '',
    cargo: '',
    tel: '',
    email: '',
    site: 'www.tecnocomp.com.br',
    portfolio: 'www.tecnocomp.com.br/portfiolio',
    departamento: 'Govtech',
    image_url: null,
    administrador: false
  });
  
  const [memberToEdit, setMemberToEdit] = useState<TeamMemberFromSupabase | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // For type safety with the department enum
  const departamentos = [
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
  
  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTeamMembers();
        setMembers(data);
      } catch (error) {
        console.error('Error loading team members:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os membros da equipe.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTeamMembers();
  }, []);
  
  const resetNewMember = () => {
    setNewMember({
      nome: '',
      cargo: '',
      tel: '',
      email: '',
      site: 'www.tecnocomp.com.br',
      portfolio: 'www.tecnocomp.com.br/portfiolio',
      departamento: 'Govtech',
      image_url: null,
      administrador: false
    });
    setSelectedFile(null);
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
  
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter menos de 2MB.",
          variant: "destructive"
        });
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
    }
  };
  
  const handleAddMember = async (e) => {
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
      setIsLoading(true);
      
      // Upload image if selected
      let image_url = null;
      if (selectedFile) {
        image_url = await uploadTeamMemberImage(selectedFile);
      }
      
      // Add member with image URL if available
      const memberData = {
        ...newMember,
        image_url: image_url
      };
      
      const newTeamMember = await addTeamMember(memberData);
      
      // Update local state
      setMembers([...members, newTeamMember]);
      
      toast({
        title: "Sucesso",
        description: `${newMember.nome} foi adicionado à equipe.`
      });
      
      // Reset form and close modal
      resetNewMember();
      setOpenAddModal(false);
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o membro.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditMember = async (e) => {
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
      setIsLoading(true);
      
      // Upload image if selected
      let image_url = memberToEdit.image_url;
      if (selectedFile) {
        image_url = await uploadTeamMemberImage(selectedFile);
      }
      
      const updatedData = {
        ...memberToEdit,
        image_url
      };
      
      const updatedMember = await updateTeamMember(memberToEdit.id, updatedData);
      
      // Update local state
      setMembers(members.map(member => 
        member.id === memberToEdit.id ? updatedMember : member
      ));
      
      toast({
        title: "Sucesso",
        description: `Informações de ${memberToEdit.nome} foram atualizadas.`
      });
      
      // Close modal
      setOpenEditModal(false);
      setMemberToEdit(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error updating member:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o membro.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteMember = async (memberToDelete) => {
    try {
      setIsLoading(true);
      
      await deleteTeamMember(memberToDelete.id);
      
      // Update local state
      setMembers(members.filter(member => member.id !== memberToDelete.id));
      
      toast({
        title: "Membro excluído",
        description: `${memberToDelete.nome} foi removido da equipe com sucesso.`
      });
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o membro.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const openEditModalForMember = (member) => {
    setMemberToEdit(member);
    setOpenEditModal(true);
    setSelectedFile(null);
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
              disabled={isLoading}
            >
              <UserPlus className="h-4 w-4" />
              Adicionar Membro
            </Button>
          )}
        </header>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <p className="text-white text-xl">Carregando...</p>
          </div>
        ) : (
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
        )}
        
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
                  <Label htmlFor="image" className="text-white">Imagem (opcional, máx 2MB)</Label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>
                
                <div>
                  <Label htmlFor="administrador" className="flex items-center text-white">
                    <Input
                      id="administrador"
                      name="administrador"
                      type="checkbox"
                      checked={newMember.administrador || false}
                      onChange={(e) => handleSelectChange(e.target.checked, 'administrador')}
                      className="h-4 w-4 mr-2"
                    />
                    Administrador
                  </Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Adicionando..." : "Adicionar Membro"}
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
                    <Label htmlFor="edit-image" className="text-white">Nova Imagem (opcional, máx 2MB)</Label>
                    <Input
                      id="edit-image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="bg-gray-800 text-white border-gray-700"
                    />
                    {memberToEdit.image_url && !selectedFile && (
                      <p className="text-xs text-gray-400 mt-1">Imagem atual mantida</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-administrador" className="flex items-center text-white">
                      <Input
                        id="edit-administrador"
                        name="administrador"
                        type="checkbox"
                        checked={memberToEdit.administrador || false}
                        onChange={(e) => handleSelectChange(e.target.checked, 'administrador')}
                        className="h-4 w-4 mr-2"
                      />
                      Administrador
                    </Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar Alterações"}
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
