const baseConfig = require('gnoll/config/webpack')
const babelConfig = require('gnoll/config/babel')
const stylesConfig = require('gnoll-styles')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(baseConfig, stylesConfig, {
	entry: {
		main: ['./src/index.js'],
		attachment: ['./src/examples/attachment.js'],
		layers: ['./src/examples/layers.js']
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			chunks: ['runtime', 'vendor', 'main'],
			template: './src/index.html'
		}),
		new HtmlWebpackPlugin({
			filename: 'examples/attachment.html',
			chunks: ['runtime', 'vendor', 'attachment'],
			template: './src/index.html'
		}),
		new HtmlWebpackPlugin({
			filename: 'examples/layers.html',
			chunks: ['runtime', 'vendor', 'layers'],
			template: './src/index.html'
		})
	],
	module: {
		rules: [
			{
				test: /\.md$/,
				use: [
					{ loader: 'babel-loader', options: babelConfig },
					{
						loader: 'minimark-loader',
						options: require('minibook/minimark-preset')
					}
				]
			}
		]
	},
	serve: {
		port: 1337,
		host: '0.0.0.0'
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				// all modules that are shared by at least 3 entry chunks
				// should be extracted to the 'vendor' chunk
				vendor: {
					chunks: 'initial',
					name: 'vendor',
					minChunks: 3,
					test: /[\\/]node_modules[\\/]/
				}
			}
		},
		// create single 'runtime' chunk instead of per-entry (runtime~main, ...)
		runtimeChunk: 'single'
	},
	performance: {
		hints: false
	}
})
