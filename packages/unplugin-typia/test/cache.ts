import { tmpdir } from 'node:os';
import { test } from 'bun:test';
import { assertEquals, assertNotEquals } from '@std/assert';

import * as cache from '../src/core/cache.js';
import type { Data, FilePath, ID, Source } from '../src/core/types.js';
import { wrap } from '../src/core/types.js';

const tmp = wrap<FilePath>(tmpdir());

function removeComments(data: string | null) {
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
	const data = await cache.getCache(wrap<ID>(random), source, option);
	assertEquals(data, null);
});

test('set and get cache', async () => {
	const option = { enable: true, base: tmp } as const;
	const random = Math.random().toString();
	const source = wrap<Source>(random);
	const filename = wrap<ID>(`${random}-${random}.json`);
	const data = wrap<Data>(`${random};`);

	/* set cache */
	await cache.setCache(filename, source, data, option);

	/* get cache */
	const cacheData = await cache.getCache(filename, source, option);

	/* delete js asterisk comments */
	const cacheDataStr = removeComments(cacheData);

	assertEquals(data, cacheDataStr);
});

test('set and get null with different id', async () => {
	const option = { enable: true, base: tmp } as const;
	const random = Math.random().toString();
	const source = wrap<Source>(random);
	const filename = wrap<ID>(`${random}-${random}.json`);
	const data = wrap<Data>(`${random};`);

	/* set cache */
	await cache.setCache(filename, source, data, option);

	/* get cache */
	const cacheData = await cache.getCache(`111;${random}` as ID, source, option);

	/* delete js asterisk comments */
	const cacheDataStr = removeComments(cacheData);

	assertEquals(cacheDataStr, null);
	assertNotEquals(data, cacheDataStr);
});

test('set and get null with cache disabled', async () => {
	const option = { enable: false, base: tmp } as const;
	const random = Math.random().toString();
	const source = wrap<Source>(random);
	const filename = wrap<ID>(`${random}-${random}.json`);
	const data = wrap<Data>(`${random};`);

	/* set cache */
	await cache.setCache(filename, source, data, option);

	/* get cache */
	const cacheData = await cache.getCache(filename, source, option);

	assertEquals(cacheData, null);
});
