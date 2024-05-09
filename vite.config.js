import { defineConfig } from 'vite';

export default defineConfig({
    // publicDir: 'src/assets/',
    base: '/pvd/',
    root: '/',
    server: {
        https: false,
        open: true,
    }
});
