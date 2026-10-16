import { useLoaderData } from "react-router";
import { ChatMessages, ChatInput } from "../components/Chat.jsx";

export async function clientLoader({ params }) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const headers = {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
    };

    const response = await fetch(
        `${supabaseUrl}/rest/v1/threads?id=eq.${params.threadId}&select=*,messages(*)&messages.order=created_at.asc`,
        { headers },
    );

    if (!response.ok) {
        throw new Error("Kunne ikke hente thread");
    }

    const threadData = await response.json();
    const thread = threadData[0];

    if (!thread) {
        throw new Response("Thread not found", { status: 404 });
    }

    return { thread, messages: thread.messages };
}
export default function ChatThread() {
    const { thread, messages } = useLoaderData();

    function addMessage(text) {
        console.log("Mutations will be implemented later:", text);
    }

    return (
        <main className="chat-container">
            <div className="chat-thread-header">
                <h2>{thread.title}</h2>
            </div>
            <ChatMessages messages={messages} />
            <ChatInput onAddMessage={addMessage} />
        </main>
    );
}