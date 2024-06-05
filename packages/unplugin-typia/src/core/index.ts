import {
	type UnpluginFactory,
	type UnpluginInstance,
	createUnplugin,
} from 'unplugin';
import { createFilter as rollupCreateFilter } from '@rollup/pluginutils';

import { type Options, resolveOptions } from './options.js';
import { transformTypia } from './typia.js';

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

	return {
		name,
		enforce: options.enforce,

		transformInclude(id) {
			return filter(id);
		},

		async transform(_, id) {
			return await transformTypia(
				id,
				this,
				options,
			);
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
