import { expect, it } from 'vitest';
import { build } from 'vite';

import type { RollupOutput } from 'rollup';
import path from 'pathe';
import { $ } from 'dax-sh';
import UnpluginInlineTypia from '../src/vite.js';
import { type ID, wrap } from '../src/core/types.js';
import { getFixtureID, getFixtureIDs, getSnapshotID, root } from './_utils.js';

async function transform(_id: ID): Promise<RollupOutput['output']> {
	const id = getFixtureID(_id);
	const { output } = (await build({
		root,
		build: {
			minify: false,
			rollupOptions: {
				input: [id],
				external: ['typia'],
			},
			write: false,
		},
		logLevel: 'silent',
		plugins: [
			UnpluginInlineTypia({
				cache: false,
				log: false,
			}),
		],
		resolve: {
			alias: {
				'@': path.resolve('./tests/fixtures'),
			},
		},
	})) as RollupOutput;
	return output;
}

for (const id of await getFixtureIDs()) {
	it(`vite transform ${id}`, () => assertSnapshot(id));
}

it ('test alias', async () => assertSnapshot(wrap<ID>('alias.ts')));

async function assertSnapshot(id: ID) {
	const transformed = await transform(id);
	const code = transformed[0].code;
	const snapshot = getSnapshotID(id).replace('__snapshots__', '__snapshots__/vite');
	await expect(code).toMatchFileSnapshot(snapshot);
	await $`node ${snapshot}`;
}
