
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teamMembers } from '@/data/teamMembers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const MemberDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  
  const member = teamMembers.find(m => m.nome === decodeURIComponent(name || ''));
  
  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-500 to-orange-400 flex flex-col items-center justify-center p-6">
        <h1 className="text-white text-2xl mb-4">Membro não encontrado</h1>
        <Button 
          onClick={() => navigate('/')}
          className="bg-white text-orange-500 hover:bg-gray-100"
        >
          Voltar para página inicial
        </Button>
      </div>
    );
  }
  
  const initials = member.nome
    .split(' ')
    .map(name => name.charAt(0))
    .join('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-500 to-orange-400 flex flex-col items-center p-6">
      <div className="w-full max-w-md">
        {/* Profile Picture */}
        <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg mb-6 mt-12">
          {member.image ? (
            <img
              src={member.image}
              alt={member.nome}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-orange-600 text-white text-4xl">
              {initials}
            </div>
          )}
        </div>

        {/* Name and Title */}
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">{member.nome}</h1>
          <p className="text-white text-lg">{member.cargo}</p>
        </div>

        {/* Contact Info */}
        <Card className="w-full mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Informações de Contato</h2>
            
            {member.tel && (
              <div className="mb-3">
                <p className="text-sm text-gray-500">Telefone</p>
                <p>{member.tel}</p>
              </div>
            )}
            
            <div className="mb-3">
              <p className="text-sm text-gray-500">Email</p>
              <p className="break-all">{member.email}</p>
            </div>
            
            <div className="mb-3">
              <p className="text-sm text-gray-500">Site</p>
              <p>{member.site}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Portfolio</p>
              <p>{member.portfolio}</p>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="w-full space-y-4">
          <Button 
            className="w-full bg-[#4A4A4A] hover:bg-[#3A3A3A] text-white py-3 px-6 rounded-full transition-all duration-300"
            onClick={() => window.location.href = `tel:${member.tel}`}
            disabled={!member.tel}
          >
            Ligar
          </Button>
          
          <Button 
            className="w-full bg-[#4A4A4A] hover:bg-[#3A3A3A] text-white py-3 px-6 rounded-full transition-all duration-300"
            onClick={() => window.location.href = `mailto:${member.email}`}
          >
            Email
          </Button>
          
          <Button 
            className="w-full bg-[#4A4A4A] hover:bg-[#3A3A3A] text-white py-3 px-6 rounded-full transition-all duration-300"
            onClick={() => window.open(`https://${member.portfolio}`, '_blank')}
          >
            Portfolio da Tecnocomp
          </Button>
          
          <Button 
            className="w-full bg-white text-orange-500 hover:bg-gray-100 py-3 px-6 rounded-full transition-all duration-300"
            onClick={() => navigate('/')}
          >
            Voltar para página inicial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;
