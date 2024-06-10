import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/**/*.ts'],
	outDir: 'dist',
	format: ['cjs', 'esm'],
	splitting: false,
	sourcemap: true,
	dts: true,
	clean: true,
	treeshake: true,
});
