import {UserConfig} from "vite";
import react from '@vitejs/plugin-react'
import {join} from 'path';
import {chrome} from "./build.resources";

const SRC_ROOT = join(__dirname, "../src/react")

const config: UserConfig = {
    mode: process.env.MODE,
    root: SRC_ROOT,
    resolve: {
        alias: {
            '@react': join(SRC_ROOT) + '/',
        },
    },
    base: '',
    server: {
        fs: {
            strict: true,
        },
    },
    build: {
        sourcemap: true,
        target: `chrome${chrome}`,
        outDir: 'dist',
        assetsDir: '.',
        rollupOptions: {
            input: join(SRC_ROOT, 'index.html'),
        },
        emptyOutDir: true,
        brotliSize: false,
    },
    plugins: [
        react(),
    ],
}

export default config
