
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { teamMembers } from '@/data/teamMembers';

const BusinessCard = () => {
  const navigate = useNavigate();
  // Using Leonardo's data as default for the existing business card
  const leonardo = teamMembers.find(member => member.nome === "Leonardo Araújo") || teamMembers[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-500 to-orange-400 flex flex-col items-center p-6">
      {/* Profile Picture */}
      <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6 mt-12">
        <img
          src={leonardo.image || "/placeholder.svg"}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name and Title */}
      <div className="text-center mb-8">
        <h1 className="text-white text-3xl font-bold mb-2">{leonardo.nome}</h1>
        <p className="text-white text-lg">{leonardo.cargo}</p>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-md space-y-4">
        <button 
          className="w-full bg-[#4A4A4A] hover:bg-[#3A3A3A] text-white py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          onClick={() => navigate('/contacts')}
        >
          Contatos
        </button>
        
        <button 
          className="w-full bg-[#4A4A4A] hover:bg-[#3A3A3A] text-white py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          onClick={() => navigate('/social')}
        >
          Redes sociais
        </button>
        
        <button 
          className="w-full bg-[#4A4A4A] hover:bg-[#3A3A3A] text-white py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          onClick={() => navigate('/portfolio')}
        >
          Portfolio da Tecnocomp
        </button>

        <button 
          className="w-full bg-white text-orange-500 hover:bg-gray-100 py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          onClick={() => navigate('/team')}
        >
          Ver equipe completa
        </button>
      </div>
    </div>
  );
};

export default BusinessCard;
