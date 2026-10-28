import { createClient } from "@supabase/supabase-js";

// Kun variabler, der starter med VITE_, kommer med ud i browseren
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in the values.",
    );
}

// Anon key er offentlig og må gerne ligge i browseren.
// Supabase selv afgør, hvad nøglen må. Service role key må aldrig bruges her.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);