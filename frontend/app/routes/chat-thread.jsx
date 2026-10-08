import { useState } from "react";
import { ChatMessages, ChatInput } from "../components/Chat.jsx";

const initialMessages = [
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
];

export default function ChatThread() {
  const [messages, setMessages] = useState(initialMessages);

  function addMessage(text) {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, type: "user", content: text },
    ]);
  }

  return (
    <main className="chat-container">
      <ChatMessages messages={messages} />
      <ChatInput onAddMessage={addMessage} />
    </main>
  );
}
