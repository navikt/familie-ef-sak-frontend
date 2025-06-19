import { mergeWithCustomize } from 'webpack-merge';
import path from 'path';
import webpack from 'webpack';
import common from './webpack.common.js';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import process from 'process';

const config = mergeWithCustomize({
    'entry.familie-ef-sak': 'prepend',
    'module.rules': 'append',
})(common, {
    mode: 'production',
    output: {
        path: path.join(process.cwd(), 'frontend_production'),
        filename: '[name].[contenthash].js',
        publicPath: '/assets/',
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(jsx|tsx|ts|js)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.module\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                namedExport: false,
                            },
                            importLoaders: 1,
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                exclude: /\.module\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                            importLoaders: 2,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [['autoprefixer']],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        },
                    },
                    'less-loader',
                ],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new MiniCssExtractPlugin(),
        new ESLintPlugin({
            configType: 'flat',
            extensions: [`ts`, `tsx`],
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(process.cwd(), 'assets'),
                    to: path.join(process.cwd(), 'frontend_production'),
                },
            ],
        }),
        new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8,
        }),
    ],
    optimization: {
        minimizer: [new TerserPlugin()],
    },
});

export default config;
