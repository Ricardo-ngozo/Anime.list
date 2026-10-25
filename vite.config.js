import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import animeHandler from './api/anime.js';

export default defineConfig({
  plugins: [react(), {
    name: 'local-anime-api',
    configureServer(server) {
      server.middlewares.use('/api/anime', animeHandler);
    },
  }],
  build: {
    minify: false,
    sourcemap: true,
  },
});
