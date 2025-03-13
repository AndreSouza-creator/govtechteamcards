
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
      const nomeSemEspacos = member.nome.replace(/\s+/g, '');
      navigate(`/member/${encodeURIComponent(nomeSemEspacos)}`);
    };
    

  return (
    <div className="w-full hover:shadow-md transition-all duration-3000">
      <div className="p-6 flex flex-col items-center text-center" id="customteamCard">
        <Avatar className="w-40 h-40 mb-4 border-2 border-orange-300">
          {member.image ? (
            <AvatarImage src={member.image} alt={member.nome} />
          ) : (
            <AvatarFallback className="bg-orange-500 text-white text-xl">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
        <h3 className="text-lg mb-1">{member.nome}</h3>
        <h2 className="text-md text-600 mb-4">{member.cargo}</h2>
        <Button 
          onClick={handleClick}
          id="seeCard"
        >
          Ver cartão de visita digital
        </Button>
      </div>
    </div>
  );
};

export default TeamMemberCard;
