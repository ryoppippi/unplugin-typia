import ts from 'typescript';
import { type TSConfig, readTSConfig } from 'pkg-types';
import MagicString from 'magic-string';
import type { UnpluginBuildContext, UnpluginContext } from 'unplugin';
import { transform } from 'typia/lib/transform.js';

import { LanguageServiceHost } from './language_service.js';
import type { OptionsResolved } from './options.ts';

const printer = ts.createPrinter();

let tsconfig: TSConfig | undefined;

/**
 * Transform a TypeScript file with Typia.
 *
 * @param id - The file path.
 * @param unpluginContext - The unplugin context.
 * @param options - The resolved options.
 * @returns The transformed code and source map.
 */
export async function transformTypia(
	id: string,
	/**
	 * **Use with caution.**
	 *
	 * This is an experimental feature and may be changed at any time.
	 */
	unpluginContext: UnpluginBuildContext & UnpluginContext,
	options: OptionsResolved,
): Promise<{ code: string; map: any } | undefined> {
	/** define serviceHost */
	tsconfig = tsconfig ?? await readTSConfig();
	if (tsconfig.compilerOptions == null) {
		throw new Error('No compilerOptions found in tsconfig.json');
	}
	const serviceHost = new LanguageServiceHost({
		...tsconfig,
		fileNames: [id],
		options: { ...tsconfig.compilerOptions, moduleResolution: undefined },
		errors: [],
	}, options.cwd);

	const documentRegistry = ts.createDocumentRegistry();
	const service = ts.createLanguageService(serviceHost, documentRegistry);
	serviceHost.setLanguageService(service);

	const program = service.getProgram();

	const tsSource = program?.getSourceFile(id);

	if (tsSource == null) {
		throw new Error('No source found');
	}

	if (program == null) {
		throw new Error('No program found');
	}

	const diagnostics: ts.Diagnostic[] = [];

	const typiaTransformed = transform(program, options.typia, {
		addDiagnostic(diag) {
			return diagnostics.push(diag);
		},
	});
	const transformed = ts.transform(
		tsSource,
		[typiaTransformed],
		{
			...program.getCompilerOptions(),
			sourceMap: true,
			inlineSources: true,
		},
	);

	const file = transformed.transformed.find(t => t.fileName === id);

	if (file == null) {
		throw new Error('No file found');
	}

	const generatedSource = printer.printFile(file);
	for (const diagnostic of diagnostics) {
		unpluginContext.warn(
			transformed.transformed.map(e => e.fileName).join(','),
		);
		unpluginContext.warn(JSON.stringify(diagnostic.messageText));
	}

	const magic = new MagicString(generatedSource);

	transformed.dispose();

	return {
		code: magic.toString(),
		map: magic.generateMap({
			source: id,
			file: `${id}.map`,
		}),
	};
}
