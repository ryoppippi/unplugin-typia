import ts from 'typescript';
import { readTSConfig } from 'pkg-types';
import MagicString from 'magic-string';
import type { UnpluginBuildContext, UnpluginContext } from 'unplugin';
import { transform as typiaTransform } from 'typia/lib/transform.js';

import type { ResolvedOptions } from './options.ts';

/** create a printer */
const printer = ts.createPrinter();

/** cache compilerOptions */
let compilerOptions: ts.CompilerOptions | undefined;

/** cache source files */
const sourceCache = new Map<string, ts.SourceFile>();

/**
 * Transform a TypeScript file with Typia.
 *
 * @param id - The file path.
 * @param source - The source code.
 * @param unpluginContext - The unplugin context.
 * @param options - The resolved options.
 * @returns The transformed code and source map.
 */
export async function transformTypia(
	id: string,
	source: string,
	/**
	 * **Use with caution.**
	 *
	 * This is an experimental feature and may be changed at any time.
	 */
	unpluginContext: UnpluginBuildContext & UnpluginContext,
	options: ResolvedOptions,
): Promise<{ code: string; map: any } | undefined> {
	/** Whether to enable cache */
	const cacheEnable = options.cache.enable;

	/** parse tsconfig compilerOptions */
	compilerOptions = await getTsCompilerOption(cacheEnable);

	const { program, tsSource } = await getProgramAndSource(id, source, compilerOptions, cacheEnable);

	const {
		diagnostics,
		transformed,
		file,
	} = transform(id, program, tsSource, options.typia);

	warnDiagnostic(diagnostics, transformed, unpluginContext);

	const generatedSource = printer.printFile(file);
	const magic = new MagicString(generatedSource);

	return {
		code: magic.toString(),
		map: magic.generateMap({
			source: id,
			file: `${id}.map`,
		}),
	};
}

/**
 * Read tsconfig.json and get compilerOptions.
 * @param cacheEnable - Whether to enable cache. @default true
 */
async function getTsCompilerOption(cacheEnable = true): Promise<ts.CompilerOptions> {
	const parseTsComilerOptions = async () => (({ ...(await readTSConfig())?.compilerOptions, moduleResolution: undefined }));

	/** parse tsconfig compilerOptions */
	if (cacheEnable) {
		compilerOptions ??= await parseTsComilerOptions();
	}
	else {
		compilerOptions = await parseTsComilerOptions();
	}

	if (compilerOptions == null) {
		throw new Error('No compilerOptions found in tsconfig.json');
	}
	return compilerOptions;
}

/**
 * Get program and source.
 *
 * @param id - The file path.
 * @param source - The source code.
 * @param compilerOptions - The compiler options.
 * @param cacheEnable - Whether to enable cache. @default true
 * @returns The program and source.
 */
async function getProgramAndSource(
	id: string,
	source: string,
	compilerOptions: ts.CompilerOptions,
	cacheEnable = true,
): Promise<{ program: ts.Program; tsSource: ts.SourceFile }> {
	const tsSource = ts.createSourceFile(
		id,
		source,
		ts.ScriptTarget.ES2020,
	);
	const host = ts.createCompilerHost(compilerOptions);

	host.getSourceFile = (fileName, languageVersion) => {
		if (fileName === id) {
			return tsSource;
		}

		if (cacheEnable) {
			const cache = sourceCache.get(fileName);
			if (cache != null) {
				return cache;
			}
		}

		const source = ts.sys.readFile(fileName);
		if (source == null) {
			return undefined;
		}
		const result = ts.createSourceFile(fileName, source, languageVersion);

		if (cacheEnable) {
			sourceCache.set(fileName, result);
		}

		return result;
	};
	const program = ts.createProgram([id], compilerOptions, host);

	return { program, tsSource };
}

/**
 * Transform a TypeScript file with Typia.
 *
 * @param id - The file path.
 * @param program - The program.
 * @param tsSource - The source file.
 * @param typiaOptions - The Typia options.
 * @returns The transformed code and source map.
 */
function transform(
	id: string,
	program: ts.Program,
	tsSource: ts.SourceFile,
	typiaOptions?: ResolvedOptions['typia'],
): {
	/** The diagnostics */
		diagnostics: ts.Diagnostic[];
		/** The transformed source files */
		transformed: ts.SourceFile[];
		/** The transformed source file we need */
		file: ts.SourceFile;
	} {
	const diagnostics: ts.Diagnostic[] = [];

	/** transform with Typia */
	const typiaTransformed = typiaTransform(program, typiaOptions, {
		addDiagnostic(diag) {
			return diagnostics.push(diag);
		},
	});

	/** transform with TypeScript */
	const transformationResult = ts.transform(
		tsSource,
		[typiaTransformed],
		{
			...program.getCompilerOptions(),
			sourceMap: true,
			inlineSources: true,
		},
	);

	const file = transformationResult.transformed.find(t => t.fileName === id);

	if (file == null) {
		throw new Error('No file found');
	}

	/** dispose transformation result */
	transformationResult.dispose();

	const { transformed } = transformationResult;

	return { diagnostics, transformed, file };
}

/** Warn diagnostics */
function warnDiagnostic(
	diagnostics: ts.Diagnostic[],
	transformed: ts.SourceFile[],
	unpluginContext: UnpluginBuildContext & UnpluginContext,
) {
	for (const diagnostic of diagnostics) {
		unpluginContext.warn(
			transformed.map(e => e.fileName).join(','),
		);
		unpluginContext.warn(JSON.stringify(diagnostic.messageText));
	}
}
