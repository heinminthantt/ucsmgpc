import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            // No remote webfonts: Inter is self-hosted via
            // @fontsource-variable/inter (imported in app.tsx), so the
            // build never needs network access to a font CDN.
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        // Wayfinder regenerates route types by shelling out to PHP. Hosts
        // whose build image has no PHP (Vercel) use the committed generated
        // files under resources/js/{routes,actions,wayfinder} instead.
        ...(process.env.VERCEL
            ? []
            : [
                  wayfinder({
                      formVariants: true,
                  }),
              ]),
    ],
});
