import {UserConfig} from "vite";
import react from '@vitejs/plugin-react'
import {join} from 'path';

const SRC_ROOT = __dirname;

const config: UserConfig = {
    mode: process.env.MODE,
    root: SRC_ROOT,
    resolve: {
        alias: {
            '@react': join(SRC_ROOT) + '/',
        },
    },
    plugins: [react()],
    base: '',
    server: {
        fs: {
            strict: true,
        },
    },
}

export default config
