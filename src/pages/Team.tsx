
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { teamMembers } from '@/data/teamMembers';
import TeamMemberCard from '@/components/TeamMemberCard';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import "./CSS/teamstyle.css";

const Team = () => {
  const navigate = useNavigate();
  
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
          <Button 
            onClick={() => navigate('/add-team-member')}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Adicionar Membro
          </Button>
        </header>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
