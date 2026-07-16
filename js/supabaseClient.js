
// Supabase Project Credentials (Anon key is safe to expose — security is enforced via RLS)
const SUPABASE_URL = "https://uohwrmeofuadglywamkz.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvaHdybWVvZnVhZGdseXdhbWt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxMjE1NDEsImV4cCI6MjA5OTY5NzU0MX0.9fCB0jDFQO0RVAnXA6bJeYJYR0N62CC89v2UoZnklGs";

// Initialize Supabase Client
window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

console.log("✅ Supabase Connected Successfully");