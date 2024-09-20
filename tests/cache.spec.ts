import process from 'node:process';
import { tmpdir } from 'node:os';
import { expect, it } from 'vitest';

import { Cache } from '../src/core/cache.js';
import type { Data, ID, Source } from '../src/core/types.js';
import { wrap } from '../src/core/types.js';

process.env.CACHE_DIR = tmpdir();

function removeComments(data: string | undefined) {
	if (data == null) {
		return data;
	}

	// eslint-disable-next-line regexp/no-unused-capturing-group
	return data.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');
}

it('return null if cache is not found', async () => {
	const random = Math.random().toString();
	const source = wrap<Source>(random);
	using cache = new Cache(wrap<ID>(random), source);
	expect(cache.data).toBe(undefined);
});

it('set and get cache', async () => {
	const random = Math.random().toString();
	const source = wrap<Source>(random);
	const filename = wrap<ID>(`${random}-${random}.json`);
	const data = wrap<Data>(`${random};`);

	/* set cache */
	{
		using cache = new Cache(filename, source);
		cache.data = data;
	}

	/* get cache */
	using cache = new Cache(filename, source);

	/* delete js asterisk comments */
	const cacheDataStr = removeComments(cache.data);

	expect(cacheDataStr).toBe(data);
});

it('set and get null with different id', async () => {
	const random = Math.random().toString();
	const source = wrap<Source>(random);
	const filename = wrap<ID>(`${random}-${random}.json`);
	const data = wrap<Data>(`${random};`);

	/* set cache */
	{
		using cache = new Cache(filename, source);
		cache.data = data;
	}

	/* get cache */
	using cache = new Cache(wrap<ID>(`111;${random}`), source);

	/* delete js asterisk comments */
	const cacheDataStr = removeComments(cache.data);

	expect(cacheDataStr).toBe(undefined);
	expect(cacheDataStr).not.toBe(data);
});
