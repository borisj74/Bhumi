import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  appType: 'mpa',
  plugins: [react()],
  publicDir: 'public',
  server: {
    port: 5180,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        work: path.resolve(__dirname, 'work.html'),
        'work-item': path.resolve(__dirname, 'work-item.html'),
        info: path.resolve(__dirname, 'info.html'),
        notes: path.resolve(__dirname, 'notes.html'),
      },
    },
  },
});
