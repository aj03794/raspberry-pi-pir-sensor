const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
	entry: './src/index',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1,
		}),
		new CleanWebpackPlugin(['./dist']),
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