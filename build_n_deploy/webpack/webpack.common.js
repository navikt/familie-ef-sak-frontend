import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TypeScriptTypeChecker from 'fork-ts-checker-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';

const common = {
    entry: {
        'familie-ef-sak': ['./src/frontend/index.tsx'],
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.less', '.mjs'],
        fallback: { crypto: false },
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
                use: [`file-loader`],
            },
            {
                test: /\.(jsx|tsx|ts|js)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['react-app'],
                },
            },
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false,
                },
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader',
            },
        ],
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
        runtimeChunk: true,
        emitOnErrors: false,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(process.cwd(), 'src/frontend/index.html'),
            inject: 'body',
            alwaysWriteToDisk: true,
        }),
        new TypeScriptTypeChecker(),
        new ESLintPlugin({
            extensions: [`ts`, `tsx`],
        }),
    ],
};
export default common;
