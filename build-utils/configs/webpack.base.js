const path = require("path");

module.exports = {
    module: {
        rules: [
            {
                // loads .html files
                test: /\.(html)$/,
                include: path.resolve(__dirname, "src/react/"),
                use: {
                    loader: "html-loader",
                    options: {
                        sources: {
                            "list": [{
                                "tag": "img",
                                "attribute": "data-src",
                                "type": "src"
                            }]
                        }
                    }
                }
            },
            {
                test: /\.[jt]sx?$/,
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
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        modules: [path.join(__dirname, './src'), 'node_modules'],
    },
};
