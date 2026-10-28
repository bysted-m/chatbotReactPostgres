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

### POST /api/threads

Opretter en ny thread og dens første besked i ét request. Det er en sammensat operation: serveren opretter først tråden og derefter beskeden (med `type: "user"`) i den nye tråd.

**Request Body:**

```json
{
    "title": "Hjælp til React Router",
    "content": "Hvordan bruger jeg useParams?"
}
```

**Request Body Fields:**

- `title` (påkrævet): Trådens titel. Må ikke være tom eller kun mellemrum.
- `content` (påkrævet): Den første besked i tråden. Må ikke være tom eller kun mellemrum.

**Response (201 Created):**

```json
{
    "thread": {
        "id": "3f2b8c1e-9a4d-4e7b-8c55-1d2e6f7a9b01",
        "title": "Hjælp til React Router",
        "created_at": "2025-10-14T09:30:00.000Z"
    },
    "message": {
        "id": "a1b2c3d4-0000-4000-8000-000000000001",
        "thread_id": "3f2b8c1e-9a4d-4e7b-8c55-1d2e6f7a9b01",
        "type": "user",
        "content": "Hvordan bruger jeg useParams?",
        "created_at": "2025-10-14T09:30:00.000Z"
    }
}
```

**Response (400 Bad Request):**

Mangler `title` eller `content`:

```json
{
    "error": "Both 'title' and 'content' are required"
}
```

Tom `title` eller tomt `content` (kun mellemrum):

```json
{
    "error": "Title and content cannot be empty"
}
```

**Test med curl:**

```bash
# Opret en thread med første besked
curl -X POST http://localhost:3000/api/threads \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Thread","content":"Hello, this is my first message!"}'

# Valideringsfejl: content mangler
curl -X POST http://localhost:3000/api/threads \
  -H "Content-Type: application/json" \
  -d '{"title":"Thread uden besked"}'
```

### POST /api/threads/:id/messages

Opretter en ny besked i en thread.

**URL Parameters:**

- `id`: UUID for den thread, beskeden skal tilføjes til.

**Request Body:**

```json
{
    "type": "user",
    "content": "Hvordan bruger jeg useParams?"
}
```

**Request Body Fields:**

- `type` (påkrævet): Skal være enten `"user"` eller `"bot"`.
- `content` (påkrævet): Beskedens tekst. Må ikke være tom eller kun mellemrum.

**Response (201 Created):**

```json
{
    "id": "789e4567-e89b-12d3-a456-426614174000",
    "thread_id": "3f2b8c1e-9a4d-4e7b-8c55-1d2e6f7a9b01",
    "type": "user",
    "content": "Hvordan bruger jeg useParams?",
    "created_at": "2025-10-13T12:30:05.000Z"
}
```

**Response (400 Bad Request):**

Mangler `type` eller `content`:

```json
{
    "error": "Both 'type' and 'content' are required"
}
```

Ugyldig `type`:

```json
{
    "error": "Type must be either 'user' or 'bot'"
}
```

Tomt `content`:

```json
{
    "error": "Content cannot be empty"
}
```

### PATCH /api/threads/:id

Opdaterer titlen på en thread. Det er en delvis opdatering: kun `title` ændres, og resten af tråden (fx `created_at`) forbliver uændret.

**URL Parameters:**

- `id`: UUID for den thread, der skal opdateres.

**Request Body:**

```json
{
    "title": "Nyt navn til tråden"
}
```

**Request Body Fields:**

- `title` (påkrævet): Den nye titel. Må ikke være tom eller kun mellemrum.

**Response (200 OK):**

```json
{
    "id": "3f2b8c1e-9a4d-4e7b-8c55-1d2e6f7a9b01",
    "title": "Nyt navn til tråden",
    "created_at": "2025-10-14T09:30:00.000Z"
}
```

**Response (400 Bad Request):**

Mangler `title`:

```json
{
    "error": "Title is required"
}
```

Tom `title` (kun mellemrum):

```json
{
    "error": "Title cannot be empty"
}
```

**Response (404 Not Found):**

```json
{
    "error": "Thread not found"
}
```

**Bemærk:** Endpointet bruger PATCH og ikke PUT, fordi kun `title` opdateres. PUT ville betyde, at hele tråden erstattes.

**Test med curl:**

```bash
# Opdatér titlen (erstat med et rigtigt thread-id)
curl -X PATCH http://localhost:3000/api/threads/YOUR-THREAD-ID \
  -H "Content-Type: application/json" \
  -d '{"title":"My Updated Title"}'

# Valideringsfejl: tom titel
curl -X PATCH http://localhost:3000/api/threads/YOUR-THREAD-ID \
  -H "Content-Type: application/json" \
  -d '{"title":""}'

# 404: thread findes ikke
curl -X PATCH http://localhost:3000/api/threads/00000000-0000-0000-0000-000000000000 \
  -H "Content-Type: application/json" \
  -d '{"title":"New Title"}'
```

### DELETE /api/threads/:id

Permanently deletes a thread and all of its messages.

> **Warning:** This operation is irreversible. The thread's messages are deleted automatically through the database's `ON DELETE CASCADE` constraint.

**Parameters**

| Name | In   | Description                |
| ---- | ---- | -------------------------- |
| id   | path | The UUID of the thread     |

**Success response (200 OK)**

```json
{
  "message": "Thread deleted"
}
```

**Error response (404 Not Found)**

Returned when no thread with the given id exists. This also happens if the same delete request is sent twice.

```json
{
  "error": "Thread not found"
}
```

**Testing**

```bash
# Delete a thread (replace with a real thread id)
curl -X DELETE http://localhost:3000/api/threads/YOUR-THREAD-ID

# Test the 404 response safely with a non-existent UUID
curl -X DELETE http://localhost:3000/api/threads/00000000-0000-0000-0000-000000000000
```