import { createServer } from 'http';
import { App } from './app';
import { config } from './src/config/config';
import { SocketServer } from './socket-server';

const expressServer = new App().app;

const httpServer = createServer(expressServer);

new SocketServer(httpServer);

httpServer.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default httpServer;
