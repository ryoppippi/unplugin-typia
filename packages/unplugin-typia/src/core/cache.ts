import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'pathe';
import type { Tagged } from 'type-fest';
import type { transformTypia } from './typia.js';
import type { ResolvedOptions } from './options.js';

type ResolvedCacheOptions = ResolvedOptions['cache'];

type Data = Awaited<ReturnType<typeof transformTypia>>;

interface StoreData {
	data: NonNullable<Data>;
	id: string;
	source: string;
}

function isStoreData(value: unknown): value is StoreData {
	if (typeof value !== 'object' || value === null) {
		return false;
	}
	const data = value as StoreData;
	return data.data != null
		&& typeof data.id === 'string'
		&& typeof data.source === 'string';
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
	const key = getKey(id, source);
	const path = getCachePath(key, option);

	let data: StoreData | null = null;
	if (existsSync(path)) {
		const cache = readFileSync(path, 'utf8');
		const json = JSON.parse(cache);
		if (!isStoreData(json)) {
			return null;
		}
		data = json;
	}

	/** validate cache */
	if (!isStoreData(data)) {
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
	const key = getKey(id, source);
	const path = getCachePath(key, option);

	if (data == null) {
		rmSync(path);
		return;
	}

	// await storage.setItem(key, { data, id, source });
	const json = JSON.stringify({ data, id, source });
	writeFileSync(path, json, { encoding: 'utf8' });
}

type CacheKey = Tagged<string, 'cache-key'>;
type CachePath = Tagged<string, 'cache-path'>;

/**
 * Get cache key
 * @param id
 * @param source
 */
function getKey(id: string, source: string): CacheKey {
	return hash(`${id}:${source}`) as CacheKey;
}

/**
 * Get storage
 * @param key
 * @param option
 */
function getCachePath(
	key: CacheKey,
	option: ResolvedCacheOptions,
): CachePath {
	return join(option.base, key) as CachePath;
}

/**
 * Create hash string
 * @param input
 * @returns The hash string.
 */
function hash(input: string): string {
	if (globalThis.Bun != null) {
		return Bun.hash(input).toString();
	}
	return createHash('md5').update(input).digest('hex');
}
