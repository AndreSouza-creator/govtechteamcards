
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamMember, teamMembers } from '@/data/teamMembers';
import { Edit, Trash2 } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from '@/hooks/use-toast';
import "./../pages/CSS/teamstyle.css"

interface TeamMemberCardProps {
  member: TeamMember;
  departamento: string;
  onDelete?: (member: TeamMember) => void;
  onEdit?: (member: TeamMember) => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const initials = member.nome
    .split(' ')
    .map(name => name.charAt(0))
    .join('');

  const handleClick = () => {
    const formatarNome = (nome) =>
      nome
        .normalize("NFD") // Separa acentos das letras
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/ç/g, "c") // Substitui cedilha
        .replace(/[^a-zA-Z0-9]/g, "") // Remove caracteres especiais
        .toLowerCase(); // Converte para minúsculas
  
    const nomeFormatado = formatarNome(member.nome);
    navigate(`/member/${encodeURIComponent(nomeFormatado)}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(member);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(member);
    }
  };

  return (
    <div className="w-full hover:shadow-md transition-all duration-3000">
      <div className="p-6 flex flex-col items-center text-center relative" id="customteamCard">
        {isAdmin && (
          <div className="absolute top-2 right-2 flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleEdit}
              className="h-8 w-8 rounded-full bg-gray-100"
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full bg-gray-100"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Você realmente deseja excluir {member.nome} da equipe? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
        
        <Avatar className="avatarTeamPage">
          {member.image ? (
            <AvatarImage src={member.image} alt={member.nome} />
          ) : (
            <AvatarFallback className="bg-orange-500 text-white text-xl">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
        
        <h3 className="bigtitle nometeam">{member.nome}</h3>
        <h2 className="bigtitle cargo">{member.cargo}</h2>
        <h2 className="bigtitle departamento">{member.departamento}</h2>
        <Button 
          onClick={handleClick}
          id="seeCard"
        >
        </Button>
      </div>
    </div>
  );
};

export default TeamMemberCard;
