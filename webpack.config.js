const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
	entry: ['babel-polyfill', './src/index'],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
    },
    resolve: {
		alias: {
			'hiredis': path.join(__dirname, 'aliases/hiredis.js')
		}
	},
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1,
		}),
		new CleanWebpackPlugin(['./dist'])
	],
	module: {
		'rules': [
			{
				'loader': 'babel-loader',
				'test': /\.js$/,
				'exclude': /node_modules/,
				'options': {
					'presets': [
						'env'
					],
					'plugins': [
						require('babel-plugin-dynamic-import-node'),
						require('babel-plugin-syntax-dynamic-import'),
						require('babel-plugin-transform-object-rest-spread')
					],
					babelrc: false,
					compact: false
				}
			}
		]
	},
	target: 'node',
	node: {
		__dirname: false,
		__filename: false
    }
}