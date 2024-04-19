import { defineConfig } from 'vite';

export default defineConfig({
    publicDir: 'assets/',
    base: '/pvd/',

    server: {
        open: true,
    },

    build: {
        outDir: 'docs/'
    }
});
