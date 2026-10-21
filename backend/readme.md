# Chatbot API

Express REST API med Postgres (Supabase).

## Opsætning

1. Kør `npm install` i `backend/`.
2. Kopiér `.env.example` til `.env` og udfyld `DATABASE_URL` med din Supabase transaction pooler-streng.
3. Start serveren med `npm run dev`.

## Scripts

- `npm start`: starter serveren.
- `npm run dev`: starter serveren og genstarter ved filændringer.

## Miljøvariabler

- `DATABASE_URL`: forbindelsesstreng til Supabase (port 6543).
- `PORT`: serverens port. Standard er 3000.

## Endpoints

## Endpoints

### GET /

Statusbesked fra serveren.

### GET /api/threads

Returnerer alle threads, nyeste først.

**Response (200 OK):**

```json
[
    {
        "id": "3f2b8c1e-9a4d-4e7b-8c55-1d2e6f7a9b01",
        "title": "Hjælp til React Router",
        "created_at": "2025-10-13T12:30:00.000Z"
    }
]
```

### GET /api/threads/:id

Returnerer én thread.

**URL Parameters:**

- `id`: UUID for den thread, der skal hentes.

**Response (200 OK):**

```json
{
    "id": "3f2b8c1e-9a4d-4e7b-8c55-1d2e6f7a9b01",
    "title": "Hjælp til React Router",
    "created_at": "2025-10-13T12:30:00.000Z"
}
```

**Response (404 Not Found):**

```json
{
    "error": "Thread not found"
}
```

### GET /api/threads/:id/messages

Returnerer alle beskeder i en thread, ældste først. Hvis tråden ingen beskeder har (eller ikke findes), returneres et tomt array `[]`.

**URL Parameters:**

- `id`: UUID for den thread, hvis beskeder skal hentes.

**Response (200 OK):**

```json
[
    {
        "id": "a1b2c3d4-0000-4000-8000-000000000001",
        "thread_id": "3f2b8c1e-9a4d-4e7b-8c55-1d2e6f7a9b01",
        "type": "user",
        "content": "Hvordan bruger jeg useParams?",
        "created_at": "2025-10-13T12:30:05.000Z"
    }
]
```

## Test

Start serveren med `npm run dev` i `backend/`. Hent først listen for at finde et rigtigt UUID, og erstat derefter `{id}` i de andre kald:

```bash
curl http://localhost:3000/api/threads
curl http://localhost:3000/api/threads/{id}
curl http://localhost:3000/api/threads/{id}/messages
```

I PowerShell bruges `curl.exe` i stedet for `curl`. Du kan også åbne URL'erne direkte i browseren.

Et UUID, der ikke findes, giver 404 på `/api/threads/{id}`:

```bash
curl http://localhost:3000/api/threads/00000000-0000-0000-0000-000000000000
```