const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const webpack = require('webpack');
const { project_path, port_preferred } = require('./constant');
let { resolve } = require('path');
module.exports = {
    context: project_path,
    entry: {
        bootstrap: [
            // 'react-hot-loader/patch',
            'webpack-dev-server/client?http://0.0.0.0:' + port_preferred,
            'webpack/hot/only-dev-server',
            "./index.js"
        ]
    },
    output: {
        path: resolve(project_path, 'unreality'),
        filename: "[name].js",
        chunkFilename: "[name].js",
        publicPath: "/"
    },
    module: {
        rules: [{
            test: /\.js$/,
            loaders: [
                {
                    loader: "babel-loader",
                    options: {
                        presets: ['env', 'react'],
                        plugins: [
                            // "react-hot-loader/babel"
                        ]
                    }
                }
            ]
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
                loader: "css-loader"
            }]
        },{
            test: /\.html$/,
            loader: 'html-loader'
        }]
    },
    resolve: {
        extensions: [
            ".js", ".json"
        ]
    },
    devtool: "source-map",
    externals: {
        "react": "window.React",
        "react-dom": "window.ReactDOM",
        "react-router-dom": "window.ReactRouterDOM",
        "antd": "window.antd",
        "react-redux": "window.ReactRedux",
        "redux": "window.Redux",
        "babel-polyfill": "window._babelPolyfill"
    },
    devServer: {
        contentBase: [resolve(project_path, 'unreality/'), resolve(project_path, 'node_modules/'), resolve(project_path, 'index.html')],
        port: port_preferred,
        clientLogLevel: "error",
        historyApiFallback: {
            rewrites: [
                {
                    from: /^\/node_modules\//,
                    to: function(context){
                        return context.parsedUrl.pathname.replace(/^\/node_modules\//,'');
                    }
                }
            ],
            index: "/index.html",
            disableDotRule: false
        },
        proxy: {
            '/api': 'http://localhost:8061',
            '/static': 'http://localhost:8061'
            // '/api': "http://test.train.hey-q.com",
            // '/static': 'http://test.train.hey-q.com'
        },
        hot: true,
        overlay: {
            warnings: true,
            errors: true
        },
        publicPath: "/",
        watchOptions: {
            ignored: /node_modules/,
            poll: 300
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            filename: "index.html",
            title: "羽毛球培训系统第一版",
            showErrors: true,
            inject: "body",
            chunksSortMode: "dependency",
            // chunks: [
            //     "bootstrap",
            //     "app.js"
            // ]
        }),
        // new PreloadWebpackPlugin({
        //     rel: 'preload',
        //     as: 'script',
        //     include: 'asyncChunks'//all
        // }),
        new webpack.HotModuleReplacementPlugin()
    ]
};