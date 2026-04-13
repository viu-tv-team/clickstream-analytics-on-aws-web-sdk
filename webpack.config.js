// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
	entry: { 'clickstream-web.min': './lib-esm/index.js' },
	mode: 'production',
	output: {
		filename: '[name].js',
		path: __dirname + '/dist',
		library: {
			type: 'umd',
		},
		umdNamedDefine: true,
		globalObject: 'this',
	},
	devtool: 'source-map',
	resolve: {
		extensions: ['.js', '.json'],
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				// Transpile JS files and most dependencies, except already precompiled ones
				// such as core-js, regenerator-runtime, and @babel/runtime.
				exclude: [
					/node_modules[\\/](core-js|regenerator-runtime|@babel[\\/]runtime)/,
				],
				use: {
					loader: 'babel-loader',
					options: {
						configFile: './babel.config.js',
						// Disable Babel cache to avoid stale transforms
						cacheDirectory: false,
					},
				},
			},
		],
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				extractComments: false,
				terserOptions: {
					// Parse and output ES5 code
					ecma: 5,
					parse: {
						ecma: 5,
					},
					compress: {
						ecma: 5,
						drop_console: false,
						drop_debugger: true,
						pure_funcs: null,
					},
					output: {
						ecma: 5,
						// Compact ES5 output without comments or trailing commas
						beautify: false,
						comments: false,
						semicolons: true,
						preserve_annotations: false,
					},
					// Do not preserve ES6+ class or function names
					keep_classnames: false,
					keep_fnames: false,
				},
			}),
		],
	},
};
