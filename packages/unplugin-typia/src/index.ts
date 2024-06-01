import unplugin from './plugin.js';
import type { Options } from './options.js';

/**
 * unplugin-typia for esbuild.
 * @module
 */
const esbuild = unplugin.esbuild;

/**
 * unplugin-typia for webpack.
 * @module
 */
const webpack = unplugin.webpack;

/**
 * unplugin-typia for rollup.
 * @module
 */
const rollup = unplugin.rollup;

/**
 * unplugin-typia for rspack.
 * @module
 */
const rspack = unplugin.rspack;

/**
 * unplugin-typia for vite.
 * @module
 */
const vite = unplugin.vite;

/**
 * unplugin-typia for next.
 * @function
 */
export function next(nextConfig: Record<string, any> = {}, options: Options): Record<string, any> {
	return {
		...nextConfig,
		webpack(config: Record<string, any>, webpackOptions: Record<string, any>) {
			config.plugins.unshift(webpack(options));

			if (typeof nextConfig.webpack === 'function') {
				return nextConfig.webpack(config, webpackOptions);
			}

			return config;
		},
	};
}

export {
	vite,
	webpack,
	rollup,
	rspack,
	esbuild,
	unplugin,
};

export default {
	vite,
	webpack,
	rollup,
	rspack,
	esbuild,
	next,
	unplugin,
};
