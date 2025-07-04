import path from 'path';
import process from 'process';
import webpack from 'webpack';
import { mergeWithCustomize } from 'webpack-merge';
import common from './webpack.common.js';
import CopyPlugin from 'copy-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';

const config = mergeWithCustomize({
    'entry.familie-ef-sak': 'prepend',
    'module.rules': 'append',
})(common, {
    mode: 'development',
    entry: {
        'familie-ef-sak': ['webpack-hot-middleware/client?reload=true&overlay=false'],
    },
    output: {
        path: path.join(process.cwd(), 'frontend_development'),
        filename: '[name].[contenthash].js',
        publicPath: '/assets/',
        globalObject: 'this',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(jsx|tsx|ts|js)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    plugins: ['react-refresh/babel'],
                },
            },
            {
                test: /\.module\.css$/,
                use: [
                    'style-loader',
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
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'icss',
                            },
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
        ],
    },
    devtool: 'eval-cheap-module-source-map',
    experiments: {
        backCompat: false,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        new ReactRefreshWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(process.cwd(), 'assets'),
                    to: path.join(process.cwd(), 'frontend_development'),
                },
            ],
        }),
        new ESLintPlugin({
            cache: true,
            configType: 'flat',
            extensions: [`ts`, `tsx`],
            emitWarning: true,
            emitError: false,
        }),
    ],
});

export default config;
