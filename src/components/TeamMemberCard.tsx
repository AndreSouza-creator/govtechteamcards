
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { TeamMemberFromSupabase, getImageUrl } from '@/lib/supabase';
import "./../pages/CSS/teamstyle.css";

interface TeamMemberCardProps {
  member: TeamMemberFromSupabase;
  onDelete?: (member: TeamMemberFromSupabase) => void;
  onEdit?: (member: TeamMemberFromSupabase) => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';

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

  // Get image URL from Supabase storage
  const imageUrl = member.image_url ? getImageUrl(member.image_url) : null;

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
          {imageUrl ? (
            <AvatarImage src={imageUrl} alt={member.nome} />
          ) : (
            <AvatarFallback className="bg-orange-500 text-white text-xl">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
        
        <h3 className="bigtitle nometeam">{member.nome}</h3>
        <h2 className="bigtitle cargo">{member.cargo}</h2>
        <span className="text-sm text-gray-400 mt-1">{member.departamento}</span>
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
