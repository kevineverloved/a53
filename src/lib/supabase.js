import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zytgblsewpfwraykljcf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dGdibHNld3Bmd3JheWtsamNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzgyMDAsImV4cCI6MjA1NDI1NDIwMH0.qMMyZ0b4v769HQPbPzSVTjetsL9LMpIH4bLWPHFZVqQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 