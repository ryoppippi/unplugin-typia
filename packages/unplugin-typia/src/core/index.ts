import {
	type UnpluginFactory,
	type UnpluginInstance,
	createUnplugin,
} from 'unplugin';
import { createFilter as rollupCreateFilter } from '@rollup/pluginutils';
import MagicString from 'magic-string';

import type { ResolvedOptions } from './options.ts';
import type { Options } from './options.js';
import { resolveOptions } from './options.js';
import { transformTypia } from './typia.js';
import { log } from './utils.js';
import type { Data, ID, Source, UnContext } from './types.js';
import { wrap } from './types.js';
import { Cache } from './cache.js';

const name = `unplugin-typia`;

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

	const { cache: cacheOptions, log: logOption } = options;

	const showLog = logOption === 'verbose' && cacheOptions;

	/**
	 * Generate code with source map.
	 */
	function generateCodeWithMap({ source, code, id }: { source: Source; code: Data; id: ID }) {
		/** generate Magic string */
		const s = new MagicString(source);
		s.overwrite(0, source.length, code);

		return {
			code: s.toString(),
			map: s.generateMap({
				source: id,
				file: `${id}.map`,
			}),
		};
	}

	async function transformCodeWithTypiaTransform(
		{ id, source, ctx, options }:
		{ id: ID; source: Source; ctx: UnContext; options: ResolvedOptions },
	): Promise<{ code?: Data }> {
		/** get cache */
		using cache = cacheOptions ? new Cache(id, source) : undefined;
		let code = cache?.data;

		if (showLog) {
			if (code != null) {
				log('success', `Cache hit: ${id}`);
			}
			else {
				log('warn', `Cache miss: ${id}`);
			}
		}

		/** transform if cache not exists */
		if (code == null) {
			code = await transformTypia(id, source, ctx, options);

			if (showLog) {
				if (code != null) {
					log('success', `Transformed: ${id}`);
				}
				else {
					log('error', `Transform is null: ${id}`);
				}
			}

			/** save cache */
			if (cache != null) {
				cache.data = code;
			}

			if (showLog) {
				log('success', `Cache set: ${id}`);
			}
		}

		return { code };
	}

	return {
		name,
		enforce: options.enforce,

		buildStart() {
			if (logOption !== false) {
				log(
					'box',
					cacheOptions ? `Cache enabled` : `Cache disabled`,
				);
			}
		},

		transformInclude(id) {
			return filter(id);
		},

		async transform(_source, _id) {
			const source = wrap<Source>(_source);
			const id = wrap<ID>(_id);

			const { code } = await transformCodeWithTypiaTransform(
				{ id, source, ctx: this, options },
			);

			if (code == null) {
				return;
			}

			return generateCodeWithMap({ source, code, id });
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

export type { Options };
export {
	resolveOptions,
	createFilter,
	transformTypia,
	unplugin,
};

export default unplugin;
