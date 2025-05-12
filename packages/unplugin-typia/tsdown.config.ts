import { defineConfig } from 'tsdown';

const config: ReturnType<typeof defineConfig> = defineConfig({
	entry: [
		'src/*.ts',
		'!src/bun.ts',
	],
	clean: true,
	format: ['esm'],
	shims: true,
	target: 'es2023',
	dts: true,
	sourcemap: true,
	unused: { level: 'error' },
	publint: true,
});

export default config;
