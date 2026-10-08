import { ChatMessages, ChatInput } from "../components/Chat.jsx";
import { useState } from "react";

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
      "Nested routes in React Router v7 allow you to create hierarchical UI structures. You define parent routes that contain child routes, and use the `<Outlet />` component to render child components. The parent route acts as a layout component that wraps its children.",
  },
  {
    id: 5,
    type: "user",
    timestamp: "14:05",
    content: "What's the difference between route() and layout() helpers?",
  },
  {
    id: 6,
    type: "bot",
    timestamp: "14:05",
    content:
      "Great question! The `route()` helper creates routes that add URL segments, while `layout()` creates routes that only provide UI structure without affecting the URL. Layout routes are perfect for shared components like sidebars or headers that should appear across multiple pages.",
  },
  {
    id: 7,
    type: "user",
    timestamp: "14:06",
    content: "Can you show me an example of a routes.js configuration?",
  },
  {
    id: 8,
    type: "bot",
    timestamp: "14:06",
    content:
      "Sure! Here's a basic example: You can use route(), index(), and layout() helpers to create nested route structures. The layout() function creates wrapper components, while route() adds URL segments. This approach gives you clean, hierarchical routing that's easy to maintain.",
  },
  {
    id: 9,
    type: "user",
    timestamp: "14:08",
    content: "How do I handle data loading in React Router v7?",
  },
  {
    id: 10,
    type: "bot",
    timestamp: "14:08",
    content:
      "React Router v7 provides excellent data loading capabilities through loader functions. You can define a `loader` function in your route component that runs before the component renders, ensuring your data is available immediately. You can access the loaded data using the `useLoaderData()` hook within your component.",
  },
];

export default function Home() {
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
