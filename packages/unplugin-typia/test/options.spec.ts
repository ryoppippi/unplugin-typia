import { expect, it } from 'vitest';

import { defaultOptions, resolveOptions } from '../src/core/options.js';

it('return default options if empty object is passed', () => {
	const options = resolveOptions({});
	expect(options).toMatchObject(defaultOptions);
});

it('return default options if include option is passed', () => {
	const options = resolveOptions({ include: [/\.js$/] });
	expect(options.include).not.toBe(defaultOptions.include);
	expect(options.include).toEqual([/\.js$/]);
	expect(options).toMatchObject({ ...defaultOptions, include: [/\.js$/] });
});

it('return default options if log option is passed', () => {
	const options = resolveOptions({ log: 'verbose' });
	expect(options.log).toBe('verbose');
	expect(options).toMatchObject({ ...defaultOptions, log: 'verbose' });
});

it('return default options if enforce option is passed', () => {
	const options = resolveOptions({ enforce: 'post' });
	expect(options.enforce).toBe('post');
	expect(options).toMatchObject({ ...defaultOptions, enforce: 'post' });
});

it('return cache is false if cache key is false', () => {
	const options = resolveOptions({ cache: false });
	expect(options).toMatchObject({ ...defaultOptions, cache: false });
});

it('return cache is true if cache key is true', () => {
	const options = resolveOptions({ cache: true });
	expect(options).toMatchObject({ ...defaultOptions, cache: true });
});

it('return cache is false if cache key is not passed', () => {
	const options = resolveOptions({});
	expect(options).toMatchObject({ ...defaultOptions, cache: false });
});
