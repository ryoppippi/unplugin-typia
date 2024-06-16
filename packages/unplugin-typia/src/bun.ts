/**
 * This entry file is for bun plugin.
 *
 * @module
 */

import type { BunPlugin } from 'bun';
import type { UnpluginContextMeta } from 'unplugin';
import { hasCJSSyntax } from 'mlly';
import { resolveOptions, unplugin } from './api.js';
import { type Options, type ResolvedOptions, defaultOptions } from './core/options.js';
import { isBun } from './core/utils.js';

if (isBun()) {
	throw new Error('You must use this plugin with bun');
}

/**
 * Options for the bun plugin.
 */
export interface BunOptions extends Options {

	/**
	 * Whether to resolve the typia mjs path absolutely.
	 *
	 * @default true
	 */
	resolveAbsoluteTypiaPath?: boolean;
}

type ResolvedBunOptions = ResolvedOptions & Required<Pick<BunOptions, 'resolveAbsoluteTypiaPath'>>;

function resolveBunOptions(options: BunOptions) {
	const resolvedOptions = resolveOptions(options);

	return {
		...resolvedOptions,
		resolveAbsoluteTypiaPath: options.resolveAbsoluteTypiaPath ?? true,
	} satisfies ResolvedBunOptions;
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
	options?: BunOptions,
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
		async setup(build) {
			const resolvedOptions = resolveBunOptions(options ?? {});
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

				/* TODO: delete after [this issue](https://github.com/oven-sh/bun/issues/11783) is resolved. */
				if (path.includes('node_modules/typia/lib/index.js') && hasCJSSyntax(source)) {
					const mjsFile = Bun.file(path.replace(/\.js$/, '.mjs'));

					if (await mjsFile.exists()) {
						return { contents: await mjsFile.text() };
					}
				}

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
