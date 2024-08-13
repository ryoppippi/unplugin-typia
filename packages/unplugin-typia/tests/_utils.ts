import fs from 'node:fs/promises';
import { resolve } from 'pathe';
import type { ID, Source } from '../src/core/types.js';

export const root = resolve(__dirname, 'fixtures');

export function getFixtureID(id: string): ID {
	return resolve(root, id) as ID;
}

export function getSnapshotID(id: string): ID {
	return resolve(root, '__snapshots__', id) as ID;
}

export async function readFixture(id: string): Promise<Source> {
	const _id = getFixtureID(id);
	return await fs.readFile(_id, 'utf-8') as Source;
}
