import { accessSync, constants, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import process from 'node:process';
import { basename, dirname, join } from 'pathe';
import typiaPackageJson from 'typia/package.json' with {type: 'json'};
import type { CacheKey, CachePath, Data, FilePath, ID, Source } from './types.js';
import { wrap } from './types.js';
import type { ResolvedOptions } from './options.js';
import { isBun } from './utils.js';

const { version: typiaVersion } = typiaPackageJson;

type ResolvedCacheOptions = ResolvedOptions['cache'];

/**
 * Cache class
 *
 * @caution: CacheOptions.enable is ignored
 */
export class Cache {
	#data: Data | undefined;
	#hashKey: CacheKey;
	#hashPath: CachePath;

	constructor(id: ID, source: Source, options: ResolvedCacheOptions) {
		this.#hashKey = this.getHashKey(id, source);
		this.#hashPath = wrap<CachePath>(join(options.base, this.#hashKey));
		this.#data = this.getCache();
	}

	[Symbol.dispose]() {
		this.setCache();
	}

	/**
	 * Get cache data
	 */
	get data() {
		return this.#data;
	}

	/**
	 * Set cache data
	 */
	set data(value: Data | undefined) {
		this.#data = value;
	}

	private getCache() {
		if (!(existsSync(this.#hashPath))) {
			return undefined;
		}

		const data = readFileSync(this.#hashPath, { encoding: 'utf8' });

		/* if data does not end with hashComment, the cache is invalid */
		if (!data.endsWith(this.hashComment)) {
			return undefined;
		}

		return wrap<Data>(data);
	}

	private setCache() {
		const cacheDir = dirname(this.#hashPath);
		if (this.#data == null && existsSync(this.#hashPath)) {
			rmSync(this.#hashPath);
			return;
		}

		if (!existsSync(cacheDir)) {
			mkdirSync(cacheDir, { recursive: true });
		}

		if (!this.isWritable(cacheDir)) {
			throw new Error('Cache directory is not writable.');
		}

		const cache = this.#data + this.hashComment;
		writeFileSync(this.#hashPath, cache, { encoding: 'utf8' });
	}

	private getHashKey(id: ID, source: Source): CacheKey {
		const h = this.hash(source);
		const filebase = `${basename(dirname(id))}_${basename(id)}`;

		return wrap<CacheKey>(`${filebase}_${h}`);
	}

	private hash(input: string): string {
		if (isBun()) {
			return Bun.hash(input).toString();
		}
		return createHash('md5').update(input).digest('hex');
	}

	private get hashComment() {
		return `/* unplugin-typia-${typiaVersion ?? ''}-${this.#hashKey} */`;
	}

	private isWritable(filename: string): boolean {
		try {
			accessSync(filename, constants.W_OK);
			return true;
		}
		catch {
			return false;
		}
	}
}

/**
 * Get cache directory
 * copy from https://github.com/unjs/jiti/blob/690b727d7c0c0fa721b80f8085cafe640c6c2a40/src/cache.ts
 */
export function getCacheDir(): FilePath {
	let _tmpDir = tmpdir();

	// Workaround for pnpm setting an incorrect `TMPDIR`.
	// https://github.com/pnpm/pnpm/issues/6140
	// https://github.com/unjs/jiti/issues/120
	if (
		process.env.TMPDIR != null
		&& _tmpDir === process.cwd()
	) {
		const _env = process.env.TMPDIR;
		delete process.env.TMPDIR;
		_tmpDir = tmpdir();
		process.env.TMPDIR = _env;
	}

	const path = join(_tmpDir, 'unplugin_typia');
	return wrap<FilePath>(path);
}
