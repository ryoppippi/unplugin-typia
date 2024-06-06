import { type Defu, defu } from 'defu';
import type { FilterPattern } from '@rollup/pluginutils';
import type { ITransformOptions } from 'typia/lib/transformers/ITransformOptions.js';

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
	 * The options for the typia transformer.
	 */
	typia?: ITransformOptions;

	/**
	 * The optiosn for cache.
	 * if `true`, it will enable cache with default path.
	 * if `false`, it will disable cache.
	 * if object, it will enable cache with custom path.
	 * @default { enable: true, base: '/tmp'}
	 */
	cache?: CacheOptions | boolean;

	/**
	 * Enable debug mode.
	 * @default true
	 */
	log?: boolean | 'verbose';
}

/**
 * Represents the resolved options for the plugin.
 */
export type OptionsResolved =
	& Omit<
    Required<Options>,
    'enforce' | 'cache' | 'typia'
  >
  & { enforce?: Options['enforce']; typia?: Options['typia']; cache: ResolvedCacheOptions };

/**
 * Resolves the options for the plugin.
 *
 * @param options - The options to resolve.
 * @returns The resolved options.
 */
export function resolveOptions(options: Options): OptionsResolved {
	return {
		include: options.include || [/\.[cm]?[jt]sx?$/],
		exclude: options.exclude || [/node_modules/],
		enforce: 'enforce' in options ? options.enforce : 'pre',
		typia: options.typia ?? {},
		log: options?.log ?? true,
		cache: resolvedCacheOptions(options.cache),
	};
}

/* Options for cache. */
export interface CacheOptions {
	/**
	 * Enable cache.
	 * @default true
	 */
	enable?: boolean;

	/**
	 * The base directory for cache.
	 * @default '/tmp'
	 */
	base?: string;
};

/** Default cache options */
const defaultCacheOptions = ({
	enable: true,
	base: '/tmp',
}) as const satisfies Required<CacheOptions>;

type DefaultCacheOptions = typeof defaultCacheOptions;

/** Resolved cache options */
export type ResolvedCacheOptions = Defu<CacheOptions, [DefaultCacheOptions]>;

/** Resolves cache options */
function resolvedCacheOptions(options: boolean | undefined | CacheOptions): ResolvedCacheOptions {
	return defu(
		typeof options === 'boolean' ? { enable: options } : options,
		defaultCacheOptions,
	);
}
