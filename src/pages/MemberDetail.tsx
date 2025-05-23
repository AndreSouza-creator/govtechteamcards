
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, Mail, Globe, Briefcase } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import HeaderMenu from '@/components/HeaderMenu';
import { supabase, TeamMemberFromSupabase, getImageUrl } from '@/lib/supabase';

const MemberDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState<TeamMemberFromSupabase | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        setLoading(true);
        // Fetch all members
        const { data: members, error } = await supabase
          .from('team_members')
          .select('*');
        
        if (error) {
          console.error('Error fetching members:', error);
          return;
        }
        
        if (!name) return;
        
        // Function to convert name to searchable format
        const formatarNome = (nome) =>
          nome
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/ç/g, "c")
            .replace(/[^a-zA-Z0-9]/g, "")
            .toLowerCase();
        
        // Find member by formatted name
        const foundMember = members.find(m => 
          formatarNome(m.nome) === decodeURIComponent(name)
        );
        
        if (foundMember) {
          setMember(foundMember);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMemberDetails();
  }, [name]);
  
  if (loading) {
    return (
      <HeaderMenu>
        <div className="content flex justify-center items-center">
          <p className="text-xl text-white">Carregando...</p>
        </div>
      </HeaderMenu>
    );
  }
  
  if (!member) {
    return (
      <HeaderMenu>
        <div className="content flex flex-col justify-center items-center">
          <p className="text-xl text-white mb-4">Membro não encontrado</p>
          <Button onClick={() => navigate('/team')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a equipe
          </Button>
        </div>
      </HeaderMenu>
    );
  }
  
  // Get initials for avatar fallback
  const initials = member.nome
    .split(' ')
    .map(name => name.charAt(0))
    .join('');
  
  // Get image URL from Supabase storage
  const imageUrl = member.image_url ? getImageUrl(member.image_url) : null;
  
  return (
    <HeaderMenu>
      <div className="content">
        <div className="max-w-4xl mx-auto p-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/team')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a equipe
          </Button>
          
          <div className="bg-black/40 rounded-lg p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="h-40 w-40">
                  {imageUrl ? (
                    <AvatarImage src={imageUrl} alt={member.nome} className="object-cover" />
                  ) : (
                    <AvatarFallback className="bg-orange-500 text-white text-4xl">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              
              {/* Member Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">{member.nome}</h1>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <Briefcase className="h-4 w-4 text-orange-400" />
                  <span className="font-medium text-white">{member.cargo}</span>
                </div>
                <p className="text-gray-300 mb-1">Departamento: {member.departamento}</p>
                
                {member.tel && (
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
                    <Phone className="h-4 w-4 text-orange-400" />
                    <a href={`tel:${member.tel}`} className="text-white hover:text-orange-300">
                      {member.tel}
                    </a>
                  </div>
                )}
                
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                  <Mail className="h-4 w-4 text-orange-400" />
                  <a href={`mailto:${member.email}`} className="text-white hover:text-orange-300">
                    {member.email}
                  </a>
                </div>
                
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                  <Globe className="h-4 w-4 text-orange-400" />
                  <a 
                    href={member.site.startsWith('http') ? member.site : `https://${member.site}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-orange-300"
                  >
                    {member.site}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeaderMenu>
  );
};

export default MemberDetail;
