/**
 * This entry file is for bun plugin.
 *
 * @module
 */

import type { BunPlugin } from 'bun';
import { type Options, resolveOptions, transformTypia } from './api.js';
import { defaultOptions } from './core/options.js';

if (globalThis.Bun == null) {
	throw new Error('You must use this plugin with bun');
}

/**
 * bun plugin
 *
 * some typia functions does not works because of bun/typia internal implementation. see the [issse](https://github.com/ryoppippi/unplugin-typia/issues/44)
 * @experimental
 * @example
 * ```ts
 * // preload.ts
 * import { plugin } from 'bun';
 * import UnpluginTypia from 'unplugin-typia/bun'
 *
 * plugin(UnpluginTypia({ /* your options *\/}))
 * ```
 * ```toml
 * // bunfig.toml
 * preload = ["./preload.ts"]
 *
 * [test]
 * preload = ["./preload.ts"]
 * ```
 */
function bunTypiaPlugin(
	options?: Options,
): BunPlugin {
	const bunPlugin = ({
		name: 'unplugin-typia',
		setup(build) {
			const resolvedOptions = resolveOptions(options ?? {});
			const { include } = resolvedOptions;
			const filter = include instanceof RegExp
				? include
				: typeof include === 'string'
					? new RegExp(include)
					: Array.isArray(include) && include[0] instanceof RegExp
						? include[0]
						: defaultOptions.include[0];

			build.onLoad({ filter }, async (args) => {
				const { path } = args;

				const source = await Bun.file(path).text();

				const res = await transformTypia(
					path,
					source,
					{ warn: console.warn } as Parameters<typeof transformTypia>[2],
					resolvedOptions,
				);

				return {

					contents: res?.code ?? source,
				};
			});
		},
	}) as const satisfies BunPlugin;

	return bunPlugin;
}

export default bunTypiaPlugin;
