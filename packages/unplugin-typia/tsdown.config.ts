import { defineConfig } from 'tsdown';
import Quansync from 'unplugin-quansync/rolldown';

const config: ReturnType<typeof defineConfig> = defineConfig({
	entry: [
		'src/*.ts',
		'!src/bun.ts',
	],
	define: {
		'import.meta.vitest': 'undefined',
	},
	plugins: [
		Quansync(),
	],
	clean: true,
	format: ['esm'],
	shims: true,
	target: 'es2023',
	dts: true,
	sourcemap: true,
	unused: {
		level: 'error',
		ignore: ['bun-only'],
	},
	publint: true,
});

export default config;
