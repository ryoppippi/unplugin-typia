import * as ts from 'typescript';
import * as U from '@core/unknownutil';
import MagicString from 'magic-string';
import type { UnpluginBuildContext, UnpluginContext } from 'unplugin';
import { transform } from 'typia/lib/transform.js';

const printer = ts.createPrinter();

export function transformTypia(
	id: string,
	service: ts.LanguageService,
	/**
	 * **Use with caution.**
	 *
	 * This is an experimental feature and may be changed at any time.
	 */
	unpluginContext: UnpluginBuildContext & UnpluginContext,
): { code: string; map: any } | undefined {
	const program = service.getProgram();

	const tsSource = program?.getSourceFile(id);

	if (U.isNullish(tsSource)) {
		throw new Error('No source found');
	}

	if (U.isNullish(program)) {
		throw new Error('No program found');
	}

	const diagnostics: ts.Diagnostic[] = [];

	const typiaTransformed = transform(program, {}, {
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

	if (U.isNullish(file)) {
		throw new Error('No file found');
	}

	const generatedSource = printer.printFile(file);
	for (const diagnostic of diagnostics) {
		unpluginContext.warn(transformed.transformed.map(e => e.fileName).join(','));
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
