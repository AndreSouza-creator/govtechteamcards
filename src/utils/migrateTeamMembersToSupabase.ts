
import { supabase } from '@/integrations/supabase/client';
import { teamMembers } from '@/data/teamMembers';

export const migrateTeamMembersToSupabase = async () => {
  try {
    console.log('Starting migration of team members to Supabase...');
    
    // First check if we already have team members in the database
    const { data: existingMembers, error: checkError } = await supabase
      .from('team_members')
      .select('count')
      .single();
    
    if (checkError) {
      console.error('Error checking existing members:', checkError);
      return;
    }
    
    // If we already have members (beyond the 2 initial ones we added in migration), skip migration
    if (existingMembers && existingMembers.count > 2) {
      console.log('Team members already migrated. Skipping migration.');
      return;
    }
    
    // Map the local team members to the Supabase format
    const mappedMembers = teamMembers.map(member => ({
      nome: member.nome,
      cargo: member.cargo,
      tel: member.tel || null,
      email: member.email,
      site: member.site,
      portfolio: member.portfolio,
      departamento: member.departamento,
      image_url: member.image || null,
      administrador: member.administrador || false,
      user_id: null
    }));
    
    // Insert the mapped members
    const { data, error } = await supabase
      .from('team_members')
      .insert(mappedMembers)
      .select();
    
    if (error) {
      console.error('Error migrating team members:', error);
      return;
    }
    
    console.log(`Successfully migrated ${data.length} team members`);
  } catch (error) {
    console.error('Error in migration process:', error);
  }
};
