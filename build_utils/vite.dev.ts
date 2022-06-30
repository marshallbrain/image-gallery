import {build, createLogger, createServer, InlineConfig, ResolvedServerOptions} from "vite";
import {OutputPlugin} from 'rollup'
const electronPath = require('electron');
const {spawn, ChildProcessWithoutNullStreams} = require('child_process');

const mode = process.env.MODE = process.env.MODE || 'development';

const LOG_LEVEL = 'info';

const sharedConfig: InlineConfig = {
    mode,
    build: {
        watch: {},
    },
    logLevel: LOG_LEVEL,
};

const stderrFilterPatterns = [
    /ExtensionLoadWarning/,
];

const getWatcher = (
    {name, configFile, writeBundle}: {name: string, configFile: string, writeBundle: OutputPlugin['writeBundle']}
) => {
    return build({
        ...sharedConfig,
        configFile,
        plugins: [{name, writeBundle}],
    });
};

const setupMainPackageWatcher = ({config: {server}}: {config: {server: ResolvedServerOptions}}) => {
    {
        const protocol = server.https ? 'https:' : 'http:';
        const host = server.host || 'localhost';
        const port = server.port;
        const path = '/';
        process.env.VITE_DEV_SERVER_URL = `${protocol}//${host}:${port}${path}`;
    }

    const logger = createLogger(LOG_LEVEL, {
        prefix: '[main]',
    });

    let spawnProcess: typeof ChildProcessWithoutNullStreams | null = null;

    return getWatcher({
        name: 'reload-app-on-main-package-change',
        configFile: 'build_utils/vite.config.main.ts',
        writeBundle() {
            if (spawnProcess !== null) {
                spawnProcess.off('exit', process.exit);
                spawnProcess.kill('SIGINT');
                spawnProcess = null;
            }

            spawnProcess = spawn(String(electronPath), ['.']);

            spawnProcess.stdout.on('data', (d: { toString: () => string; }) => d.toString().trim() && logger.warn(d.toString(), {timestamp: true}));
            spawnProcess.stderr.on('data', (d: { toString: () => string; }) => {
                const data = d.toString().trim();
                if (!data) return;
                const mayIgnore = stderrFilterPatterns.some((r) => r.test(data));
                if (mayIgnore) return;
                logger.error(data, { timestamp: true });
            });

            spawnProcess.on('exit', process.exit);
        },
    });
};

(async () => {
    try {
        const viteDevServer = await createServer({
            ...sharedConfig,
            configFile: 'build_utils/vite.config.renderer.ts',
        });

        await viteDevServer.listen();

        await setupMainPackageWatcher(viteDevServer)
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})()
