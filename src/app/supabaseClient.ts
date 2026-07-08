import { createClient } from "@supabase/supabase-js";

// These are the public "anon" credentials — safe to expose in frontend code.
// Never put the separate "service role" key here.
const SUPABASE_URL = "https://foytoxsnsqzwkljmalnd.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZveXRveHNuc3F6d2tsam1hbG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MzIyMDIsImV4cCI6MjA5OTEwODIwMn0.LFvEi4fKcZA3bMg4_u5r_dEI2ib7JIfTvlSAGRlJmC4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
