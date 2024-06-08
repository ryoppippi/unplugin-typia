/**
 * This entry file is for bun plugin.
 *
 * @module
 */

import type { BunPlugin } from 'bun';
import type { UnpluginContextMeta } from 'unplugin';
import { type Options, resolveOptions, unplugin } from './api.js';
import { defaultOptions } from './core/options.js';

if (globalThis.Bun == null) {
	throw new Error('You must use this plugin with bun');
}

/**
 * bun plugin
 *
 * some typia functions does not works because of bun/typia internal implementation. see the [issse](https://github.com/ryoppippi/unplugin-typia/issues/44)
 * @experimental
 * also check out hte [Bun.build docc](https://bun.sh/docs/bundler)
 *
 * @example
 * ```ts
 * // preload.ts
 * import { plugin } from 'bun';
 * import UnpluginTypia from 'unplugin-typia/bun'
 *
 * plugin(UnpluginTypia({ /* your options *\/}))
 * ```
 * ```toml
 * # bunfig.toml
 * preload = ["./preload.ts"]
 *
 * [test]
 * preload = ["./preload.ts"]
 * ```
 *
 * @example
 * ```ts
 * // build.ts
 *
 * import UnpluginTypia from 'unplugin-typia/bun'
 *
 * Bun.build({
 *   entrypoints: ['./index.ts'],
 *   outdir: './out',
 *   plugins: [
 *     UnpluginTypia({ /* your options *\/})
 *  ]
 * })
 */
function bunTypiaPlugin(
	options?: Options,
): BunPlugin {
	const unpluginRaw = unplugin.raw(
		options,
		{} as UnpluginContextMeta,
	);

	const { transform } = unpluginRaw;

	if (transform == null) {
		throw new Error('transform is not defined');
	}

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

				// @ts-expect-error type of this function is not correct
				const result = await transform(source, path);

				switch (true) {
					case result == null:
						return { contents: source };
					case typeof result === 'string':
						return { contents: source };
					default:
						return { contents: result.code };
				}
			});
		},
	}) as const satisfies BunPlugin;

	return bunPlugin;
}

export default bunTypiaPlugin;
