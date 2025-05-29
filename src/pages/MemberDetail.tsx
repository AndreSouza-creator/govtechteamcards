
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import "./CSS/teamstyle.css"
import logo from "./../img/Logo.svg"
import { useEffect, useState } from 'react';
import Intro from './Intro/intro';
import logoWhats from './../img/image.png'
import FundoBG from './../img/FundoBGTecnoDesktop.mp4'
import logo3d from './../img/tecno3d.png'
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


type TeamMember = Database['public']['Tables']['team_members']['Row'];

const MemberDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  const [showIntro, setShowIntro] = useState(true);
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const formatarNome = (nome: string) =>
    nome
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ç/g, "c")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();

  useEffect(() => {
    const fetchMember = async () => {
      if (!name) return;
      
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*');

        if (error) {
          console.error('Error fetching team members:', error);
          return;
        }

        const formattedName = formatarNome(decodeURIComponent(name));
        const foundMember = data?.find(m =>
          formatarNome(m.nome) === formattedName
        );

        setMember(foundMember || null);
      } catch (error) {
        console.error('Error fetching member:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [name]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      // Mostrar conteúdo após um pequeno delay da intro
      setTimeout(() => setShowContent(true), 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-500 to-orange-400 flex flex-col items-center justify-center p-6">
            <DotLottieReact
          src="https://lottie.host/embed/823f17ed-5829-4d8f-824a-05ae36e8426f/PdKWO4qFNj.lottie"
          loop
          autoplay
        />
      </div>
    );
  }

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
  const generateWhatsAppLink = (phoneNumber: string, message: string) => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  };

  const whatsappMessage = "Olá, " + member.nome.split(" ")[0] + ", estou entrando em contato através do cartão de visita virtual. Podemos conversar?";
  const whatsappLink = member.tel ? generateWhatsAppLink(member.tel, whatsappMessage) : '';

  return (
    <>
      {showIntro ? (
        <Intro />
      ) : (
        <>
          {!videoLoaded && (
            <div className="video-loading-overlay">
              <div className="loading-spinner">
                <div className="text-white text-lg">...</div>
              </div>
            </div>
          )}
          <video 
            autoPlay 
            muted 
            loop 
            id="myVideoDesktop"
            onLoadedData={handleVideoLoad}
            style={{ opacity: videoLoaded ? 1 : 0 }}
          >
            <source src={FundoBG} type="video/mp4" />
          </video>
          <div 
            className={`min-h-screen flex flex-col items-center p-6 transition-all duration-1000 ${
              showContent && videoLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`} 
            id="customMemberDetailContent"
          >
            <img src={logo} id='logoDetails' />

            <div className={`w-full max-w-md card-fade-in ${showContent ? 'visible' : ''}`} id="mainDetailedCard">
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
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
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
                  onClick={() => window.open(`https://${member.site}`, '_blank')}
                >
                  Acessar site
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
    
  );
};

export default MemberDetail;
