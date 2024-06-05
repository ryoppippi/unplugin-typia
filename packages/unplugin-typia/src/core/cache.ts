import { type Storage, createStorage } from 'unstorage';
import fsLiteDriver from 'unstorage/drivers/fs-lite';
import { isEqual, sha256 } from 'ohash';
import type { transformTypia } from './typia.js';
import type { CacheOptions, ResolvedCacheOptions } from './options.js';

type Data = Awaited<ReturnType<typeof transformTypia>>;

let globalStorage: Storage | undefined;
let globalOption: CacheOptions | undefined;

/**
 * Get storage
 * @param option - The cache options.
 */
function getStorage(option: ResolvedCacheOptions): Storage {
	if (!isEqual(option, globalOption)) {
		globalStorage = undefined;
		globalOption = undefined;
	}

	globalOption = globalOption ?? option;

	globalStorage = globalStorage ?? createStorage({
		driver: fsLiteDriver({ base: option.base }),
	});

	if (globalStorage == null) {
		throw new Error('Storage is not initialized');
	}

	return globalStorage;
}

/**
 * Get cache
 * @param id
 * @param source
 * @param option
 */
export async function getCache(
	id: string,
	source: string,
	option: ResolvedCacheOptions,
): Promise<Data | null> {
	if (!option.enable) {
		return undefined;
	}
	const storage = getStorage(option);
	const key = sha256(`${id}:${source}`);
	const data = await storage.getItem<NonNullable<Data>>(key);

	return data;
}

/**
 * Set cache
 * @param id
 * @param source
 * @param data
 * @param option
 */
export async function setCache(
	id: string,
	source: string,
	data: Data,
	option: ResolvedCacheOptions,
): Promise<void> {
	if (!option.enable) {
		return;
	}
	const storage = getStorage(option);
	const key = sha256(`${id}:${source}`);
	await storage.setItem(key, data ?? null);
}
