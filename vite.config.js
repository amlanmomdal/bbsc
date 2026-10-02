import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: ['.ngrok-free.app', '.ngrok.io'],
    proxy: {
      '/uploads': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      }
    }
  }
});
