import { type Storage, createStorage } from 'unstorage';
import fsLiteDriver from 'unstorage/drivers/fs-lite';
import { isEqual, sha256 } from 'ohash';
import type { transformTypia } from './typia.js';
import type { ResolvedOptions } from './options.js';

type ResolvedCacheOptions = ResolvedOptions['cache'];

type Data = Awaited<ReturnType<typeof transformTypia>>;

interface StoreData {
	data: NonNullable<Data>;
	id: string;
	source: string;
}

let globalStorage: Storage | undefined;
let globalOption: ResolvedCacheOptions | undefined;

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
		throw new Error('Storage cannot be created');
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
		return null;
	}
	const storage = getStorage(option);
	const key = getKey(id, source);
	const data = await storage.getItem<StoreData>(key);

	/** validate cache */
	if (data == null) {
		return null;
	}

	if (data.id !== id || data.source !== source) {
		return null;
	}

	return data.data;
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
	const key = getKey(id, source);

	if (data == null) {
		await storage.removeItem(key);
		return;
	}

	await storage.setItem(key, { data, id, source });
}

/**
 * Get cache key
 * @param id
 * @param source
 */
function getKey(id: string, source: string): string {
	return sha256(`${id}:${source}`);
}
