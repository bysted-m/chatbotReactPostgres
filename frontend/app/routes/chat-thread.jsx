import { useLoaderData } from "react-router";
import { ChatMessages, ChatInput } from "../components/Chat.jsx";

export async function clientLoader({ params }) {
    const { threadId } = params;

    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
        threadId,
        messages: [
            {
                id: 1,
                type: "user",
                timestamp: "14:02",
                content: "Hello! Can you help me understand React Router v7?",
            },
            {
                id: 2,
                type: "bot",
                timestamp: "14:02",
                content:
                    "Of course! React Router v7 is the latest version that introduces several improvements including better data loading, enhanced nested routing, and improved TypeScript support. What specific aspect would you like to learn about?",
            },
            {
                id: 3,
                type: "user",
                timestamp: "14:03",
                content: "How do nested routes work in v7?",
            },
            {
                id: 4,
                type: "bot",
                timestamp: "14:03",
                content:
                    "Nested routes in React Router v7 allow you to create hierarchical UI structures. You define parent routes that contain child routes, and use the `<Outlet />` component to render child components.",
            },
        ],
    };
}

export default function ChatThread() {
    const { threadId, messages } = useLoaderData();

    function addMessage(text) {
        console.log("Mutations will be implemented later:", text);
    }

    return (
        <main className="chat-container">
            <div className="chat-thread-header">
                <h2>Conversation Thread #{threadId}</h2>
            </div>
            <ChatMessages messages={messages} />
            <ChatInput onAddMessage={addMessage} />
        </main>
    );
}