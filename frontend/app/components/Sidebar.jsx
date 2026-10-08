import { useState } from "react";
import { Link, NavLink, href } from "react-router";

function SidebarHeader({ count }) {
    return (
        <div className="sidebar-header">
            <h2 className="chatbot-title">Chatbot ({count})</h2>
            <Link to="/chat/new" className="new-chat-btn">
                + New
            </Link>
        </div>
    );
}

function ChatThreadsList({ threads = [], onDeleteThread }) {
    const [searchValue, setSearchValue] = useState("");
    const filteredThreads = threads.filter((thread) =>
        thread.title.toLowerCase().includes(searchValue.toLowerCase()),
    );
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
            <input
                className="chat-search-input"
                type="text"
                placeholder="Search threads..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                aria-label="Search threads"
            />
            <ul>
                {filteredThreads.map((thread) => (
                    <ChatThreadItem
                        key={thread.id}
                        thread={thread}
                        onDelete={onDeleteThread}
                    />
                ))}
            </ul>
        </nav>
    );
}

function ChatThreadItem({ thread, onDelete }) {
    const { id, title } = thread;

    const handleDelete = (event) => {
        event.stopPropagation();
        onDelete(id);
    };
    return (
        <li className="chat-thread-item">
            <div className="chat-thread-item-content">
                <NavLink
                    to={href("/chat/:threadId", { threadId: id })}
                    className={({ isActive, isPending }) =>
                        [
                            "chat-thread-link",
                            isActive && "chat-thread-link-active",
                            isPending && "chat-thread-link-pending",
                        ]
                            .filter(Boolean)
                            .join(" ")
                    }
                >
                    {title}
                </NavLink>
                <button
                    onClick={handleDelete}
                    aria-label="delete chat thread item"
                    type="button"
                    className="deleteThread"
                >
                    &times;
                </button>
            </div>
        </li>
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

export default function Sidebar({ threads = [], onDeleteThread }) {
    return (
        <aside className="sidebar">
            {/* Sidebar header */}
            <SidebarHeader count={threads.length} />
            {/* Chat threads list */}
            <ChatThreadsList threads={threads} onDeleteThread={onDeleteThread} />
            {/* Sidebar footer */}
            <SidebarFooter />
        </aside>
    );
}
