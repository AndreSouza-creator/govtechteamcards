
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamMember } from '@/data/teamMembers';

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
    navigate(`/member/${encodeURIComponent(member.nome)}`);
  };

  return (
    <Card className="w-full hover:shadow-md transition-all duration-300">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <Avatar className="w-24 h-24 mb-4 border-2 border-orange-300">
          {member.image ? (
            <AvatarImage src={member.image} alt={member.nome} />
          ) : (
            <AvatarFallback className="bg-orange-500 text-white text-xl">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
        <h3 className="font-bold text-lg mb-1">{member.nome}</h3>
        <p className="text-sm text-gray-600 mb-4">{member.cargo}</p>
        <Button 
          onClick={handleClick}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          Ver detalhes
        </Button>
      </CardContent>
    </Card>
  );
};

export default TeamMemberCard;
