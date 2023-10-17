var path = require("path");
var webpack = require('webpack');

module.exports = {
    context: __dirname,

    entry: './src/index.js',

    output: {
        filename: 'app.js',
        path: __dirname + 'public',
        publicPath: '/'
    },
    // devServer: {
    //     contentBase: './public'
    // },
    devtool: 'eval-source-map',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: [".*", ".js", ".jsx"]
    }

};