import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { config } from './config/config';
import { WebSocketController } from './controllers/websocket.controller';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// WebSocket connection handler
wss.on('connection', WebSocketController.handleConnection);

app.get('/', (_req, res) => {
    res.send('API Running');
});

app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.url} not found` });
});

export { app, server };
