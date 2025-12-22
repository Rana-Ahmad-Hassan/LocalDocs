# LocalDocs
IN-Development

Real-time, conflict-free collaborative document editor built for teams that need instant, reliable collaboration.

LocalDocs delivers a Google‑Docs-like experience using modern CRDTs and a performant WebSocket sync layer — engineered for low-latency editing, robust presence, and scalable persistence.

---

## Key features

- Real-time collaboration with zero merge conflicts (Yjs / CRDTs)
- Rich text editing powered by ProseMirror with a custom schema
- Live presence and cursor awareness for active collaborators
- Optimized persistence: debounced MongoDB saves to reduce load
- Socket-based sync via Socket.io (WebSockets)
- Secure access control and JWT-based authentication
- Extensible architecture suitable for production deployment

---

## Technology stack

- Frontend: React, TypeScript, Tailwind CSS
- Editor Core: ProseMirror (custom schema)
- Real-time sync: Yjs (CRDT) + Socket.io
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Auth: JWT with HttpOnly cookies

---

## How it works (high level)

1. CRDT-based syncing (Yjs)
   - Clients produce compact, deterministic updates. Changes are broadcast to peers and merged without conflicts.

2. Persistence bridge
   - The in-memory CRDT state is periodically persisted to MongoDB via a debounced persistence provider to avoid constant writes during typing bursts.

3. Access control
   - Document requests validate against a collaborators list in MongoDB. Unauthorized WebSocket attempts are rejected at connect time.

---

## Quickstart

Prerequisites:
- Node.js (>=16)
- npm (>=8) or yarn
- MongoDB instance (local or hosted)

Clone the repo and install dependencies:

```bash
git clone https://github.com/Rana-Ahmad-Hassan/LocalDocs.git
cd LocalDocs
npm install
```

Create a `.env` in the project root with the following values:

```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
CLIENT_URL=http://localhost:5173
```

Start the development servers:

```bash
# Start backend server
npm run server

# Start frontend dev server
npm run dev
```

Open the client URL in your browser (usually `http://localhost:5173`) and connect to or create a document.

---

## Running in production

- Build the frontend and serve static assets from your preferred host (Netlify, Vercel, S3 + CloudFront, or a server).
- Host the backend behind a process manager (PM2, systemd) or containerize it (Docker).
- Use a managed MongoDB instance for reliability and scale.
- Configure HTTPS and secure your JWT secret and cookie settings.

Sample Docker + production tips:
- Use environment variables or a secrets manager for credentials.
- Consider sticky sessions or a shared WebSocket adapter (Redis) for multi-instance scaling.
- Backup CRDT snapshots and implement migration hooks for schema changes.

---

## Environment & configuration

Important environment variables:
- PORT — backend port (default: 5000)
- MONGO_URI — MongoDB connection URI
- JWT_SECRET — secret for signing JWTs
- CLIENT_URL — allowed origin for CORS and cookie redirects

Logging and metrics:
- Enable appropriate logging (info / warn / error) and export metrics for connection counts, latency, and persistence rates.

---

## Security & privacy

- Authentication uses signed JWTs stored in HttpOnly cookies to minimize XSS risk.
- Authorization checks are enforced on both HTTP endpoints and WebSocket connections.
- Validate and sanitize user-supplied content before persisting or rendering.

---

## Troubleshooting

- "Double save" or version conflicts: ensure the persistence provider’s debouncing/locking is enabled and MongoDB write concerns are configured correctly.
- High initial load latency: consider lazy-loading the full CRDT state after returning essential metadata and a lightweight placeholder.
- Connection drops at scale: verify Socket.io adapter configuration (Redis adapter) and increase connection limits or implement horizontal scaling strategies.

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Implement changes and add tests where relevant
4. Open a pull request describing the change and the motivation

For bug reports or feature requests, please open an issue with reproduction steps and expected behavior.

---

## Attribution & license

This project is MIT licensed. See the LICENSE file for details.

---

## Author

Rana Ahmad Hassan  
https://github.com/Rana-Ahmad-Hassan
