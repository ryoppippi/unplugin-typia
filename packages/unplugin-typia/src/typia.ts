import * as ts from 'typescript';
import * as U from '@core/unknownutil';
import MagicString from 'magic-string';
import { transform } from 'typia/lib/transform.js';

const printer = ts.createPrinter();

export function transformTypia(
	id: string,
	service: ts.LanguageService,
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
		console.warn(transformed.transformed.map(e => e.fileName).join(','));
		console.warn(JSON.stringify(diagnostic.messageText));
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
