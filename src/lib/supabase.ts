
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xpwtyybbaelwcsqcfbwn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhwd3R5eWJiYWVsd2NzcWNmYnduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDU1NDQsImV4cCI6MjA1ODQyMTU0NH0.dVA95efO18-MVdXUeJ_U1or3_76FM5_JFr9vDDLz6Qc';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Function to generate image URL from Supabase storage
export const getImageUrl = (path: string | null) => {
  if (!path) return null;
  
  const { data } = supabase.storage
    .from('team_member_images')
    .getPublicUrl(path);
  
  return data.publicUrl;
};

// Type definition for team members from Supabase
export type TeamMemberFromSupabase = {
  id: string;
  nome: string;
  cargo: string;
  tel: string | null;
  email: string;
  site: string;
  portfolio: string;
  departamento: string;
  image_url: string | null;
  administrador: boolean | null;
};
