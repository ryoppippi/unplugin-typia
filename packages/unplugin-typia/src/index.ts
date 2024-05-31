import unplugin from './plugin.js';
import type { Options } from './options.js';

export const babel = '';
export const { esbuild, webpack, rollup, rspack, vite } = unplugin;

export function next(nextConfig: Record<string, any> = {}, options: Options) {
	return {
		...nextConfig,
		webpack(config: Record<string, any>, webpackOptions: Record<string, any>) {
			config.plugins.unshift(webpack(options));

			if (typeof nextConfig.webpack === 'function') { return nextConfig.webpack(config, webpackOptions); }

			return config;
		},
	};
}

export default {
	vite,
	webpack,
	rollup,
	rspack,
	esbuild,
	next,
	babel,
	unplugin,
};
