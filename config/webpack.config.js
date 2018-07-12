const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { project_path } = require('./constant');
let { resolve } = require('path');
module.exports = [
    {
        name: 'client',
        context: project_path,
        entry: {
            index: "./index.js",
            vendor: [
                'react',
                'react-router-dom',
                'react-dom',
                'react-cookie',
                'isomorphic-fetch',
                'moment',
                'react-copy-to-clipboard',
                'react-image-crop/dist/ReactCrop',
                'babel-polyfill'
            ]
        },
        output: {
            path: resolve(project_path, 'build'),
            filename: "[name].[chunkhash].js",
            chunkFilename: "[name].[chunkhash].js",
            publicPath: "/build/"
        },
        module: {
            rules: [{
                test: /\.js$/,
                loaders: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ['env', 'react']
                        }
                    }
                ]
            },{
                test: /\.(jpg)|(png)|(svg)|(woff)|(eot)|(ttf)\??.*$/,
                loader: "url-loader",
                options: {
                    limit: 8192,
                    name: "[name].[hash].[ext]"
                }
            },{
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader?minimize=true',
                    use: 'css-loader?minimize=true'
                })
            }]
        },
        resolve: {
            extensions: [
                ".js", ".json"
            ]
        },
        externals: ['qq', 'wangEditor'],
        plugins: [
            new WebpackCleanPlugin(['build'], {
                root: project_path
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            new HtmlWebpackPlugin({
                template: "./app/index.html",
                filename: "index.html",
                showErrors: true,
                inject: "body",
                chunksSortMode: "dependency",
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: ["vendor", "manifest"],
                minChunks: Infinity
            }),
            new ExtractTextWebpackPlugin({
                filename: 'style.[contenthash].css',
                allChunks: true
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                parallel: true
            }),
            new webpack.HashedModuleIdsPlugin(),
            new CompressionPlugin({
                asset: "[path].gz[query]",
                algorithm: "gzip",
                test: /\.js$|\.css$/,
                threshold: 10240,
                minRatio: 0.8
            }),
            new ManifestPlugin({
                filename: "manifest.json"
            })
        ]
    },
    {
        name: 'server',
        context: project_path,
        entry: {
            app: "./app/app.js",
            routes: './app/config/routes.js'
        },
        output: {
            path: resolve(project_path, 'build'),
            filename: "[name].server.js",
            publicPath: "/build/",
            library: "library",
            libraryTarget: "commonjs"
        },
        module: {
            rules: [{
                test: /\.js$/,
                loaders: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ['env', 'react']
                        }
                    }
                ]
            },{
                test: /\.(jpg)|(png)|(svg)|(woff)|(eot)|(ttf)\??.*$/,
                loader: "url-loader",
                options: {
                    limit: 8192,
                    name: "[name].[hash].[ext]"
                }
            },{
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader?minimize=true',
                    use: 'css-loader?minimize=true'
                })
            }]
        },
        target: 'node',
        resolve: {
            extensions: [
                ".js", ".json"
            ]
        },
        externals: ['qq', 'wangEditor'],
        plugins: [
            new ExtractTextWebpackPlugin({
                filename: 'style.server.css',
                allChunks: true
            })
        ]
    }
];