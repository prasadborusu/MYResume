import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xjzsetrvaufqwkpmfjcu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqenNldHJ2YXVmcXdrcG1mamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMDI3NDAsImV4cCI6MjEwNjg3ODc0MH0.CVAFYlrBQsJbnuvwIBX4f_dcd0xIrFyNx60NS7JXZeg';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
