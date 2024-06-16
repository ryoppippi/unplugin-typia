import { existsSync } from 'node:fs';
import { access, constants, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { basename, dirname, join } from 'pathe';
import type { Tagged } from 'type-fest';
import { readPackageJSON } from 'pkg-types';
import type { transformTypia } from './typia.js';
import type { ResolvedOptions } from './options.js';
import { isBun } from './utils.js';

type ResolvedCacheOptions = ResolvedOptions['cache'];

type Data = Awaited<ReturnType<typeof transformTypia>>;

let cacheDir: string | null = null;
let typiaVersion: string | undefined;

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

	let data: Data | null = null;
	if (isBun()) {
		const file = Bun.file(path);
		if (!(await file.exists())) {
			return null;
		}
		data = await file.text();
	}
	else {
		if (!(existsSync(path))) {
			return null;
		}
		data = await readFile(path, { encoding: 'utf8' });
	}

	const hashComment = await getHashComment(key);

	if (data.endsWith(hashComment)) {
		return data;
	}

	return null;
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
	const hashComment = await getHashComment(key);

	if (data == null) {
		await rm(path);
		return;
	}

	const cache = data + hashComment;
	if (isBun()) {
		Bun.write(path, cache, { createPath: true });
	}
	else {
		await writeFile(path, cache, { encoding: 'utf8' });
	}
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

async function prepareCacheDir(option: ResolvedCacheOptions) {
	if (cacheDir != null) {
		return;
	}
	await mkdir(option.base, { recursive: true });

	if (!isWritable) {
		throw new Error('Cache directory is not writable.');
	}

	cacheDir = option.base;
}

async function isWritable(filename: string): Promise<boolean> {
	try {
		await access(filename, constants.W_OK);
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

export async function getHashComment(cachePath: CacheKey) {
	typiaVersion = typiaVersion ?? await readPackageJSON('typia').then(pkg => pkg.version);
	return `/* unplugin-typia-${typiaVersion ?? ''}-${cachePath} */`;
}
