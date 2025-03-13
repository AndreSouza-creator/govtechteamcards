
import React from 'react';
import { teamMembers } from '@/data/teamMembers';
import TeamMemberCard from '@/components/TeamMemberCard';

const Team = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-500 to-orange-400 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">Nosso Time</h1>
          <p className="text-white text-lg max-w-2xl mx-auto">
            Conheça os profissionais da Tecnocomp dedicados a entregar 
            soluções inovadoras para o setor governamental.
          </p>
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
