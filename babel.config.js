// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint-env node */

module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				useBuiltIns: false,
				// Keep ES modules so that webpack can handle the module system
				modules: false,
				// Always transform ES2015+ syntax to ES5 to support legacy browsers;
				// forceAllTransforms applies all transforms even if targets support them.
				forceAllTransforms: true,
				// Target IE11 explicitly so that all modern syntax is down-leveled.
				targets: {
					ie: '11',
				},
			},
		],
	],
};

