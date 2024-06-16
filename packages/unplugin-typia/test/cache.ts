import { tmpdir } from 'node:os';
import { test } from 'bun:test';
import { assertEquals, assertNotEquals } from '@std/assert';

import * as cache from '../src/core/cache.js';

type Data = Parameters<typeof cache.setCache>[2];

const tmp = tmpdir();

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
	const data = await cache.getCache(random, random, option);
	assertEquals(data, null);
});

test('set and get cache', async () => {
	const option = { enable: true, base: tmp } as const;
	const random = Math.random().toString();
	const filename = `${random}-${random}.json`;
	const data = `${random};` as const satisfies Data;

	/* set cache */
	await cache.setCache(filename, random, data, option);

	/* get cache */
	const cacheData = await cache.getCache(filename, random, option);

	/* delete js asterisk comments */
	const cacheDataStr = removeComments(cacheData);

	assertEquals(data, cacheDataStr);
});

test('set and get null with different id', async () => {
	const option = { enable: true, base: tmp } as const;
	const random = Math.random().toString();
	const filename = `${random}-${random}.json`;
	const data = `${random};` as const satisfies Data;

	/* set cache */
	await cache.setCache(filename, random, data, option);

	/* get cache */
	const cacheData = await cache.getCache(`111;${random}`, random, option);

	/* delete js asterisk comments */
	const cacheDataStr = removeComments(cacheData);

	assertEquals(cacheDataStr, null);
	assertNotEquals(data, cacheDataStr);
});

test('set and get null with cache disabled', async () => {
	const option = { enable: false, base: tmp } as const;
	const random = Math.random().toString();
	const filename = `${random}-${random}.json`;
	const data = `${random};` as const satisfies Data;

	/* set cache */
	await cache.setCache(filename, random, data, option);

	/* get cache */
	const cacheData = await cache.getCache(filename, random, option);

	assertEquals(cacheData, null);
});
