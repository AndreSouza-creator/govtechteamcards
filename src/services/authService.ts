
import { supabase } from '../lib/supabase';

export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    console.error('Login error:', error);
    throw error;
  }
  
  // Check if the user is an admin
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select('administrador')
    .eq('email', email)
    .single();
  
  const isAdmin = teamMembers?.administrador || false;
  
  sessionStorage.setItem('isAuthenticated', 'true');
  sessionStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
  sessionStorage.setItem('username', email.split('@')[0]);
  
  return { user: data.user, isAdmin };
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Logout error:', error);
    throw error;
  }
  
  sessionStorage.removeItem('isAuthenticated');
  sessionStorage.removeItem('isAdmin');
  sessionStorage.removeItem('username');
};

export const registerUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (error) {
    console.error('Registration error:', error);
    throw error;
  }
  
  return data;
};
