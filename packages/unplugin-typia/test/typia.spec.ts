import { expect, it } from 'vitest';
import { $ } from 'dax-sh';

import type { UnpluginBuildContext, UnpluginContext } from 'unplugin';
import { transformTypia } from '../src/core/typia.js';
import { resolveOptions } from '../src/api.js';
import type { Data } from '../src/core/types.js';
import { getFixtureID, getSnapshotID, readFixture } from './_utils.js';

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

it('transform is', async () => {
	const transformed = await test('is.ts');
	const snapshot = getSnapshotID('is.ts');
	await expect(transformed).toMatchFileSnapshot(snapshot);
	await $`bun ${snapshot}`;
});

it('transform validate', async () => {
	const transformed = await test('validate.ts');
	const snapshot = getSnapshotID('validate.ts');
	await expect(transformed).toMatchFileSnapshot(snapshot);
	await $`bun ${snapshot}`;
});

it('transform random', async () => {
	const transformed = await test('random.ts');
	const snapshot = getSnapshotID('random.ts');
	await expect(transformed).toMatchFileSnapshot(snapshot);
	await $`bun ${snapshot}`;
});
