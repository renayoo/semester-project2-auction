import { dirname, resolve } from 'path';
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';

export default defineConfig({
    appType: 'mpa',
    plugins: [tailwindcss()],
    css: {
        postcss: './postcss.config.js',
    },
    build: {
        target: 'esnext',
        rollupOptions: {
        input: {
            main: resolve(__dirname, './index.html'),
            login: resolve(__dirname, './auth/login/index.html'),
            register: resolve(__dirname, './auth/register/index.html'),
            listing: resolve(__dirname, './listing/index.html'),
            listingCreate: resolve(__dirname, './listing/create/index.html'),
            listingEdit: resolve(__dirname, './listing/update/index.html'),
            profile: resolve(__dirname, './profile/index.html'),
            profileEdit: resolve(__dirname, './profile/update/index.html'),
        },
        },
    },
});
