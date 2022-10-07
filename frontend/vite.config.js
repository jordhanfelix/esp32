import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'index.html'),
                wifimanager: resolve(__dirname, 'wifimanager.html')
            }
        }
    }
});