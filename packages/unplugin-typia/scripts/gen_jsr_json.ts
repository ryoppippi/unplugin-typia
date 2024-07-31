import { join } from 'node:path';
import {
	exports,
	files,
	name,
	version,
} from '../package.json';

const jsrJSON = {
	version,
	name,
	exports,
	publish: {
		include: files,
	},
} as const;

const exportJSRPath = join(import.meta.dirname, '../jsr.json');

await Bun.write(exportJSRPath, JSON.stringify(jsrJSON, null, '\t'));
