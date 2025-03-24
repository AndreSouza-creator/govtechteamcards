
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { createTeamMember, getDepartamentos, uploadTeamMemberImage } from '@/services/teamMemberService';
import { TeamMember, Departamento } from '@/types/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddTeamMember = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  
  const [newMember, setNewMember] = useState<Omit<TeamMember, 'id'>>({
    nome: '',
    cargo: '',
    tel: '',
    departamento: 'Govtech' as Departamento,
    email: '',
    site: 'www.tecnocomp.com.br',
    portfolio: 'www.tecnocomp.com.br/portfiolio',
    image_url: null,
    administrador: false,
    user_id: null
  });

  const departamentos = getDepartamentos();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: Departamento, field: keyof TeamMember) => {
    setNewMember(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMember(prev => ({
      ...prev,
      administrador: e.target.checked
    }));
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
      setIsSubmitting(true);
      
      // If there's a selected image, upload it first
      let imageUrl = null;
      
      if (selectedImage) {
        const fileName = `${Date.now()}-${selectedImage.name}`;
        imageUrl = await uploadTeamMemberImage(selectedImage, fileName);
      }
      
      // Create the new team member
      await createTeamMember({
        ...newMember,
        image_url: imageUrl
      });
      
      toast({
        title: "Sucesso",
        description: `${newMember.nome} foi adicionado à equipe.`
      });
      
      // Navigate back to the team page
      navigate('/team');
      
    } catch (error) {
      console.error('Error creating team member:', error);
      toast({
        title: "Erro",
        description: "Falha ao adicionar o membro da equipe.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
              <Label htmlFor="departamento">Departamento *</Label>
              <Select 
                value={newMember.departamento} 
                onValueChange={(value) => handleSelectChange(value as Departamento, 'departamento')}
              >
                <SelectTrigger className="w-full">
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
              <Label htmlFor="image">Imagem</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <p className="text-xs text-gray-500 mt-1">Tamanho máximo: 2MB</p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="administrador"
                checked={newMember.administrador}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <Label htmlFor="administrador">Administrador</Label>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adicionando...
              </>
            ) : (
              'Adicionar Membro'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddTeamMember;
