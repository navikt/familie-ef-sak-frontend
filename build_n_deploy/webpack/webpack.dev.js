import path from 'path';
import webpack from 'webpack';
import { mergeWithCustomize } from 'webpack-merge';
import common from './webpack.common';
import CopyPlugin from 'copy-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

const config = mergeWithCustomize({
    'entry.familie-ef-sak': 'prepend',
    'module.rules': 'append',
})(common, {
    mode: 'development',
    entry: {
        'familie-ef-sak': [
            'babel-polyfill',
            'webpack-hot-middleware/client?reload=true&overlay=false',
        ],
    },
    output: {
        path: path.join(process.cwd(), 'frontend_development'),
        filename: '[name].[contenthash].js',
        publicPath: '/assets/',
        globalObject: 'this',
    },
    module: {
        rules: [
            {
                test: /\.(jsx|tsx|ts|js)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['react-app'],
                    plugins: ['react-refresh/babel'],
                },
            },
            {
                test: /\.(less|css)$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'icss',
                            },
                            importLoaders: 2,
                        },
                    },
                    { loader: 'less-loader' },
                ],
            },
        ],
    },
    devtool: 'inline-source-map',
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
    ],
});

export default config;
