// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zytgblsewpfwraykljcf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dGdibHNld3Bmd3JheWtsamNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzgyMDAsImV4cCI6MjA1NDI1NDIwMH0.qMMyZ0b4v769HQPbPzSVTjetsL9LMpIH4bLWPHFZVqQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);