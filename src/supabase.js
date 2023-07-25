import { createClient } from "@supabase/supabase-js";

/* const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey); */


const supabaseUrl = 'https://fkwjmjcusyltaqpnhwaz.supabase.co'
const supabaseKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrd2ptamN1c3lsdGFxcG5od2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODgyMDMwMTEsImV4cCI6MjAwMzc3OTAxMX0.f791Iz74auiRrvacYP8V7WTSo54dcMJH1H9MlQGGNwE`
const supabase = createClient(supabaseUrl, supabaseKey)
export { supabase };