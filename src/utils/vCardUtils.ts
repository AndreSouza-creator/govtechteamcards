
import { Database } from '@/integrations/supabase/types';

type TeamMember = Database['public']['Tables']['team_members']['Row'];

export const generateVCard = (member: TeamMember): string => {
  const vCardData = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${member.nome}`,
    `N:${member.nome.split(' ').reverse().join(';')}`,
    `TITLE:${member.cargo}`,
    `ORG:Tecnocomp`,
    member.tel ? `TEL:${member.tel}` : '',
    `EMAIL:${member.email}`,
    member.site ? `URL:https://${member.site}` : '',
    member.image_url ? `PHOTO;VALUE=URL:${member.image_url}` : '',
    'END:VCARD'
  ].filter(line => line !== '').join('\r\n');
  
  return vCardData;
};

export const downloadVCard = (member: TeamMember): void => {
  const vCardContent = generateVCard(member);
  const blob = new Blob([vCardContent], { type: 'text/vcard' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${member.nome.replace(/\s+/g, '_')}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
