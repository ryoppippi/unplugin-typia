import { tmpdir } from 'node:os';
import { test } from 'bun:test';
import { assertEquals, assertNotEquals } from '@std/assert';

import { Cache } from '../src/core/cache.js';
import type { Data, FilePath, ID, Source } from '../src/core/types.js';
import { wrap } from '../src/core/types.js';

const tmp = wrap<FilePath>(tmpdir());

function removeComments(data: string | undefined) {
	if (data == null) {
		return data;
	}

	// eslint-disable-next-line regexp/no-unused-capturing-group
	return data.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');
}

test('return null if cache is not found', async () => {
	const option = { enable: true, base: tmp } as const;
	const random = Math.random().toString();
	const source = wrap<Source>(random);
	using cache = new Cache(wrap<ID>(random), source, option);
	assertEquals(cache.data, undefined);
});

test('set and get cache', async () => {
	const option = { enable: true, base: tmp } as const;
	const random = Math.random().toString();
	const source = wrap<Source>(random);
	const filename = wrap<ID>(`${random}-${random}.json`);
	const data = wrap<Data>(`${random};`);

	/* set cache */
	{
		using cache = new Cache(filename, source, option);
		cache.data = data;
	}

	/* get cache */
	using cache = new Cache(filename, source, option);

	/* delete js asterisk comments */
	const cacheDataStr = removeComments(cache.data);

	assertEquals(cacheDataStr, data);
});

test('set and get null with different id', async () => {
	const option = { enable: true, base: tmp } as const;
	const random = Math.random().toString();
	const source = wrap<Source>(random);
	const filename = wrap<ID>(`${random}-${random}.json`);
	const data = wrap<Data>(`${random};`);

	/* set cache */
	{
		using cache = new Cache(filename, source, option);
		cache.data = data;
	}

	/* get cache */
	using cache = new Cache(wrap<ID>(`111;${random}`), source, option);

	/* delete js asterisk comments */
	const cacheDataStr = removeComments(cache.data);

	assertEquals(cacheDataStr, undefined);
	assertNotEquals(cacheDataStr, data);
});
