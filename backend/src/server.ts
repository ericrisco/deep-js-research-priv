import { server } from './app';
import { config } from './config/config';

const startServer = async () => {
    try {
        server.listen(config.port, () => {
            console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
            console.log(`WebSocket server is ready for connections`);
        });
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

startServer();
