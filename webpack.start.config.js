/*
 * Copyright (c) 2018 Mainlevel Consulting AG
 */
const webpack = require("webpack");
const path = require("path");
const history = require("connect-history-api-fallback");
const convert = require("koa-connect");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TransferWebpackPlugin = require("transfer-webpack-plugin");

module.exports = {
    mode: "development",
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
                test: /\.(css|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            }
        ]
    },
    output: {
        publicPath: "/",
    },
    serve: {
        open: true,
        port: 3000,
        hot: {
            hot: true
        },
        add: (app, middleware, options) => {

            const historyOptions = {
                // see https://github.com/bripkens/connect-history-api-fallback#options
            };

            app.use(convert(history(historyOptions)));
        },
        dev: {
            publicPath: "/",
        }
    },
    devtool: "cheap-module-source-map",
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

        new webpack.DefinePlugin({
            "window.de.mainlevel": {
                NODE_ENV: JSON.stringify("development"),
                BASE_URL: JSON.stringify("https://nape.mhubmw.com/rest"),
                BASE_URL_API: JSON.stringify("https://nape.mhubmw.com/rest/business_custom"),
                BASE_REDIRECT_URL: JSON.stringify("https://nape.mhubmw.com"),
                REQUEST_RETRY_LIMIT: 1
            }
        })
    ]
};
