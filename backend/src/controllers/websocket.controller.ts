import { WebSocket } from 'ws';
import { ResearchService } from '../services/research.service';

export class WebSocketController {
    static handleConnection(ws: WebSocket) {
        ws.on('message', async (message: string) => {
            try {
                const data = JSON.parse(message);
                
                if (data.type === 'startResearch') {
                    const service = new ResearchService(ws);
                    await service.startResearch(data.query);
                }
            } catch (error) {
                console.error('WebSocket error:', error);
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Failed to process request'
                }));
            }
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        ws.send(JSON.stringify({
            type: 'connected',
            message: 'Connected to research server'
        }));
    }
} 