import {
	type UnpluginFactory,
	type UnpluginInstance,
	createUnplugin,
} from 'unplugin';
import { createFilter as rollupCreateFilter } from '@rollup/pluginutils';
import { consola } from 'consola';
import { MagicString } from 'magic-string-ast';

import type { CacheOptions, Options } from './options.js';
import { resolveOptions } from './options.js';
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
			let code = await getCache(id, source, cacheOptions);

			if (showLog) {
				if (code != null) {
					consola.success(`[unplugin-typia] Cache hit: ${id}`);
				}
				else {
					consola.warn(`[unplugin-typia] Cache miss: ${id}`);
				}
			}

			/** transform if cache not exists */
			if (code == null) {
				code = await transformTypia(id, source, this, options);

				if (showLog) {
					if (code != null) {
						consola.warn(`[unplugin-typia] Transformed: ${id}`);
					}
					else {
						consola.error(`[unplugin-typia] Transform is null: ${id}`);
					}
				}

				/** save cache */
				await setCache(id, source, code, cacheOptions);

				if (showLog) {
					consola.success(`[unplugin-typia] Cache set: ${id}`);
				}
			}

			/** create source map */
			const magic = new MagicString(code);
			const map = magic.generateMap({
				source: id,
				file: `${id}.map`,
			});

			return { code, map };
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

export type { Options, CacheOptions };
export {
	resolveOptions,
	createFilter,
	transformTypia,
	unplugin,
};

export default unplugin;
