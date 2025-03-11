import type { Options } from 'tsup';

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
};
