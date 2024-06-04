import {
	type UnpluginFactory,
	type UnpluginInstance,
	createUnplugin,
} from 'unplugin';
import { createFilter } from '@rollup/pluginutils';

import { type Options, resolveOptions } from './options.js';
import { transformTypia } from './typia.js';

const name = 'unplugin-typia' as const;

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
	transformTypia,
	unplugin,
};

export default unplugin;
