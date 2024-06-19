import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    publicDir: 'assets/',
    base: '/pvd/',

    server: {
        https: false,
        open: true,
    },

    build: {
        rollupOptions: {
            output: {
                // Public path for assets is prefixed with base
                assetFileNames: ({ name }) => {
                    if (name && name.startsWith('assets/')) {
                        return name.replace(/^assets\//, 'pvd/assets/');
                    }
                    return name;
                },
            },
        },
    },

    plugins: [tsconfigPaths()],
});
