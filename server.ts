import { App } from './app';
import 'dotenv/config';

const server = new App();
const PORT = process.env.PORT || 3000;

server.listen(Number(PORT));
