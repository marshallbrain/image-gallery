const HtmlWebpackPlugin = require("html-webpack-plugin")
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { merge } = require("webpack-merge")
const base = require("./webpack.base")
const path = require("path");
const webpack = require("webpack");

module.exports = merge(base, {
    mode: "production",
    target: "electron-renderer",
    entry: ["./src/react/index.js"],
    devtool: false,
    output: {
        path: path.resolve(__dirname, "../../build"), // Where all the output files get dropped after webpack is done with them
        filename: "./prod.render.js" // The name of the webpack bundle that's generated
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader'
                ],
            },
            {
                // SVG Font
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'image/svg+xml',
                    },
                },
            },
            {
                // Common Image Formats
                test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
                use: 'url-loader',
            },
        ]
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'production',
            DEBUG_PROD: false,
        }),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../../src/react/index.html"),
            filename: "index.html",
            base: "app://rse"
        }),
        new CspHtmlWebpackPlugin({
            "base-uri": ["'self'"],
            "object-src": ["'none'"],
            "script-src": ["'self'"],
            "style-src": ["'self'", "'unsafe-inline'"],
            "frame-src": ["'none'"],
            "worker-src": ["'none'"]
        }, {
            enabled: true,
            nonceEnabled: {
                "style-src": false,
            },
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [
            "...", // This adds default minimizers to webpack. For JS, Terser is used. // https://webpack.js.org/configuration/optimization/#optimizationminimizer
            new CssMinimizerPlugin()
        ]
    },
    node: {global: true}
})
