function SidebarHeader(props) {
    return (
        <div className="sidebar-header">
            <h2 className="chatbot-title">Chatbot ({props.count})</h2>
            <a href="/chat/new" className="new-chat-btn">
                + New
            </a>
        </div>
    );
}

function ChatThreadItem(props) {
    return (
        <li className="chat-thread-item">
            <a href={props.href} className="chat-thread-link">
                {props.title}
            </a>
        </li>
    );
}

function ChatThreadsList(props) {
    if (props.threads.length === 0) {
        return (
            <nav className="chat-threads-list" aria-label="Chat threads">
                <p className="chat-threads-empty">
                    No chats yet. Click "+ New" to start one.
                </p>
            </nav>
        );
    }

    return (
        <nav className="chat-threads-list" aria-label="Chat threads">
            <ul>
                {props.threads.map((thread) => (
                    <ChatThreadItem
                        key={thread.id}
                        href={thread.href}
                        title={thread.title}
                    />
                ))}
            </ul>
        </nav>
    );
}

function SidebarFooter() {
    return (
        <div className="sidebar-footer">
            <a href="/profile" className="user-profile">
                <img
                    src="https://ui-avatars.com/api/?name=Batman&background=0D0D0D&color=fff&size=40"
                    alt="User avatar"
                    className="user-avatar"
                    width={30}
                    height={30}
                />
                <span className="user-name">Batman</span>
            </a>
        </div>
    );
}

export default function Sidebar(props) {
    return (
        <aside className="sidebar">
            {/* Sidebar header */}
            <SidebarHeader count={props.threads.length} />
            {/* Chat threads list */}
            <ChatThreadsList threads={props.threads} />
            {/* Sidebar footer */}
            <SidebarFooter />
        </aside>
    );
}