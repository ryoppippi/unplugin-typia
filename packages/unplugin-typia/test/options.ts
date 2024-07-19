import { test } from 'bun:test';
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

test('Return cache is false if cache key is false', () => {
	const options = resolveOptions({ cache: false });
	assertEquals(options.cache, false);
});

test('Return cache is true if cache key is true', () => {
	const options = resolveOptions({ cache: true });
	assertEquals(options.cache, true);
});

test('Return cache is true if cache key is not passed', () => {
	const options = resolveOptions({});
	assertEquals(options.cache, false);
});
