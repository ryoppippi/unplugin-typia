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
