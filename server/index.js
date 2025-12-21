import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser"


import { docRouter } from './src/routes/doc.routes.js';
import { authRouter } from './src/routes/auth.routes.js';


import { setupWSConnection } from './src/yjs/utils.js';
import { mongoPersistence } from './src/yjs/persistance.js';
import { connectToMongoDB } from './src/config/mongo.js';
import { WebSocketServer } from 'ws';




dotenv.config();

//app setup
const app = express();
const httpServer = createServer(app);

//middlewares
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser())

//routes
app.use("/api/auth", authRouter);
app.use("/api/doc", docRouter);


//websocket-server
const wss = new WebSocketServer({ noServer: true });


wss.on('connection', (ws, req) => {
    setupWSConnection(ws, req);
    console.log(`User connected to room: ${req.url}`);
});


//binding websocket server to http server
httpServer.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URL;

connectToMongoDB(mongoURI)
    .then(() => {
        mongoPersistence()
        console.log("MongoDB persistence set up for Yjs");
    })
    .then(() => {
        httpServer.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`WebSocket ready – connect clients to ws://localhost:${PORT}/<docId>`);
        });
    });

