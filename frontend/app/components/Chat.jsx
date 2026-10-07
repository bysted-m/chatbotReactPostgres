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

export function ChatInput() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
        }, 1000);
    }

    return (
        <div className="chat-input-container">
            <form className="chat-input-wrapper" onSubmit={handleSubmit}>
                <textarea
                    className="chat-input"
                    placeholder="Type your message here..."
                    rows="1"
                />
                <button className="send-button" type="submit" disabled={isSubmitting} >
                    {isSubmitting ? "Sending..." : "Send"}
                </button>
            </form>
        </div>
    );
}