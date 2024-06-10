import { $ } from 'bun';

const distDir = ['dist-cjs', 'dist-esm'] as const;
const tsconfigs = ['tsconfig.json', 'tsconfig.cjs.json'] as const;

/* Remove dist directories */
await Promise.all(distDir.map(d => $`rm -rf ./${d}`));

/* Build cjs/esm */
await Promise.all(
	tsconfigs.map(tsconfig => $`bun run tsc -p ./${tsconfig}`),
);
