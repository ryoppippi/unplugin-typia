import process from 'node:process';

import type { InlineConfig, ViteDevServer } from 'vite';
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
	 * The Vite dev server instance.
	 *
	 * If not provided and the bundler is Vite, it will reuse the current dev server.
	 * If not provided, it will try to use `viteConfig` to create one.
	 */
	viteServer?: ViteDevServer | false;

	/**
	 * The Vite configuration.
	 * Available when `viteServer` is not provided.
	 * @see https://vitejs.dev/config/
	 */
	viteConfig?: InlineConfig;

	/**
	 * Adjusts the plugin order (only works for Vite and Webpack).
	 * @default 'pre'
	 */
	enforce?: 'pre' | 'post' | undefined;

	/**
	 * The current working directory.
	 * @default process.cwd()
	 */
	cwd?: string;

	/**
	 * The options for the typia transformer.
	 */
	typia?: ITransformOptions;

	/**
	 * The optiosn for cache.
	 */
	cache?: CacheOptions;

	/**
	 * Log verbose information.
	 * @default false
	 */
	verbose?: boolean;
}

/**
 * Represents the resolved options for the plugin.
 */
export type OptionsResolved =
	& Omit<
    Required<Options>,
    'enforce' | 'viteServer' | 'cache' | 'typia'
  >
  & { enforce?: Options['enforce']; viteServer?: Options['viteServer']; typia?: Options['typia']; cache: ResolvedCacheOptions };

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
		viteServer: options.viteServer,
		viteConfig: options.viteConfig || {},
		enforce: 'enforce' in options ? options.enforce : 'pre',
		cwd: options.cwd ?? process.cwd(),
		typia: options.typia ?? {},
		verbose: options.verbose ?? false,
		cache: resolvedCacheOptions(options.cache),
	};
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
	 * @default '/tmp'
	 */
	base?: string;
};

export type ResolvedCacheOptions = Required<CacheOptions>;

export function resolvedCacheOptions(options: CacheOptions | undefined): ResolvedCacheOptions {
	return {
		enable: true,
		base: '/tmp',
		...options,
	};
}
