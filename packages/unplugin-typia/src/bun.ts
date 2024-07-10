/**
 * This entry file is for bun plugin.
 *
 * @module
 */

import type { BunPlugin } from 'bun';
import type { UnpluginContextMeta, UnpluginOptions } from 'unplugin';
import { resolveOptions, unplugin } from './api.js';
import { type Options, defaultOptions } from './core/options.js';
import { isBun } from './core/utils.js';
import { type ID, type Source, wrap } from './core/types.js';

if (!isBun()) {
	throw new Error('You must use this plugin with bun');
}

/** typia transform function with tagged types */
async function taggedTransform(
	id: ID,
	source: Source,
	unpluginRaw: UnpluginOptions,
): Promise<undefined | Source> {
	const { transform } = unpluginRaw;

	if (transform == null) {
		throw new Error('transform is not defined');
	}

	// @ts-expect-error type of this function is not correct
	const _transform = (source: Source, id: ID) => transform(source, id);

	const result = await _transform(source, id);

	switch (true) {
		case result == null:
			return undefined;
		case typeof result === 'string':
			return undefined;
		case typeof result === 'object':
			return wrap<Source>(result.code);
		default:
			return result satisfies never;
	}
}

/**
 * bun plugin
 *
 * Also, check the [Plugins – Runtime | Bun Docs](https://bun.sh/docs/runtime/plugins) & [Plugins – Bundler | Bun Docs](https://bun.sh/docs/bundler/plugins) for more details.
 *
 * @example
 * ```ts
 * // build.ts
 *
 * import UnpluginTypia from '@ryoppippi/unplugin-typia/bun'
 *
 * Bun.build({
 *   entrypoints: ['./index.ts'],
 *   outdir: './out',
 *   plugins: [
 *     UnpluginTypia({ /* your options *\/})
 *  ]
 * })
 * ```
 *
 * ```sh
 * $ node build.ts
 * ```
 *
 * @example
 *
 * ```ts
 * // preload.ts
 * import { plugin } from 'bun';
 * import UnpluginTypia from '@ryoppippi/unplugin-typia/bun'
 *
 * plugin(UnpluginTypia({ /* your options *\/}))
 * ```
 *
 * ```toml
 * # bunfig.toml
 * preload = ["./preload.ts"]
 *
 * [test]
 * preload = ["./preload.ts"]
 * ```
 *
 * ```sh
 * $ bun run ./index.ts
 * ```
 *
 * When you run your scripts on Bun.runtime, You cannot use named import for typia value in the source code. Check out the README.md.
 */
function bunTypiaPlugin(
	options?: Options,
): BunPlugin {
	const bunPlugin = ({
		name: 'unplugin-typia',
		async setup(build) {
			const resolvedOptions = resolveOptions(options ?? {});
			const { include } = resolvedOptions;

			const unpluginRaw = unplugin.raw(options, {} as UnpluginContextMeta);

			const filter = include instanceof RegExp
				? include
				: typeof include === 'string'
					? new RegExp(include)
					: Array.isArray(include) && include[0] instanceof RegExp
						? include[0]
						: defaultOptions.include[0];

			if (unpluginRaw?.buildStart != null) {
				// @ts-expect-error context type is invalid
				await unpluginRaw?.buildStart();
			}

			build.onLoad({ filter }, async (args) => {
				const id = wrap<ID>(args.path);

				const source = wrap<Source>(await Bun.file(id).text());

				const code = await taggedTransform(
					id,
					source,
					unpluginRaw,
				);

				return { contents: code ?? source };
			});
		},
	}) as const satisfies BunPlugin;

	return bunPlugin;
}

export default bunTypiaPlugin;
