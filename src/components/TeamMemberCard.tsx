
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamMember } from '@/data/teamMembers';
import "./../pages/CSS/teamstyle.css"

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  const navigate = useNavigate();
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
    
    

  return (
    <div className="w-full hover:shadow-md transition-all duration-3000">
      <div className="p-6 flex flex-col items-center text-center" id="customteamCard">
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
