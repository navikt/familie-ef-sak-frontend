const common = require('./webpack.common');
const { mergeWithCustomize } = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const config = mergeWithCustomize({
    'entry.familie-ef-sak': 'prepend',
    'module.rules': 'append',
})(common, {
    mode: 'production',
    entry: {
        'familie-ef-sak': ['babel-polyfill'],
    },
    output: {
        path: path.join(__dirname, '../../frontend_production'),
        filename: '[name].[contenthash].js',
        publicPath: '/assets/',
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                compileType: 'icss',
                            },
                            importLoaders: 2,
                        },
                    },
                    { loader: 'postcss-loader' },
                    {
                        loader: 'less-loader',
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new webpack.optimize.OccurrenceOrderPlugin(false),
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({
            filename: 'familie-ef-sak-frontend.css',
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, '../../assets'),
                    to: path.join(__dirname, '../../frontend_production'),
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

module.exports = config;
