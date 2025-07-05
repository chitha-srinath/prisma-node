import { createServer } from 'http';
import { App } from './app';
import { config } from './src/config/config';
import { SocketServer } from './socket-server';
/**
 * Creates and starts the HTTP server with Express application and Socket.IO.
 * Initializes the server on the configured port and sets up real-time communication.
 */
const expressServer = new App().app;

const httpServer = createServer(expressServer);

/**
 * Initialize Socket.IO server for real-time communication.
 * Handles WebSocket connections and room management.
 */
new SocketServer(httpServer);

/**
 * Start the HTTP server and listen on the configured port.
 * Logs server startup information using the application logger.
 */
httpServer.listen(config.port, () => {
  console.log(`Server running on port http://localhost:${config.port}`);
});

export default httpServer;
