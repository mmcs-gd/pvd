import { defineConfig } from 'vite';

export default defineConfig({
    publicDir: 'assets/',
    base: '/pvd/',

    server: {
        https: false,
        open: true,
    }
});
