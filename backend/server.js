import express from "express";
import cors from "cors";
import { sql } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// get methods

app.get("/", (req, res) => {
    res.json({ message: "Chatbot API Server 🤖", version: "1.0.0" });
});

app.get("/api/threads", async (req, res) => {
    try {
        const threads = await sql`
      SELECT id, title, created_at
      FROM threads
      ORDER BY created_at DESC
    `;
        res.json(threads);
    } catch (error) {
        console.error("Kunne ikke hente threads:", error);
        res.status(500).json({ error: "Noget gik galt på serveren" });
    }
});

app.get("/api/threads/:id", async (req, res) => {
    const threadId = req.params.id;

    try {
        const threads = await sql`
      SELECT id, title, created_at
      FROM threads
      WHERE id = ${threadId}
    `;

        if (threads.length === 0) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.json(threads[0]);
    } catch (error) {
        console.error("Kunne ikke hente thread:", error);
        res.status(500).json({ error: "Noget gik galt på serveren" });
    }
});

app.get("/api/threads/:id/messages", async (req, res) => {
    const threadId = req.params.id;

    try {
        const messages = await sql`
      SELECT id, thread_id, type, content, created_at
      FROM messages
      WHERE thread_id = ${threadId}
      ORDER BY created_at ASC
    `;

        res.json(messages);
    } catch (error) {
        console.error("Kunne ikke hente messages:", error);
        res.status(500).json({ error: "Noget gik galt på serveren" });
    }
});

// post methods

app.post("/api/threads", async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            error: "Both 'title' and 'content' are required",
        });
    }

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (trimmedTitle.length === 0 || trimmedContent.length === 0) {
        return res
            .status(400)
            .json({ error: "Title and content cannot be empty" });
    }

    try {
        // 1. Opret tråden, og hent dens id med RETURNING
        const [thread] = await sql`
      INSERT INTO threads (title)
      VALUES (${trimmedTitle})
      RETURNING id, title, created_at
    `;

        // 2. Opret den første besked i den nye tråd
        const [message] = await sql`
      INSERT INTO messages (thread_id, type, content)
      VALUES (${thread.id}, 'user', ${trimmedContent})
      RETURNING *
    `;

        res.status(201).json({ thread, message });
    } catch (error) {
        console.error("Kunne ikke oprette thread:", error);
        res.status(500).json({ error: "Noget gik galt på serveren" });
    }
});

app.post("/api/threads/:id/messages", async (req, res) => {
    const threadId = req.params.id;
    const { type, content } = req.body;

    if (!type || !content) {
        return res.status(400).json({
            error: "Both 'type' and 'content' are required",
        });
    }

    if (type !== "user" && type !== "bot") {
        return res.status(400).json({
            error: "Type must be either 'user' or 'bot'",
        });
    }

    const trimmedContent = content.trim();
    if (trimmedContent.length === 0) {
        return res.status(400).json({ error: "Content cannot be empty" });
    }

    try {
        // 1. Gem brugerens besked
        const [userMessage] = await sql`
      INSERT INTO messages (thread_id, type, content)
      VALUES (${threadId}, ${type}, ${trimmedContent})
      RETURNING *
    `;

        // 2. Hent hele tråden, ældste først
        const history = await sql`
      SELECT type, content
      FROM messages
      WHERE thread_id = ${threadId}
      ORDER BY created_at ASC
    `;

        // 3. Map databaseformat til API-format (bot -> assistant)
        const groqMessages = history.map((message) => ({
            role: message.type === "bot" ? "assistant" : "user",
            content: message.content,
        }));

        groqMessages.unshift({
            role: "system",
            content:
                "You are a friendly pirate. Speak in pirate dialect",
        });

        // 4. Kald Groq med hele samtalen
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-20b",
                    messages: groqMessages,
                }),
            },
        );

        if (!response.ok) {
            console.error(
                "Groq API fejl:",
                response.status,
                await response.text(),
            );
            // Brugerens besked er allerede gemt, så den returneres stadig
            return res
                .status(502)
                .json({ error: "AI-tjenesten er ikke tilgængelig", userMessage });
        }

        const data = await response.json();
        const botContent = data.choices[0].message.content;

        // 5. Gem AI-svaret (API'et siger "assistant", databasen siger "bot")
        const [botMessage] = await sql`
      INSERT INTO messages (thread_id, type, content)
      VALUES (${threadId}, 'bot', ${botContent})
      RETURNING *
    `;

        // 6. Returnér begge beskeder
        res.status(201).json({ userMessage, botMessage });
    } catch (error) {
        console.error("Kunne ikke oprette message:", error);
        res.status(500).json({ error: "Noget gik galt på serveren" });
    }
});

app.post("/api/test-groq", async (req, res) => {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "GROQ_API_KEY is not configured" });
    }

    try {
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-20b",
                    messages: [
                        {
                            role: "user",
                            content: "Hello! Please respond with a short greeting.",
                        },
                    ],
                }),
            },
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (error) {
        console.error("Groq API error:", error);
        res.status(500).json({ error: "Failed to reach Groq API" });
    }
});

// patch methods
app.patch("/api/threads/:id", async (req, res) => {
    const threadId = req.params.id;
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    const trimmedTitle = title.trim();
    if (trimmedTitle.length === 0) {
        return res.status(400).json({ error: "Title cannot be empty" });
    }

    try {
        const updated = await sql`
      UPDATE threads
      SET title = ${trimmedTitle}
      WHERE id = ${threadId}
      RETURNING id, title, created_at
    `;

        // Tomt array betyder, at tråden ikke fandtes
        if (updated.length === 0) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.json(updated[0]);
    } catch (error) {
        console.error("Kunne ikke opdatere thread:", error);
        res.status(500).json({ error: "Noget gik galt på serveren" });
    }
});

// delete methods

app.delete("/api/threads/:id", async (req, res) => {
    const threadId = req.params.id;

    try {
        const deleted = await sql`
      DELETE FROM threads
      WHERE id = ${threadId}
      RETURNING id
    `;

        // Tomt array betyder, at tråden ikke fandtes
        if (deleted.length === 0) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.json({ message: "Thread deleted" });
    } catch (error) {
        console.error("Kunne ikke slette thread:", error);
        res.status(500).json({ error: "Noget gik galt på serveren" });
    }
});

app.listen(PORT, () => {
    console.log(`Server kører på http://localhost:${PORT}`);
});