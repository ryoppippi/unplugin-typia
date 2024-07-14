import { type LogType, consola } from 'consola';

export function log(
	type: LogType,
	...args: string[]
) {
	consola[type](`[unplugin-typia]`, ...args);
}

export function isBun() {
	return globalThis.Bun != null;
}

/**
 * Dynamic import a module.
 * Because JSR fails to resolve dynamic import, we have to use this workaround. (see: https://github.com/ryoppippi/unplugin-typia/issues/198)
 */
export async function dynamicImport<T extends string>(specifier: T): Promise<unknown> {
	return import(specifier);
}
