const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileLoader = require('file-loader');
var ImageminPlugin = require('imagemin-webpack-plugin').default;
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

//
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PATHS = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../dist'),
    assets: 'assets/',
};

const config = {

    externals: {
      paths: PATHS,
    },
    // First, let's define an entry point for webpack to start its crawling.
    entry: {
        app : PATHS.src
    },
    // Second, we define where the files webpack produce, are placed
    output: {
        path: PATHS.dist,
        filename: `${PATHS.assets}js/bundle.js`,
        publicPath: "/"
    },

    module: {
        rules: [
            {

                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/ ,
                loader: 'file-loader',
                options:{
                    name: '[name].[ext]'
                }
            },


            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {sourceMap: true},

                    },
                    {
                        loader: "postcss-loader",
                        options:
                            {sourceMap: true,
                                plugins:[

                                    require('autoprefixer'),
                                    require('css-mqpacker'),
                                    require('cssnano')({
                                        preset:[
                                            'default',{
                                                discardComments:{
                                                    removeAll: true,
                                                }
                                            }
                                        ]
                                    })

                                ]
                            }
                    },
                ]
            },

            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {sourceMap: true},

                    },
                    {
                        loader: "postcss-loader",
                        options: {sourceMap: true, config:{path: `${PATHS.src}/js/postcss.config.js`}}
                    },

                    {
                        loader: "less-loader",
                        options: {sourceMap: true}
                    }
                ]
            },

            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            }

        ]
    },



    plugins: [
        new MiniCssExtractPlugin(
            {
                filename: `${PATHS.assets}css/[name].css`,
            }),

        new CopyWebpackPlugin([
            {from: `${PATHS.src}/img`, to: `${PATHS.assets}/img`},
            {from: `${PATHS.src}/static`, to: `${PATHS.assets}/static`},

            ]
        ),
        new HtmlWebpackPlugin({
            hash: false,
            template: `${PATHS.src}/index.html`,
            filename: './index.html'
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery'",
            "window.jquery": "jquery'",
            "window.$": "jquery"
        })

    ]

};

module.exports = config;