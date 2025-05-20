import { defineConfig } from 'vitest/config';
import Quansync from 'unplugin-quansync/vite';

export default defineConfig({
	plugins: [Quansync()],
	test: {
		globals: true,
		includeSource: ['src/**/*.{js,ts}'],
		testTimeout: 150000,
		typecheck: true,
	},
});
