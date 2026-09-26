import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function dataPersistencePlugin() {
  return {
    name: 'data-persistence',
    configureServer(server) {
      // 1. Read dataset directly from disk
      server.middlewares.use('/api/data', async (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const url = new URL(req.url, 'http://localhost');
            const dataset = url.searchParams.get('dataset');
            const allowed = ['contents', 'characters', 'events', 'trailers', 'merchandise'];
            if (allowed.includes(dataset)) {
              const filePath = path.resolve(process.cwd(), 'src', 'data', `${dataset}.json`);
              const fileContent = await fs.promises.readFile(filePath, 'utf-8');
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(fileContent);
              return;
            }
          } catch (err) {
            console.error('[Vite Data Plugin] Read error:', err);
          }
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Dataset not found' }));
          return;
        }
        next();
      });

      // 2. Write dataset to disk and broadcast update to all open tabs in real-time
      server.middlewares.use('/api/sync-data', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { dataset, data } = JSON.parse(body);
              const allowed = ['contents', 'characters', 'events', 'trailers', 'merchandise'];
              if (allowed.includes(dataset) && Array.isArray(data)) {
                const filePath = path.resolve(process.cwd(), 'src', 'data', `${dataset}.json`);
                await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

                // Broadcast in real-time to ALL open browser tabs (User, Admin, Incognito, Normal)
                server.ws.send({
                  type: 'custom',
                  event: 'fandomverse:data-updated',
                  data: { dataset, data },
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
                return;
              }
            } catch (err) {
              console.error('[Vite Data Plugin] Error writing data:', err);
            }
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false }));
          });
          return;
        }
        res.writeHead(405);
        res.end();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), dataPersistencePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  base: './', // Ensures relative assets work on GitHub Pages and static preview
  server: {
    port: 5173,
    open: false,
    watch: {
      ignored: ['**/src/data/**'],
    },
  },
});

