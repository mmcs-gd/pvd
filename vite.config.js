import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    publicDir: 'assets/',
    base: '/pvd/',

    server: {
        https: false,
        open: true,
    },

    plugins: [tsconfigPaths()],
});
