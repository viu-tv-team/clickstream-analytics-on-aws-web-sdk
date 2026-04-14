// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const TerserPlugin = require('terser-webpack-plugin');
const config = require('./webpack.config.js');

const entry = { 'clickstream-web': './lib-esm/index.js' };
module.exports = Object.assign(config, {
	entry,
	mode: 'development',
	optimization: {
		// Force using minimizer even in development mode
		minimize: true,
		minimizer: [
			new TerserPlugin({
				extractComments: false,
				terserOptions: {
					// Parse and output ES5 to support legacy browsers
					ecma: 5,
					parse: {
						ecma: 5,
					},
					compress: {
						ecma: 5,
						// In development keep code readable, mainly do syntax transforms
						passes: 1,
						drop_console: false,
						drop_debugger: false,
					},
					output: {
						ecma: 5,
						// Pretty ES5 output with comments for easier debugging
						beautify: true,
						comments: true,
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
});
