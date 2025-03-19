import type { Options } from 'tsup';
import UnpluginUnused from 'unplugin-unused/esbuild';

export default <Options>{
	entry: [
		'src/*.ts',
		'!src/bun.ts',
	],
	clean: true,
	format: ['esm'],
	target: 'es2020',
	dts: true,
	cjsInterop: true,
	splitting: true,
	sourcemap: true,
	plugins: [
		UnpluginUnused({
			level: 'error',
		}),
	],
};
