import { $ } from 'bun';
import { join } from 'pathe';
import type { ID, Source } from '../src/core/types.js';

const ids = await $`ls ${join(import.meta.dirname, './fixtures')}/*.ts`.text().then(x => x.split('\n').filter(Boolean)) as ID[ ];

const fixtures: [ID, Source][] = [];
for (const id of ids) {
	fixtures.push([id, await $`cat ${id}`.text() as Source]);
}

export { fixtures, ids };
