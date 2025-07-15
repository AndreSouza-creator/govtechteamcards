
import { Database } from '@/integrations/supabase/types';

type TeamMember = Database['public']['Tables']['team_members']['Row'];

export const generateVCard = (member: TeamMember, imageBase64?: string): string => {
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
    imageBase64
      ? `PHOTO;ENCODING=b;TYPE=JPEG:${imageBase64}`
      : member.image_url
        ? `PHOTO;TYPE=JPEG;VALUE=uri:${member.image_url}`
        : '',
    'END:VCARD'
  ].filter(line => line !== '').join('\r\n');
  
  return vCardData;
};

async function fetchImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Remove the data URL prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export const downloadVCard = async (member: TeamMember): Promise<void> => {
  let imageBase64: string | undefined = undefined;
  if (member.image_url) {
    imageBase64 = await fetchImageAsBase64(member.image_url) || undefined;
  }
  const vCardContent = generateVCard(member, imageBase64);
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
