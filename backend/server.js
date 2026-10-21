import express from "express";
import cors from "cors";
import { sql } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
        const messages = await sql`
      INSERT INTO messages (thread_id, type, content)
      VALUES (${threadId}, ${type}, ${trimmedContent})
      RETURNING *
    `;

        res.status(201).json(messages[0]);
    } catch (error) {
        console.error("Kunne ikke oprette message:", error);
        res.status(500).json({ error: "Noget gik galt på serveren" });
    }
});

app.listen(PORT, () => {
    console.log(`Server kører på http://localhost:${PORT}`);
});