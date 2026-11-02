import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// /api calls are proxied to the Node fetch server (server/index.js)
export default defineConfig({ plugins: [react()], server: { port: 5173, proxy: { '/api': 'http://localhost:3001' } } });
