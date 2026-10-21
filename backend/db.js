import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL mangler. Opret backend/.env ud fra .env.example");
}

// prepare: false, fordi Supabase's transaction pooler ikke understøtter prepared statements
export const sql = postgres(connectionString, { prepare: false });