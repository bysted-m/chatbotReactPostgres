import { useActionData, redirect } from "react-router";
import { ChatInput, ChatMessages } from "../components/Chat.jsx";

/**
 * CLIENT ACTION FUNCTION
 *
 * Handles creation of new chat threads with their first message.
 * Key concepts:
 * 1. SINGLE REQUEST: Our Express API creates both thread and message
 * 2. REDIRECT: Navigate to new thread after successful creation
 * 3. TITLE GENERATION: Create thread title from first message
 * 4. ERROR HANDLING: Validate input and handle API errors
 *
 * The action runs:
 * - When a Form with method="post" is submitted
 * - Returns a redirect to navigate to the new thread
 */
export async function clientAction({ request }) {
  const apiUrl = import.meta.env.VITE_API_URL;

  // Extract form data
  const formData = await request.formData();
  const content = formData.get("message");

  // Validate message content
  if (!content || !content.trim()) {
    return { error: "Message cannot be empty" };
  }

  // Generate thread title from first message (truncate to 50 chars)
  const title =
    content.trim().length > 50
      ? content.trim().slice(0, 50) + "..."
      : content.trim();

  try {
    // One request creates both the thread and the first message
    const response = await fetch(`${apiUrl}/api/threads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content: content.trim() }),
    });

    // Valideringsfejl fra serveren
    if (response.status === 400) {
      const data = await response.json();
      return { error: data.error || "Invalid thread data" };
    }

    if (!response.ok) {
      return { error: `Failed to create thread: ${response.status}` };
    }

    // Response has the shape { thread, message }
    const data = await response.json();

    return redirect(`/chat/${data.thread.id}`);
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Chat New Route Component
 *
 * Provides a form to start a new conversation.
 * When submitted, creates a thread and redirects to it.
 *
 * Key concepts:
 * 1. DEDICATED ROUTE: Separate route for new chat functionality
 * 2. CLEAN URL: /chat/new is semantic and user-friendly
 * 3. FORM SUBMISSION: Uses ChatInput component with Form
 * 4. ERROR DISPLAY: Shows validation or API errors to user
 */
export default function ChatNew() {
  // Access action result for error display
  const actionData = useActionData();

  return (
    <main className="chat-container">
      <div className="chat-thread-header">
        <h2>Start a new conversation</h2>
        <p>Type a message below to begin chatting</p>
      </div>
      <ChatMessages />
      <ChatInput />
      {actionData?.error && (
        <div className="error-message">{actionData.error}</div>
      )}
    </main>
  );
}
