
import { supabase } from '@/integrations/supabase/client';
import { TeamMember, Departamento } from '@/types/supabase';

export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('nome');

  if (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }

  return data || [];
};

export const fetchTeamMemberById = async (id: string): Promise<TeamMember | null> => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching team member:', error);
    throw error;
  }

  return data;
};

export const fetchTeamMemberByName = async (name: string): Promise<TeamMember | null> => {
  // Format name for comparison
  const formatName = (name: string) => {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ç/g, "c")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();
  };

  // Fetch all team members
  const { data, error } = await supabase
    .from('team_members')
    .select('*');

  if (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }

  // Find the member with matching formatted name
  const formattedSearchName = formatName(name);
  const member = data?.find(m => formatName(m.nome) === formattedSearchName);

  return member || null;
};

export const createTeamMember = async (member: Omit<TeamMember, 'id'>): Promise<TeamMember> => {
  const { data, error } = await supabase
    .from('team_members')
    .insert([member])
    .select()
    .single();

  if (error) {
    console.error('Error creating team member:', error);
    throw error;
  }

  return data;
};

export const updateTeamMember = async (id: string, member: Partial<TeamMember>): Promise<TeamMember> => {
  const { data, error } = await supabase
    .from('team_members')
    .update(member)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating team member:', error);
    throw error;
  }

  return data;
};

export const deleteTeamMember = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting team member:', error);
    throw error;
  }
};

export const uploadTeamMemberImage = async (file: File, fileName: string): Promise<string> => {
  // Validate file size (2MB limit)
  const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSizeInBytes) {
    throw new Error('O tamanho máximo da imagem é 2MB');
  }
  
  const { data, error } = await supabase.storage
    .from('team_member_images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }

  // Get the public URL for the uploaded image
  const { data: { publicUrl } } = supabase.storage
    .from('team_member_images')
    .getPublicUrl(data.path);

  return publicUrl;
};

export const deleteTeamMemberImage = async (fileName: string): Promise<void> => {
  const { error } = await supabase.storage
    .from('team_member_images')
    .remove([fileName]);

  if (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export const getDepartamentos = (): Departamento[] => {
  return [
    "Govtech",
    "Marketing",
    "Inovação",
    "ServiceDesk",
    "Grandes Contas",
    "Varejo",
    "Financeiro",
    "Fiscal",
    "Saúde",
    "Projetos",
    "Corporativo",
  ];
};
