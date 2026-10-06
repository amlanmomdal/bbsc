import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    open: true,
    proxy: {
      '/uploads': {
        target: 'http://34.230.0.252:5001',
        changeOrigin: true,
      }
    }
  }
  
});
