import { useState } from "react";

export function Message({ type, timestamp, children }) {
    return (
        <div className={`message ${type}-message`}>
            <div className="message-content">{children}
                <span className="message-timestamp">{timestamp}</span>
            </div>
        </div>
    );
}

export function ChatMessages({ messages }) {
    return (
        <div className="chat-messages">
            {messages
                // indkommenter nedenstående linje for at filtrere sig frem til brugerbeskederne (ekstraopgave 2)
                // .filter((message) => message.type === "user")
                .map((message) => (
                    <Message
                        key={message.id}
                        type={message.type}
                        timestamp={message.timestamp}
                    >
                        {message.content}
                    </Message>
                ))}
        </div>
    );
}

export function ChatInput({ onAddMessage }) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    function handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const message = formData.get("message").trim();
        if (message === "") {
            return console.error("Beskeden var tom :(");

        } else {
            onAddMessage(message);
            form.reset();
            setIsSubmitting(true);
            setTimeout(() => {
                setIsSubmitting(false);
            }, 1000);
        }

    }

    function handleKeyDown(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (!isSubmitting) {
                event.target.form.requestSubmit();
            }
        }
    }

    return (
        <div className="chat-input-container">
            <form className="chat-input-wrapper" onSubmit={handleSubmit}>
                <textarea
                    className="chat-input"
                    name="message"
                    placeholder="Type your message here..."
                    rows="1"
                    onKeyDown={handleKeyDown}
                />
                <button className="send-button" type="submit" disabled={isSubmitting} >
                    {isSubmitting ? "Sending..." : "Send"}
                </button>
            </form>
        </div>
    );
}