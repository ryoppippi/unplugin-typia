import { basename } from 'pathe';

import { expect, test } from 'bun:test';

import type { UnpluginBuildContext, UnpluginContext } from 'unplugin';
import { transformTypia } from '../src/core/typia.js';
import { resolveOptions } from '../src/api.js';
import { fixtures } from './_get_fixtures.js';

class DummyContext {
	warn(args: unknown) {
		console.warn(args);
	}
};

function slash(str: string) {
	return str.replace(/\\/g, '/');
}

const ctx = new DummyContext() as UnpluginContext & UnpluginBuildContext;

for (const [id, source] of fixtures) {
	test(`Transform ${basename(id)}`, async () => {
		const transformed = await transformTypia(id, source, ctx, resolveOptions({ cache: false })).then(x => slash(x).trim());
		expect(transformed).toMatchSnapshot();
	});
}
