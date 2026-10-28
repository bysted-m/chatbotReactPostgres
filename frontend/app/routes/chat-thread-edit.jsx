import {
    Form,
    Link,
    redirect,
    useActionData,
    useRouteLoaderData,
} from "react-router";

/**
 * CLIENT ACTION FUNCTION
 *
 * Sender den nye titel til Express API'et med PATCH.
 * Redirecter til parent route (tråd-visningen) ved succes.
 */
export async function clientAction({ params, request }) {
    const apiUrl = import.meta.env.VITE_API_URL;

    const formData = await request.formData();
    const title = formData.get("title");

    // Hurtig feedback uden et serverkald
    if (!title || !title.trim()) {
        return { error: "Title cannot be empty" };
    }

    try {
        const response = await fetch(`${apiUrl}/api/threads/${params.threadId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: title.trim() }),
        });

        // Valideringsfejl fra serveren
        if (response.status === 400) {
            const data = await response.json();
            return { error: data.error || "Invalid title" };
        }

        if (!response.ok) {
            return { error: `Failed to update thread: ${response.status}` };
        }

        // ".." går et niveau op, tilbage til /chat/:threadId
        return redirect("..");
    } catch (error) {
        return { error: error.message };
    }
}

export default function ChatThreadEdit() {
    // Parent routens data, så vi ikke henter tråden igen
    const { thread } = useRouteLoaderData("routes/chat-thread");
    const actionData = useActionData();

    return (
        <div className="edit-title-overlay">
            <Form method="post" className="edit-title-form">
                <div className="form-field">
                    <label htmlFor="title">Thread title</label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        className="title-input"
                        defaultValue={thread.title}
                        autoFocus
                    />
                </div>
                <button type="submit" className="save-button">
                    Save
                </button>
                <Link to=".." className="cancel-button">
                    Cancel
                </Link>
            </Form>
            {actionData?.error && (
                <div className="error-message">{actionData.error}</div>
            )}
        </div>
    );
}