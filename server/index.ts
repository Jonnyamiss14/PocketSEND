import { createServer } from 'http';
import next from 'next';
import { log } from "./vite";

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '5000', 10);

// Create Next.js app instance
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

(async () => {
  try {
    await app.prepare();
    
    const server = createServer(async (req, res) => {
      try {
        await handle(req, res);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('internal server error');
      }
    });

    server.listen(port, hostname, () => {
      log(`Next.js app ready on http://${hostname}:${port}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
})();
