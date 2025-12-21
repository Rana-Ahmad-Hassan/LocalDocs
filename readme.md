LocalDocs: Real-Time Collaborative Engine
LocalDocs is a high-performance document editing platform designed for teams that require instant, conflict-free collaboration. It re-engineers the "Google Docs experience" using a modern, stateless backend and a CRDT-based frontend for seamless multi-user editing.

💡 The Problem
In standard web apps, if two people edit the same sentence at once, one person's work usually gets overwritten. LocalDocs solves this using Conflict-free Replicated Data Types (CRDTs), ensuring every user's cursor and keystroke is synchronized in sub-100ms, regardless of network latency.

🚀 Core Features
Real-time Collaboration: Powered by Yjs and WebSockets, allowing for dozens of concurrent editors with zero merge conflicts.

Presence Awareness: See who else is in the document with real-time cursor tracking and name labels.

Rich Text Architecture: Built on ProseMirror, providing a robust schema for complex formatting, lists, and images.

Smart Persistence: Optimized MongoDB syncing using a debounced save layer—your server won't crash from constant database writes every time a user types a letter.

Auth-Integrated Permissions: Private documents accessible only to the owner and invited collaborators.

🛠 Engineering Stack
Frontend: React.js, TypeScript, Tailwind CSS

Editor Core: ProseMirror (Custom Schema)

Sync Engine: Yjs (CRDTs)

Communication: Socket.io (WebSockets)

Backend: Node.js, Express.js

Database: MongoDB (using Mongoose)

Authentication: JWT with HttpOnly Cookies

🏗 Technical Deep Dive: How it works
1. Conflict Resolution (Yjs)
Instead of sending the whole document back and forth, LocalDocs sends "binary updates." When User A types, Yjs calculates the exact change and broadcasts it via WebSockets. User B’s client merges that change into their local state automatically.

2. The Persistence Bridge
Since Yjs works in memory, saving to a database like MongoDB can be expensive. We implemented a persistence provider that listens to changes and "debounces" the save process.

Technical Note: The document is only written to the database once the users stop typing for a set interval, significantly reducing server load.

3. Permissions & Security
Every document request is validated against a collaborators array in MongoDB. If you aren't on the list, the WebSocket connection is rejected before you even see a single character.

🚦 Getting Started
1. Clone & Install
Bash

git clone https://github.com/ranaahmadhassan/localdocs.git
cd localdocs
npm install
2. Environment Setup
Create a .env file:

Code snippet

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
3. Run Development
Bash

# Start Backend
npm run server

# Start Frontend
npm run dev
📈 Challenges I Overcame
The "Double Save" Bug: Fixed issues where rapid typing caused MongoDB version conflicts by implementing a locking mechanism during the save cycle.

Initial Load Latency: Optimized the initial document fetch by populating only essential metadata, then lazy-loading the full CRDT state once the WebSocket connects.

🤝 Contributing
Found a bug? Want to add a feature? Open an issue or submit a PR. Let's build the fastest editor together!

Author
Rana Ahmad Hassan