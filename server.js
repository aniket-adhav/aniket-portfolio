import { createRequestHandler } from '@remix-run/express';
import express from 'express';
import { createServer } from 'http';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('build/client', { maxAge: '1h' }));

app.all('*', createRequestHandler({ build: await import('./build/server/index.js') }));

const server = createServer(app);
server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
