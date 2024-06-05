/**
 * This entry file is for Next.js plugin.
 *
 * @module
 */

import webpack from './webpack.js';
import type { Options } from './core/options.js';

/**
 * unplugin-typia for next.
 *
 * @example
 * ```js
 * // next.config.mjs
 * import unTypiaNext from "unplugin-typia/next";
 *
 * export default unTypiaNext({
 *   // your next.js config @type {import('next').NextConfig}
 * })
 * ```
 */
function next(nextConfig: Record<string, any> = {}, options: Options): Record<string, any> {
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

export default next;
