
import { supabase, TeamMemberFromSupabase } from '../lib/supabase';

export const fetchTeamMembers = async (): Promise<TeamMemberFromSupabase[]> => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*');
  
  if (error) {
    console.error('Error fetching team members:', error);
    throw new Error('Failed to fetch team members');
  }
  
  return data || [];
};

export const addTeamMember = async (member: Omit<TeamMemberFromSupabase, 'id'>) => {
  const { data, error } = await supabase
    .from('team_members')
    .insert(member)
    .select();
  
  if (error) {
    console.error('Error adding team member:', error);
    throw new Error('Failed to add team member');
  }
  
  return data?.[0];
};

export const updateTeamMember = async (id: string, member: Partial<TeamMemberFromSupabase>) => {
  const { data, error } = await supabase
    .from('team_members')
    .update(member)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating team member:', error);
    throw new Error('Failed to update team member');
  }
  
  return data?.[0];
};

export const deleteTeamMember = async (id: string) => {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting team member:', error);
    throw new Error('Failed to delete team member');
  }
  
  return true;
};

export const uploadTeamMemberImage = async (file: File) => {
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('Image size must be less than 2MB');
  }
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `team_members/${fileName}`;
  
  const { error } = await supabase.storage
    .from('team_member_images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
    
  if (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
  
  return filePath;
};
