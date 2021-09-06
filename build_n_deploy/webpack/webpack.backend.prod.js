const path = require('path');

module.exports = {
    entry: './src/backend/server.ts',
    mode: 'production',
    target: 'node',
    output: {
        path: path.join(__dirname, '../../backend_production/backend'),
        filename: 'server.js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
};
