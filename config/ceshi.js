const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { project_path } = require('./constant');
let { resolve } = require('path');
module.exports = {
    name: 'server',
    context: project_path,
    entry: {
        ceshi: "./app/ceshi.js",
        // routes: './app/config/routes.js'
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
        }]
    },
    target: 'node'
};