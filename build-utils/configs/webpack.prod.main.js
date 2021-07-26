const { merge } = require("webpack-merge")
const base = require("./webpack.base")
const path = require("path");
const webpack = require("webpack");

module.exports = [
    merge(base, {
        mode: "production",
        target: "electron-main",
        entry: ["./src/main.js"],
        devtool: false,
        output: {
            path: path.resolve(__dirname, "../../build"), // Where all the output files get dropped after webpack is done with them
            filename: "prod.main.js" // The name of the webpack bundle that's generated
        },
        plugins: [
            new webpack.EnvironmentPlugin({
                NODE_ENV: 'production',
                DEBUG_PROD: false,
                START_MINIMIZED: false,
            }),
        ],
        optimization: {
            minimize: true,
            minimizer: [
                "...",
            ]
        },
    }),
    merge(base, {
        entry: './src/preload.js',
        target: 'electron-preload',
        output: {
            path: path.join(__dirname, '../../build'),
            filename: 'preload.js'
    },
}),
]
