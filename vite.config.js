import { defineConfig } from 'vite';

export default defineConfig({
    // publicDir: 'src/assets/',
    base: '/pvd/',
    root: '/',
    server: {
        https: false,
        port: 3000,
        open: true,
    }
});
