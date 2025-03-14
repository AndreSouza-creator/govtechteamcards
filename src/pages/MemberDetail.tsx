
import { useParams, useNavigate } from 'react-router-dom';
import { teamMembers } from '@/data/teamMembers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import "./CSS/teamstyle.css"
import HeaderMenu from '@/components/HeaderMenu';
import Team from './Team';
import logo from "./../img/Logo.svg"
import { useEffect, useState } from 'react';
import Intro from './Intro/intro';

const MemberDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  const [showIntro, setShowIntro] = useState(true);

const formatarNome = (nome) =>
  nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ç/g, "c")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

const member = teamMembers.find(m =>
  formatarNome(m.nome) === formatarNome(decodeURIComponent(name || ""))
);

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

// Generate WhatsApp link
const generateWhatsAppLink = (phoneNumber, message) => {
  // Remove any non-digit characters from phone number
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

const whatsappMessage = "Olá, " + member.nome.split(" ")[0] + ", estou entrando em contato através do cartão de visita.";
const whatsappLink = member.tel ? generateWhatsAppLink(member.tel, whatsappMessage) : '';

useEffect(() => {
  const timer = setTimeout(() => {
    setShowIntro(false);
  }, 4000); // 3 segundos

  return () => clearTimeout(timer); // Limpa o timer ao desmontar
}, []);

return (
  <div>
    {showIntro ? (
      <Intro/>    
    ) : (
      <>
  <div className="min-h-screen  flex flex-col items-center p-6" id="customMemberDetailContent">
    <img src={logo} id="logoDetails"></img>
    <h1 id="bigtitle">Conheça o time GovTech</h1>
    <h2 className="text-white text-lg max-w-2xl mx-auto">
      Os profissionais da Tecnocomp dedicados a entregar
      soluções inovadoras para o setor governamental.
    </h2>
    <br />
    <div className="w-full max-w-md" id="mainDetailedCard">
      <div className='wrapperButton'>
        {isAuthenticated && (
          <Button
            onClick={() => navigate('/team')}
          >
            {'<'} Voltar
          </Button>
        )}
      </div>
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
      <div className="text-center">
        <h1 className="text-white text-3xl font-bold mb-2">{member.nome}</h1>
        <p className="text-white text-lg">{member.cargo}</p>
      </div>
      {/* Contact Info */}
      <div className="custom">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Informações de Contato</h2>

          {member.tel && (
            <div className="mb-3">
              <p className="text-sm text-white-500">Telefone</p>
              <p>{member.tel}</p>
            </div>
          )}

          <div className="mb-3">
            <p className="text-sm text-white-500">Email</p>
            <p className="break-all">
              {member.email.split("@").map((part, index) =>
                index === 0 ? (
                  part
                ) : (
                  <span key={index}>
                    <span className="font-sans">@</span>
                    {part}
                  </span>
                )
              )}
            </p>
          </div>

        </div>
      </div>

      {/* Buttons */}
      <div className="w-full space-y-4">
        {member.tel && (
          <Button
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-full transition-all duration-300"
            onClick={() => window.open(whatsappLink, '_blank')}
          >
            Conversar no WhatsApp
          </Button>
        )}

        <Button
          className="w-full bg-[#4A4A4A] hover:bg-[#3A3A3A] text-white py-3 px-6 rounded-full transition-all duration-300"
          onClick={() => window.location.href = `mailto:${member.email}`}
        >
          Enviar um email
        </Button>

        <Button
          className="w-full bg-[#4A4A4A] hover:bg-[#3A3A3A] text-white py-3 px-6 rounded-full transition-all duration-300"
          onClick={() => window.open(`https://${member.portfolio}`, '_blank')}
        >
          Portfolio da Tecnocomp
        </Button>

        <Button
          className="w-full bg-[#4A4A4A] hover:bg-[#3A3A3A] text-white py-3 px-6 rounded-full transition-all duration-300"
          onClick={() => window.open(`https://${member.site}`, '_blank')}
        >
          Acessar site
        </Button>


      </div>
    </div>
  </div>
</>
    )}
  </div>
);
};

export default MemberDetail;
