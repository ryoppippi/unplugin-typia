import unplugin from './plugin.js';
import type { Options } from './options.js';

const esbuild = unplugin.esbuild;
const webpack = unplugin.webpack;
const rollup = unplugin.rollup;
const rspack = unplugin.rspack;
const vite = unplugin.vite;

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
