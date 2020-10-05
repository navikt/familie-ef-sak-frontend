const path = require('path');
const webpack = require('webpack');
const { mergeWithCustomize } = require('webpack-merge');
const common = require('./webpack.common');

const config = mergeWithCustomize({
    'entry.familie-ef-sak': 'prepend',
    'module.rules': 'append',
})(common, {
    mode: 'development',
    entry: {
        'familie-ef-sak': [
            'babel-polyfill',
            'react-hot-loader/patch',
            'webpack-hot-middleware/client?reload=true&overlay=false',
        ],
    },
    output: {
        path: path.join(__dirname, '../../frontend_development'),
        filename: '[name].[hash].js',
        publicPath: '/assets/',
        globalObject: 'this',
    },
    module: {
        rules: [
            {
                test: /\.(less)$/,
                use: [
                    { loader: require.resolve('style-loader') },
                    { loader: require.resolve('css-loader') },
                    { loader: require.resolve('less-loader') },
                ],
            },
        ],
    },
    devtool: 'inline-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
});

module.exports = config;
