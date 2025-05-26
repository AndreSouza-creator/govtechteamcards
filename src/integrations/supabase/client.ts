import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://xpwtyybbaelwcsqcfbwn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhwd3R5eWJiYWVsd2NzcWNmYnduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDU1NDQsImV4cCI6MjA1ODQyMTU0NH0.dVA95efO18-MVdXUeJ_U1or3_76FM5_JFr9vDDLz6Qc";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
