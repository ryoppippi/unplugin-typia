import type { OverrideProperties, RequiredDeep } from 'type-fest';
import { createDefu } from 'defu';
import type { FilterPattern } from '@rollup/pluginutils';
import type { ITransformOptions } from 'typia/lib/transformers/ITransformOptions.js';
import { getCacheDir } from './cache.js';
import { type FilePath, wrap } from './types.js';

/**
 * Represents the options for the plugin.
 */
export interface Options {
	/**
	 * The patterns of files to include.
	 * @default [/\.[cm]?[jt]sx?$/]
	 */
	include?: FilterPattern;

	/**
	 * The patterns of files to exclude.
	 * @default [/node_modules/]
	 */
	exclude?: FilterPattern;

	/**
	 * Adjusts the plugin order (only works for Vite and Webpack).
	 * @default 'pre'
	 */
	enforce?: 'pre' | 'post' | undefined;

	/**
	 * The path to the tsconfig file.
	 * If not specified, the plugin will try to find it automatically.
	 * @default undefined
	 */
	tsconfig?: string;

	/**
	 * The options for the typia transformer.
	 */
	typia?: ITransformOptions;

	/**
	 * The optiosn for cache.
	 * if `true`, it will enable cache with and will use node_modules/.cache/unplugin_typia (if exists) or {TMP_DIR}/unplugin_typia
	 * if `false`, it will disable cache.
	 * if object, it will enable cache with custom path.
	 * @default { enable: true, base: TMP_DIR }
	 */
	cache?: CacheOptions | true | false;

	/**
	 * Enable debug mode.
	 * @default true
	 */
	log?: boolean | 'verbose';
}

/**
 * Options for cache.
 */
export interface CacheOptions {
	/**
	 * Enable cache.
	 * @default true
	 */
	enable?: boolean;

	/**
	 * The base directory for cache.
	 * @default  will use node_modules/.cache/unplugin_typia (if exists) or {TMP_DIR}/unplugin_typia
	 */
	base?: string;
};

export type ResolvedOptions
	= OverrideProperties<
		RequiredDeep<Options>,
		{
			typia: Options['typia'];
			tsconfig: Options['tsconfig'];
			cache: RequiredDeep<OverrideProperties<CacheOptions, { base: FilePath } >>;
		}
	>;

/** Default options */
export const defaultOptions = ({
	include: [/\.[cm]?[jt]sx?$/],
	exclude: [/node_modules/],
	enforce: 'pre',
	typia: { },
	cache: { enable: true, base: getCacheDir() },
	log: true,
	tsconfig: undefined,
}) as const satisfies ResolvedOptions;

/** Create custom defu instance */
const defu = createDefu((obj, key, value) => {
	/** replace array instead of concat */
	if (Array.isArray(obj[key])) {
		obj[key] = value;
		return true;
	}
});

/**
 * Resolves the options for the plugin.
 *
 * @param options - The options to resolve.
 * @returns The resolved options.
 */
export function resolveOptions(options: Options): ResolvedOptions {
	const { cache } = options;

	return defu(
		{
			...options,
			cache:
				typeof cache === 'boolean'
					? { enable: cache }
					: { ...cache, base: cache?.base != null ? wrap<FilePath>(cache.base) : undefined },
		},
		defaultOptions,
	);
}
