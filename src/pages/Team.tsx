
import React from 'react';
import { teamMembers } from '@/data/teamMembers';
import TeamMemberCard from '@/components/TeamMemberCard';
import "./CSS/teamstyle.css"

const Team = () => {
  return (
    <div className="content">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1>Conheça o time GovTech</h1>
          <h2 className="text-white text-lg max-w-2xl mx-auto">
            Os profissionais da Tecnocomp dedicados a entregar 
            soluções inovadoras para o setor governamental.
          </h2>
        </header>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
