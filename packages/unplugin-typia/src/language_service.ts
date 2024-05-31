import { normalizePath } from 'vite';
import ts from 'typescript';

export class LanguageServiceHost implements ts.LanguageServiceHost {
	private snapshots = new Map<string, ts.IScriptSnapshot>();
	private versions = new Map<string, number>();
	private service: ts.LanguageService | undefined;
	private cwd: string;
	private fileNames: Set<string>;
	private parsedConfig: ts.ParsedCommandLine;

	constructor(
		parsedConfig: ts.ParsedCommandLine,
		cwd: string,
	) {
		this.parsedConfig = parsedConfig;
		this.fileNames = new Set(parsedConfig.fileNames);
		this.cwd = cwd;
		this.service = undefined;
	}

	public reset() {
		this.snapshots.clear();
		this.versions.clear();
	}

	public setLanguageService(service: ts.LanguageService) {
		this.service = service;
	}

	public setScriptSnapshot(fileName: string, source: string) {
		fileName = normalizePath(fileName);

		const snapshot = ts.ScriptSnapshot.fromString(source);
		this.snapshots.set(fileName, snapshot);
		this.versions.set(fileName, (this.versions.get(fileName) || 0) + 1);
		this.fileNames.add(fileName);

		return snapshot;
	}

	public getScriptSnapshot(fileName: string) {
		fileName = normalizePath(fileName);

		const snapshot = this.snapshots.get(fileName);
		if (snapshot != null) {
			return snapshot;
		}

		const source = ts.sys.readFile(fileName);
		if (source != null) {
			return this.setScriptSnapshot(fileName, source);
		}

		return undefined;
	}

	public getScriptFileNames() {
		return Array.from(this.fileNames.values());
	}

	public getScriptVersion(fileName: string) {
		fileName = normalizePath(fileName);

		return (this.versions.get(fileName) || 0).toString();
	}

	public getCompilationSettings = () => this.parsedConfig.options;
	public getTypeRootsVersion = () => 0;
	public getCurrentDirectory = () => this.cwd;

	public useCaseSensitiveFileNames = () => ts.sys.useCaseSensitiveFileNames;
	public getDefaultLibFileName = ts.getDefaultLibFilePath; // confusing naming: https://github.com/microsoft/TypeScript/issues/35318

	public readDirectory = ts.sys.readDirectory;
	public readFile = ts.sys.readFile;
	public fileExists = ts.sys.fileExists;
	public directoryExists = ts.sys.directoryExists;
	public getDirectories = ts.sys.getDirectories;
	public realpath = ts.sys.realpath!; // this exists in the default implementation: https://github.com/microsoft/TypeScript/blob/ab2523bbe0352d4486f67b73473d2143ad64d03d/src/compiler/sys.ts#L1288

	// eslint-disable-next-line no-console
	public trace = console.log;
}
