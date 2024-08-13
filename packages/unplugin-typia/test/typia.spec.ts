import { basename, join } from 'pathe';

import { expect, it } from 'vitest';
import { $ } from 'bun';

import type { UnpluginBuildContext, UnpluginContext } from 'unplugin';
import { transformTypia } from '../src/core/typia.js';
import { resolveOptions } from '../src/api.js';
import type { ID, Source } from '../src/core/types.js';

class DummyContext {
	warn(args: unknown) {
		console.warn(args);
	}
};

function slash(str: string) {
	return str.replace(/\\/g, '/');
}

const ids = await $`ls ${join(import.meta.dirname, './fixtures')}/*.ts`.text().then(x => x.split('\n').filter(Boolean)) as ID[ ];
const ctx = new DummyContext() as UnpluginContext & UnpluginBuildContext;

for (const id of ids) {
	it(`transform `, async () => {
		const code = await $`cat ${id}`.text() as Source;
		const transformed = await transformTypia(id, code, ctx, resolveOptions({ cache: false })).then(x => slash(x).trim());
		expect(transformed).toMatchSnapshot();
	});
}
