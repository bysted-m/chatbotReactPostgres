import { Outlet, useLoaderData } from "react-router";
import Sidebar from "../components/Sidebar.jsx";

export async function clientLoader() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const url = `${supabaseUrl}/rest/v1/threads?select=*&order=created_at.desc`;

  const response = await fetch(url, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (!response.ok) {
    throw new Error("Kunne ikke hente threads");
  }

  return await response.json();
}

export default function Layout() {
  const threads = useLoaderData();

  function handleDelete(threadId) {
    console.log("Mutations will be implemented later:", threadId);
  }

  return (
    <div className="app-layout">
      <Sidebar threads={threads} onDeleteThread={handleDelete} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}