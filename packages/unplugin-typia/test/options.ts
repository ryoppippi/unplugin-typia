import { test } from '@cross/test';
import {
	assertEquals,
	assertNotEquals,
	assertObjectMatch,
} from '@std/assert';

import { defaultOptions, resolveOptions } from '../src/core/options.js';

test('Return default options if empty object is passed', () => {
	const options = resolveOptions({});
	assertObjectMatch(options, defaultOptions);
});

test('Return default options if include option is passed', () => {
	const options = resolveOptions({ include: [/\.js$/] });
	assertNotEquals(options.include, defaultOptions.include);
	assertEquals(options.include, [/\.js$/]);
	assertObjectMatch(options, { ...defaultOptions, include: [/\.js$/] });
});

test('Return default options if log option is passed', () => {
	const options = resolveOptions({ log: 'verbose' });
	assertEquals(options.log, 'verbose');
	assertObjectMatch(options, { ...defaultOptions, log: 'verbose' });
});

test('Return default options if enforce option is passed', () => {
	const options = resolveOptions({ enforce: 'post' });
	assertEquals(options.enforce, 'post');
	assertObjectMatch(options, { ...defaultOptions, enforce: 'post' });
});

test('Return cache object if cache key is boolean', () => {
	const options = resolveOptions({ cache: false });
	assertEquals(typeof options.cache, 'object');
	assertObjectMatch(
		options.cache as Record<string, unknown>,
		{ ...defaultOptions.cache, enable: false },
	);
});

test('Return cache object if cache key is object and not base passed', () => {
	const options = resolveOptions({ cache: { enable: false } });
	assertEquals(typeof options.cache, 'object');
	assertObjectMatch(
		options.cache as Record<string, unknown>,
		{ ...defaultOptions.cache, enable: false },
	);
	assertObjectMatch(options, {
		...defaultOptions,
		cache: { enable: false, base: '/tmp' },
	});
});

test('Return cache object if cache key is object and base passed', () => {
	const options = resolveOptions({ cache: { base: '/tmp2' } });
	assertEquals(typeof options.cache, 'object');
	assertObjectMatch(
		options.cache as Record<string, unknown>,
		{ ...defaultOptions.cache, base: '/tmp2' },
	);
	assertObjectMatch(options, {
		...defaultOptions,
		cache: { enable: true, base: '/tmp2' },
	});
});
