
import { useParams, useNavigate } from 'react-router-dom';
import { teamMembers } from '@/data/teamMembers';
import { Button } from '@/components/ui/button';
import "./CSS/teamstyle.css"
import logo from "./../img/Logo.svg"
import { useEffect, useState } from 'react';
import Intro from './Intro/intro';
import logoWhats from './../img/image.png'
import FundoBG from './../img/FundoBGTecnoDesktop.mp4'
import logo3d from './../img/tecno3d.png'

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

  const whatsappMessage = "Olá, " + member.nome.split(" ")[0] + ", estou entrando em contato através do cartão de visita virtual. Podemos conversar?";
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
        <Intro />
      ) : (
        <>
          <video autoPlay muted loop id="myVideoDesktop">
            <source src={FundoBG} type="video/mp4" />
          </video>
          <div className="min-h-screen  flex flex-col items-center p-6" id="customMemberDetailContent">
            <img src={logo} id='logoDetails' />
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
              <div className='Profile3d'>
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
                <div className='logowrapper'>
                  <img src={logo3d} id="logo3d"></img>
                </div>
              </div>

              {/* Name and Title */}
              <div className="text-center">
                <h1 className="text-white text-3xl font-bold mb-2">{member.nome}</h1>
                <p >{member.cargo}</p>
              </div>
            
              {/* Contact Info */}
              <div>
                <div className="custom">
                  {member.tel && (
                    <div className="mb-3">
                      <p className="text-lg text-white-700">Contato</p>
                      <p>{member.tel}</p>
                    </div>
                  )}

                  <div className="mb-3">
                    <p className="text-lg text-white-700">Email</p>
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
                    id='whatstalkbutton'
                  ><span>
                      <img src={logoWhats} id='whatslogo'></img>
                      Conversar no WhatsApp
                    </span>
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
