
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BusinessCard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-500 to-orange-400 flex flex-col items-center p-6">
      {/* Logo */}
      <div className="w-64 mt-8 mb-6">
        <img
          src="/lovable-uploads/0d654465-b65c-4eea-a6b4-ab60ce7c586e.png"
          alt="Tecnocomp"
          className="w-full object-contain"
        />
      </div>

      {/* Profile Picture */}
      <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6">
        <img
          src="/placeholder.svg"
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name and Title */}
      <div className="text-center mb-8">
        <h1 className="text-white text-3xl font-bold mb-2">Leonardo Araújo</h1>
        <p className="text-white text-lg">Account Manager - Gov</p>
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
      </div>
    </div>
  );
};

export default BusinessCard;
