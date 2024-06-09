import { tmpdir } from 'node:os';
import { test } from 'bun:test';
import { assertEquals, assertNotEquals } from '@std/assert';

import * as cache from '../src/core/cache.js';

type Data = Parameters<typeof cache.setCache>[2];

const tmp = tmpdir();

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

	assertEquals(cacheData, data);
});

test('set and get null with different id', async () => {
	const option = { enable: true, base: tmp } as const;
	const random = Math.random().toString();
	const filename = `${random}-${random}.json`;
	const data = `${random};` as const satisfies Data;

	/* set cache */
	await cache.setCache(filename, random, data, option);

	/* get cache */
	const cacheData = await cache.getCache(`${random}-1`, random, option);

	assertNotEquals(cacheData, data);
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
