import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: 'dist', assetsInlineLimit: 8192 },
  server: { open: true, port: 5173 },
});
