const HtmlWebpackPlugin = require("html-webpack-plugin")
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { merge } = require("webpack-merge")
const base = require("./webpack.base")
const path = require("path");
const webpack = require("webpack");
const { spawn } = require("child_process")
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const port = process.env.PORT || 3000;
const publicPath = `/dist/`;

module.exports = merge(base, {
    devtool: "source-map",
    mode: 'development',
    target: "web",
    entry: {
        index: ["./src/react/index.js"],
        indexView: ["./src/react/image_viewer/index_viewer.js"]
    },
    output: {
        publicPath: `http://localhost:${port}${publicPath}`,
        filename: "dev.[name].js"
    },
    module: {
        rules: [
            {
                // loads .js/jsx files
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: [{
                    loader: require.resolve('babel-loader'),
                    options: {
                        plugins: [
                            require.resolve('react-refresh/babel'),
                        ].filter(Boolean),
                    },
                }],
            },
            {
                // loads .css files
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                // loads common image formats
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
                use: "url-loader"
            }
        ]
    },
    devServer: {
        host: "localhost",
        port: port,
        compress: true,
        hot: true,
        headers: {'Access-Control-Allow-Origin': '*'},
        allowedHosts: 'auto',
        static: {
            directory: path.join(__dirname, 'dist'),
            watch: {
                ignored: /node_modules/,
            }
        },
        onBeforeSetupMiddleware() {
            console.log('Starting Main Process...');
            spawn('npm', ['run', 'dev:main'], {
                shell: true,
                env: process.env,
                stdio: 'inherit',
            })
                .on('close', (code) => process.exit(code))
                .on('error', (spawnError) => console.error(spawnError));
        },
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development',
        }),
        new webpack.LoaderOptionsPlugin({
            debug: true,
        }),
        // fix "process is not defined" error;
        // https://stackoverflow.com/a/64553486/1837080
        new webpack.ProvidePlugin({
            process: "process/browser.js",
        }),
        new ReactRefreshWebpackPlugin(),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../../src/react/index.html"),
            filename: "index.html",
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../../src/react/image_viewer/index_viewer.html"),
            filename: "index_viewer.html",
            chunks: ['indexView']
        }),
        new CspHtmlWebpackPlugin({
            "base-uri": ["'self'"],
            "object-src": ["'none'"],
            "script-src": ["'self'", "'unsafe-eval'"],
            "style-src": ["'self'", "'unsafe-inline'"],
            "frame-src": ["'none'"],
            "worker-src": ["'none'"]
        }, {
            enabled: true,
            nonceEnabled: {
                "style-src": false,
            },
        })
    ]
})
