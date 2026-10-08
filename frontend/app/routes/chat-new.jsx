import { useState } from "react";
import { ChatMessages, ChatInput } from "../components/Chat.jsx";

export default function ChatNew() {
  const [messages, setMessages] = useState([]);

  function addMessage(text) {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, type: "user", content: text },
    ]);
  }

  return (
    <main className="chat-container">
      <div className="chat-thread-header">
        <h2>Start a new conversation</h2>
      </div>
      <ChatMessages messages={messages} />
      <ChatInput onAddMessage={addMessage} />
    </main>
  );
}
