export function Message(props) {
    return (
        <div className={`message ${props.type}-message`}>
            <div className="message-content">{props.children}
                <span className="message-timestamp">{props.timestamp}</span>
            </div>
        </div>
    );
}

export function ChatMessages(props) {
    return (
        <div className="chat-messages">
            {props.messages
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