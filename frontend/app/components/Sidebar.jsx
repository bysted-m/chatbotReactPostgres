function SidebarHeader({ count }) {
    return (
        <div className="sidebar-header">
            <h2 className="chatbot-title">Chatbot ({count})</h2>
            <a href="/chat/new" className="new-chat-btn">
                + New
            </a>
        </div>
    );
}

function ChatThreadItem({ href, title }) {
    return (
        <li className="chat-thread-item">
            <a href={href} className="chat-thread-link">
                {title}
            </a>
        </li>
    );
}

function ChatThreadsList({ threads }) {
    if (threads.length === 0) {
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
                {threads.map((thread) => (
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

export default function Sidebar({ threads = [] }) {
    return (
        <aside className="sidebar">
            {/* Sidebar header */}
            <SidebarHeader count={threads.length} />
            {/* Chat threads list */}
            <ChatThreadsList threads={threads} />
            {/* Sidebar footer */}
            <SidebarFooter />
        </aside>
    );
}