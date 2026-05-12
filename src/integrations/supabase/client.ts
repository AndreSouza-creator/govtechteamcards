
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://saergvzwbrbwoorvqtyg.supabase.co";
const supaPublishableKey = "sb_publishable_RBpoAULrl-z6veus0nVxLA_PH866AnM";

export const supabase = createClient<Database>(supabaseUrl, supaPublishableKey);
