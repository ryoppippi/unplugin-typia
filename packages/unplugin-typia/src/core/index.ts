import {
	type UnpluginFactory,
	type UnpluginInstance,
	createUnplugin,
} from 'unplugin';
import { createFilter as rollupCreateFilter } from '@rollup/pluginutils';
import { consola } from 'consola';

import { type Options, resolveOptions } from './options.js';
import { transformTypia } from './typia.js';
import { getCache, setCache } from './cache.js';

const name = 'unplugin-typia' as const;

/**
 * Create a filter function from the given include and exclude patterns.
 */
function createFilter(
	include: Options['include'],
	exclude: Options['exclude'],
): ReturnType<typeof rollupCreateFilter> {
	return rollupCreateFilter(include, exclude);
}

/**
 * The main unplugin instance.
 */
const unpluginFactory: UnpluginFactory<
  Options | undefined,
  false
> = (rawOptions = {}) => {
	const options = resolveOptions(rawOptions);
	const filter = createFilter(options.include, options.exclude);

	const { cache: cacheOptions, log } = options;

	if (log) {
		consola.box(
		`[unplugin-typia]`,
		cacheOptions.enable ? `Cache enabled` : `Cache disabled`,
		);
	}

	const showLog = log === 'verbose' && cacheOptions.enable;

	return {
		name,
		enforce: options.enforce,

		transformInclude(id) {
			return filter(id);
		},

		async transform(source, id) {
			/** get cache */
			const cache = await getCache(id, source, cacheOptions);

			if (showLog) {
				if (cache != null) {
					consola.success(`[unplugin-typia] Cache hit: ${id}`);
				}
				else {
					consola.warn(`[unplugin-typia] Cache miss: ${id}`);
				}
			}

			/** return cache if exists */
			if (cache != null) {
				return cache;
			}

			/** transform if cache not exists */
			const generated = await transformTypia(id, source, this, options);

			if (showLog) {
				if (generated != null) {
					consola.warn(`[unplugin-typia] Transformed: ${id}`);
				}
				else {
					consola.error(`[unplugin-typia] Transform is null: ${id}`);
				}
			}

			/** save cache */
			await setCache(id, source, generated, cacheOptions);

			if (showLog) {
				consola.success(`[unplugin-typia] Cache set: ${id}`);
			}

			return generated;
		},
	};
};

/**
 * This is the unplugin function that is exported.
 *
 * @module
 */
const unplugin: UnpluginInstance<Options | undefined, false>
/* #__PURE__ */ = createUnplugin(unpluginFactory);

export {
	resolveOptions,
	createFilter,
	transformTypia,
	unplugin,
};

export default unplugin;
