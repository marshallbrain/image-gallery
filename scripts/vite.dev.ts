import {createServer, InlineConfig} from "vite";

const mode = process.env.MODE = process.env.MODE || 'development';

const LOG_LEVEL = 'info';

const sharedConfig: InlineConfig = {
    mode,
    build: {
        watch: {},
    },
    logLevel: LOG_LEVEL,
};

(async () => {
    try {
        const viteDevServer = await createServer({
            ...sharedConfig,
            configFile: 'scripts/vite.config.renderer.ts',
        });

        await viteDevServer.listen();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})()