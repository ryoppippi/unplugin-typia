import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: [
		'src/*.ts',
		'!src/bun.ts',
	],
	clean: true,
	format: 'esm',
	target: 'es2023',
	dts: true,
	shims: true,
	sourcemap: true,
	unused: true,
	publint: true,
});
