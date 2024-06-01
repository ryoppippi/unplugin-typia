import process from 'node:process';
import { type UnpluginFactory, createUnplugin } from 'unplugin';
import { readTSConfig } from 'pkg-types';
import { createFilter } from '@rollup/pluginutils';
import * as U from '@core/unknownutil';
import * as ts from 'typescript';
import { type Options, resolveOptions } from './options.js';
import { LanguageServiceHost } from './language_service.js';
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
			const tsconfig = await readTSConfig();

			if (U.isNullish(tsconfig.compilerOptions)) {
				throw new Error('No compilerOptions found in tsconfig.json');
			}
			const serviceHost = new LanguageServiceHost({
				...tsconfig,
				fileNames: [id],
				options: { ...tsconfig.compilerOptions, moduleResolution: undefined },
				errors: [],
			}, options.cwd ?? process.cwd());

			const documentRegistry = ts.createDocumentRegistry();
			const service = ts.createLanguageService(serviceHost, documentRegistry);
			serviceHost.setLanguageService(service);

			return transformTypia(
				id,
				service,
				this,
			);
		},
	};
};

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
