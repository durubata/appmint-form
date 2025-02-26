import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig({
    plugins: [
        react(),
        dts({
            include: ['src'],
            exclude: ['_old', 'node_modules', 'dist'],
        }),
        libInjectCss(),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.tsx'),
            name: 'AppmintForm',
            fileName: (format) => `appmint-form.${format}.js`,
            formats: ['es', 'cjs'],
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                ...Object.keys(
                    require('./package.json').dependencies || {}
                ),
            ],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react/jsx-runtime': 'jsxRuntime',
                },
            },
        },
        sourcemap: true,
        emptyOutDir: true,
    },
});
