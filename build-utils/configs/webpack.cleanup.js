const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

module.exports = {
    mode: "production",
    entry: ["./build-utils/scripts/clean.js"],
    output: {
        path: path.resolve(__dirname, "../../build"), // Where all the output files get dropped after webpack is done with them
        filename: "prod.main.js" // The name of the webpack bundle that's generated
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                    },
                },
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
    ]
};
