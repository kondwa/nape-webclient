/*
 * Copyright (c) 2018 Mainlevel Consulting AG
 */
const webpack = require("webpack");
const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TransferWebpackPlugin = require("transfer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ZipPlugin = require("zip-webpack-plugin");

module.exports = {
    mode: "production",
    output: {
        filename: "[hash].main.js",
        publicPath: "/"
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                options: {
                    failOnError: false
                }
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    cacheDirectory: true
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: {minimize: true}
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }
        ]
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                terserOptions: {
                    compress: false,
                    ecma: 6,
                    mangle: true
                },
                sourceMap: true
            })
        ]
    },
    plugins: [
        new TransferWebpackPlugin(
            [
                {from: "www/images", to: "images"},
            ],
            path.resolve(__dirname, "src")
        ),

        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        }),

        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),

        new webpack.LoaderOptionsPlugin({
            options: {}
        }),

        new webpack.EnvironmentPlugin({
            NODE_ENV: "production"
        }),

        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            },
            "window.de.mainlevel": {
                NODE_ENV: JSON.stringify("production"),
                BASE_URL: JSON.stringify("https://nape.mhubmw.com/rest"),
                BASE_URL_API: JSON.stringify("https://nape.mhubmw.com/rest/business_custom"),
                BASE_REDIRECT_URL: JSON.stringify("https://nape.mhubmw.com"),
                REQUEST_RETRY_LIMIT: JSON.stringify("3"),
            }
        }),

        new ZipPlugin({
            path: "..",
            filename: "webclient.zip"
        })
    ]
};
