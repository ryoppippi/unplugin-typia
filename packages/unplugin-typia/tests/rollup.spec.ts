import { expect, it } from 'vitest';
import { $ } from 'dax-sh';
import { RollupEsbuildPlugin, rollupBuild } from '@vue-macros/test-utils';

import UnpluginInlineTypia from '../src/rollup.js';
import type { ID } from '../src/core/types.js';
import { getFixtureID, getFixtureIDs, getSnapshotID } from './_utils.js';

async function transform(_id: ID) {
	const id = getFixtureID(_id);
	const result = await rollupBuild(
		id,
		[
			UnpluginInlineTypia({
				cache: false,
				log: false,
			}),
			RollupEsbuildPlugin(),
			{
				name: 'test:mod-options',
				options(options) {
					options.treeshake = 'smallest';
				},
			},

		],
	);
	return result;
}

for (const id of await getFixtureIDs()) {
	it(`rollup transform ${id}`, async () => {
		const transformed = await transform(id);
		const snapshot = getSnapshotID(id).replace('__snapshots__', '__snapshots__/rollup');
		await expect(transformed).toMatchFileSnapshot(snapshot);
		await $`node ${snapshot}`;
	});
}
