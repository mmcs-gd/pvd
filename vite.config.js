import { defineConfig } from 'vite';

export default defineConfig({
    base: '/pvd/',

    server: {
        open: true,
    },

    build: {
        outDir: 'docs/'
    }
});
