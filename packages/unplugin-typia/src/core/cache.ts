import { accessSync, constants, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { basename, dirname, join } from 'pathe';
import type { Tagged } from 'type-fest';
import type { transformTypia } from './typia.js';
import type { ResolvedOptions } from './options.js';
import { isBun } from './utils.js';

type ResolvedCacheOptions = ResolvedOptions['cache'];

type Data = Awaited<ReturnType<typeof transformTypia>>;

interface StoreData {
	data: NonNullable<Data>;
	source: string;
}

function isStoreData(value: unknown): value is StoreData {
	if (typeof value !== 'object' || value === null) {
		return false;
	}
	const data = value as StoreData;
	return data.data != null
		&& typeof data.source === 'string';
}

let cacheDir: string | null = null;

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
	prepareCacheDir(option);

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

	if (data.source !== source) {
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
	prepareCacheDir(option);

	const key = getKey(id, source);
	const path = getCachePath(key, option);

	if (data == null) {
		rmSync(path);
		return;
	}

	const json = JSON.stringify({ data, source });
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
	const h = hash(source);
	const filebase = `${basename(dirname(id))}_${basename(id)}`;

	return `${filebase}_${h}` as CacheKey;
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

function prepareCacheDir(option: ResolvedCacheOptions): void {
	if (cacheDir != null) {
		return;
	}
	mkdirSync(option.base, { recursive: true });

	if (!isWritable) {
		throw new Error('Cache directory is not writable.');
	}

	cacheDir = option.base;
}

function isWritable(filename: string): boolean {
	try {
		accessSync(filename, constants.W_OK);
		return true;
	}
	catch {
		return false;
	}
}

/**
 * Create hash string
 * @param input
 * @returns The hash string.
 */
function hash(input: string): string {
	if (isBun()) {
		return Bun.hash(input).toString();
	}
	return createHash('md5').update(input).digest('hex');
}
