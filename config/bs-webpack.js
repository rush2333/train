const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const { resolve } = require('path');
const { project_path, source_map } = require('./constant');
module.exports = {
    context: project_path,
    entry: {
        bootstrap: "./index.js"
    },
    output: {
        filename: "[name].js",
        chunkFilename: "[name].js",
        path: resolve(project_path, 'dev/'),
        publicPath: "/"
    },
    devtool: source_map,
    module: {
        rules: [
            {
                test: /\.js$/,
                loaders: [{
                    loader: "babel-loader?cacheDirectory",
                    options: {
                        presets: [
                            "env",
                            "react"
                        ],
                        plugins: [
                            "syntax-dynamic-import"
                        ]
                    }
                }]
            },{
                test: /\.(jpg)|(png)|(svg)|(woff)|(eot)|(ttf)\??.*$/,
                loader: "url-loader",
                options: {
                    limit: 8192,
                    name: "others/[name].[hash].[ext]"
                }
            },{
                test: /\.css$/,
                loaders: [{
                    loader: "style-loader"

                },{
                    loader: "css-loader",
                    // options: {
                    //     modules: true,
                    //     importLoaders: 1,
                    //     localIdentName: '[name]__[local]__[hash:base64:5]'
                    // }
                }]
            }
        ]
    },
    resolve: {
        extensions: [
            ".js", ".json"
        ]
    },
    externals: {
        "react": "window.React",
        "react-dom": "window.ReactDOM",
        "react-router-dom":"window.ReactRouterDOM",
        "antd": "window.antd",
        "react-redux": "window.ReactRedux",
        "redux": "window.Redux",
        "babel-polyfill": "window._babelPolyfill"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            filename: "index.html",
            title: "羽毛球培训系统第一版",
            showErrors: true,
            // inject: "body",
            // chunksSortMode: "dependency"
        }),
        // new PreloadWebpackPlugin({
        //     rel: 'preload',
        //     as: 'script',
        //     include: 'asyncChunks'//all
        // }),
        new webpack.NamedModulesPlugin(),
    ]
};