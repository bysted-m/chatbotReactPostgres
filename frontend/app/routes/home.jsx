import { ChatMessages, ChatInput } from "../components/Chat.jsx"

export default function Home() {
  return (
    <main className="chat-container">
      <ChatMessages />
      <ChatInput />
    </main>
  );
}