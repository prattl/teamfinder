import webpack from 'webpack'
import dotenv from 'dotenv'
import BundleTracker from 'webpack-bundle-tracker'
import fs from 'fs'
import path, { join, resolve } from 'path'

const NODE_ENV = process.env.NODE_ENV
const isDev  = NODE_ENV === 'development'
const isTest = NODE_ENV === 'test'

const root    = resolve(__dirname)
const src     = join(join(root, 'teamfinder'), 'frontend')
const modules = join(root, 'node_modules')
const dest    = join(join(root, 'static'), 'bundles')

let config = {
    context: __dirname,
    entry: './teamfinder/frontend/App.js',
    output: {
        path: path.resolve(dest),
        filename: '[name]-[hash].js',
        publicPath: 'http://localhost:8080/static/bundles/'
    },
    plugins: [
        new BundleTracker({filename: './webpack-stats.json'})
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: src,
                query: {
                    presets: ['es2015', 'stage-0', 'react']
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            },
            {
                test: /\.sass$/,
                loaders: ['style', 'css', 'sass?indentedSyntax']
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=10000&minetype=application/font-woff'
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader'
            }
        ]
    },
    resolve: {
        alias: {
            actions: join(src, 'actions'),
            api: join(src, 'api'),
            components: join(src, 'components'),
            containers: join(src, 'containers'),
            reducers: join(src, 'reducers'),
            styles: join(src, 'styles'),
            utils: join(src, 'utils')
        },
        extensions: ['', '.js', '.jsx'],
        root: [
            path.resolve(src),
            path.resolve(modules)
        ]
    }
}

export default config
