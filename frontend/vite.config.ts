import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs';
import path from 'path';

const version = fs.readFileSync(path.resolve(__dirname, '../VERSION'), 'utf-8').trim();

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    define: {
        __APP_VERSION__: JSON.stringify(version),
    },
    server: {
        host: true,
        port: 5173,
        strictPort: true,
        watch: {
            usePolling: true,
        },
        proxy: {
            '/api': {
                target: 'http://api:80',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            }
        }
    }
})
