import { join } from 'node:path';
import { unescape } from 'node:querystring';
import { expect, test } from 'bun:test';

import type { UnpluginBuildContext, UnpluginContext } from 'unplugin';
import { transformTypia } from '../src/core/typia.js';
import { resolveOptions } from '../src/api.js';
import type { ID, Source } from '../src/core/types.js';

class DummyContext {
	warn(args: unknown) {
		console.warn(args);
	}
}

const id = join(import.meta.dirname, './fixtures/index.ts') as ID;
const code = await Bun.file(id).text() as Source;

test('Transform Typia', async () => {
	const result = await transformTypia(id, code, new DummyContext() as UnpluginContext & UnpluginBuildContext, resolveOptions({ cache: false })).then(code => JSON.stringify(code, null, 2));

	expect(result).toMatchSnapshot();
});
