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
    return (
        <div className="chat-input-container">
            <div className="chat-input-wrapper">
                <textarea
                    className="chat-input"
                    placeholder="Type your message here..."
                    rows="1"
                />
                <button className="send-button" type="button">
                    Send
                </button>
            </div>
        </div>
    );
}