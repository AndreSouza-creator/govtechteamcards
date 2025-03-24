
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamMemberCard from '@/components/TeamMemberCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { TeamMember, Departamento } from '@/types/supabase';
import { fetchTeamMembers, deleteTeamMember, getDepartamentos, updateTeamMember, uploadTeamMemberImage } from '@/services/teamMemberService';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, X, Loader2 } from 'lucide-react';
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
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const departamentos = getDepartamentos();

  useEffect(() => {
    loadTeamMembers();
  }, []);
  
  const loadTeamMembers = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTeamMembers();
      setMembers(data);
    } catch (error) {
      console.error('Failed to load team members:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar membros da equipe.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (memberToEdit) {
      setMemberToEdit({
        ...memberToEdit,
        [name]: value
      });
    }
  };
  
  const handleSelectChange = (value: string, field: string) => {
    if (memberToEdit) {
      setMemberToEdit({
        ...memberToEdit,
        [field]: value
      });
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (2MB limit)
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSizeInBytes) {
        toast({
          title: "Erro",
          description: "O tamanho máximo da imagem é 2MB.",
          variant: "destructive"
        });
        e.target.value = '';
        return;
      }
      
      setSelectedImage(file);
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
      setIsSubmitting(true);
      
      // If there's a new image, upload it first
      let updatedImageUrl = memberToEdit.image_url;
      
      if (selectedImage) {
        const fileName = `${Date.now()}-${selectedImage.name}`;
        updatedImageUrl = await uploadTeamMemberImage(selectedImage, fileName);
      }
      
      // Update the member with the new data
      const updatedMember = await updateTeamMember(memberToEdit.id, {
        ...memberToEdit,
        image_url: updatedImageUrl
      });
      
      // Update the local state
      setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));
      
      toast({
        title: "Sucesso",
        description: `Informações de ${updatedMember.nome} foram atualizadas.`
      });
      
      // Reset and close modal
      setSelectedImage(null);
      setOpenEditModal(false);
      setMemberToEdit(null);
      
    } catch (error) {
      console.error('Error updating team member:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar o membro da equipe.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteMember = async (memberToDelete: TeamMember) => {
    try {
      await deleteTeamMember(memberToDelete.id);
      
      // Remove from local state
      setMembers(members.filter(m => m.id !== memberToDelete.id));
      
      toast({
        title: "Membro excluído",
        description: `${memberToDelete.nome} foi removido da equipe com sucesso.`
      });
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast({
        title: "Erro",
        description: "Falha ao excluir o membro da equipe.",
        variant: "destructive"
      });
    }
  };
  
  const openEditModalForMember = (member: TeamMember) => {
    setMemberToEdit(member);
    setOpenEditModal(true);
  };
  
  if (isLoading) {
    return (
      <div className="content flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
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
              onClick={() => navigate('/add-team-member')}
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
                    <Label htmlFor="edit-image" className="text-white">Imagem</Label>
                    <Input
                      id="edit-image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="bg-gray-800 text-white border-gray-700"
                    />
                    <p className="text-xs text-gray-400 mt-1">Tamanho máximo: 2MB</p>
                    
                    {memberToEdit.image_url && !selectedImage && (
                      <div className="mt-2">
                        <p className="text-sm">Imagem atual:</p>
                        <div className="h-16 w-16 mt-1 rounded-full overflow-hidden">
                          <img 
                            src={memberToEdit.image_url} 
                            alt={memberToEdit.nome}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar Alterações'
                    )}
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
