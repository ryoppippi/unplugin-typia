/**
 * This entry file is for bun plugin.
 *
 * @module
 */

import type { BunPlugin } from 'bun';
import type { UnpluginContextMeta } from 'unplugin';
import { readPackageJSON, resolvePackageJSON } from 'pkg-types';
import { babelParse, getLang, isDts, resolveString } from 'ast-kit';
import { MagicStringAST } from 'magic-string-ast';
import { dirname, join } from 'pathe';
import { type Options, resolveOptions, unplugin } from './api.js';
import { defaultOptions } from './core/options.js';

if (globalThis.Bun == null) {
	throw new Error('You must use this plugin with bun');
}

type QuotedString = `"${string}"` | `'${string}'`;
function isQuotedString(input: string): input is QuotedString {
	const quotedRegex = /^(["']).*\1$/;
	return quotedRegex.test(input);
}

/* cache typia mjs path */
let typiaMjsPath: string | undefined;
/**
 * Read typia mjs path.
 * TODO: delete after [this issue](https://github.com/oven-sh/bun/issues/11783) is resolved.
 */
async function resolveTypiaPath(id: string, code: string) {
	if (isDts(id)) {
		return code;
	}

	if (typiaMjsPath == null) {
		const typiaPackageJson = await readPackageJSON('typia');
		const typiaDirName = dirname(await resolvePackageJSON('typia'));
		typiaMjsPath = join(typiaDirName, typiaPackageJson?.module ?? '');
	}

	const ms = new MagicStringAST(code);

	const program = babelParse(code, getLang(id), {});
	for (const node of program.body) {
		if (node.type !== 'ImportDeclaration' || node.importKind === 'type') {
			continue;
			;
		}
		const moduleNameQuoted = resolveString(ms.sliceNode(node.source));
		if (!isQuotedString(moduleNameQuoted)) {
			continue;
		}

		const moduleName = moduleNameQuoted.slice(1, -1);

		if (moduleName === 'typia') {
			const replaceModuleString = moduleNameQuoted.replace('typia', typiaMjsPath);
			ms.overwriteNode(node.source, replaceModuleString);
		}
	}

	const r = ms.toString();

	return r;
}

/**
 * bun plugin
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
 *     UnpluginTypia(/* your options */)
 *  ]
 * })
 * ```
 *
 * ```sh
 * $ node build.ts
 * ```
 *
 * Check the [Plugins – Bundler | Bun Docs](https://bun.sh/docs/bundler/plugins) for more details.
 *
 * @example
 * @experimental
 * some typia functions does not works because of bun/typia/randexp internal implementation. see the [issse](https://github.com/ryoppippi/unplugin-typia/issues/44)
 *
 * ```ts
 * // preload.ts
 * import { plugin } from 'bun';
 * import UnpluginTypia from '@ryoppippi/unplugin-typia/bun'
 *
 * plugin(UnpluginTypia({ /* your options */ }))
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
 * Check the [Plugins – Runtime | Bun Docs](https://bun.sh/docs/runtime/plugins) for more details.
 *
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
		async setup(build) {
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
						return { contents: await resolveTypiaPath(path, result.code) };
				}
			});
		},
	}) as const satisfies BunPlugin;

	return bunPlugin;
}

export default bunTypiaPlugin;
