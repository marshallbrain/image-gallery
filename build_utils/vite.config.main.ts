import {UserConfig} from "vite";
import {join} from "path";
import {node} from "./build.resources";
import { builtinModules } from 'module'

const SRC_ROOT = join(__dirname, "../src/electron");

const config: UserConfig = {
    mode: process.env.MODE,
    root: SRC_ROOT,
    envDir: process.cwd(),
    resolve: {
        alias: {
            '@electron': join(SRC_ROOT) + '/',
        },
    },
    build: {
        ssr: true,
        sourcemap: 'inline',
        target: `node${node}`,
        outDir: '../../dist/electron',
        minify: process.env.MODE !== 'development',
        lib: {
            entry: join(SRC_ROOT, "index.ts"),
            formats: ['cjs'],
        },
        rollupOptions: {
            external: [
                ...builtinModules,
            ],
            output: {
                entryFileNames: '[name].cjs',
            },
        },
        emptyOutDir: true,
        brotliSize: false,
    },
}

export default config;
