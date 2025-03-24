
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamMembers } from '@/data/teamMembers';
import TeamMemberCard from '@/components/TeamMemberCard';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import "./CSS/teamstyle.css";

const Team = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState(teamMembers);
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  
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
          {members.map((member, index) => (
            <TeamMemberCard 
              key={index} 
              member={member} 
              onDelete={isAdmin ? handleDeleteMember : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
