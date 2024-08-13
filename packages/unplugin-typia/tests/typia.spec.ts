import { expect, it } from 'vitest';
import { $ } from 'dax-sh';

import type { UnpluginBuildContext, UnpluginContext } from 'unplugin';
import { transformTypia } from '../src/core/typia.js';
import { resolveOptions } from '../src/api.js';
import type { Data } from '../src/core/types.js';
import { getFixtureID, getFixtureIDs, getSnapshotID, readFixture } from './_utils.js';

class DummyContext {
	warn(args: unknown) {
		console.warn(args);
	}
};

const ctx = new DummyContext() as UnpluginContext & UnpluginBuildContext;

async function test(_id: string): Promise<Data> {
	const id = getFixtureID(_id);
	const code = await readFixture(_id);
	const transformed = await transformTypia(id, code, ctx, resolveOptions({ cache: false }));
	return transformed;
}

for (const id of await getFixtureIDs()) {
	it(`transform ${id}`, async () => {
		const transformed = await test(id);
		const snapshot = getSnapshotID(id);
		await expect(transformed).toMatchFileSnapshot(snapshot);
		await $`bun ${snapshot}`;
	});
}
