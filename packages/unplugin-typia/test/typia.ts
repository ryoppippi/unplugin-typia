import { test } from 'bun:test';
import ts from 'typescript';
import {
	assertEquals,
	assertNotEquals,
} from '@std/assert';

import type { UnpluginBuildContext, UnpluginContext } from 'unplugin';
import { transformTypia } from '../src/core/typia.js';

class DummyContext {
	warn(args: unknown) {
		console.warn(args);
	}
}

test('Transform Typia', async () => {
	const code
    = `import typia, { type tags } from "typia";
const check = typia.createIs<IMember>();
interface IMember {
    email: string & tags.Format<"email">;
    id: string & tags.Format<"uuid">;
    age: number & tags.Type<"uint32"> & tags.ExclusiveMinimum<19> & tags.Maximum<100>;
}
const res = check({});
console.log({ res })
`;

	const expectedTs = `import typia, { type tags } from "typia";
const check = (input: any): input is IMember => {
    return "object" === typeof input && null !== input && ("string" === typeof (input as any).email && /^[a-z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test((input as any).email) && ("string" === typeof (input as any).id && /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test((input as any).id)) && ("number" === typeof (input as any).age && (Math.floor((input as any).age) === (input as any).age && 0 <= (input as any).age && (input as any).age <= 4294967295 && 19 < (input as any).age && (input as any).age <= 100)));
};
interface IMember {
    email: string & tags.Format<"email">;
    id: string & tags.Format<"uuid">;
    age: number & tags.Type<"uint32"> & tags.ExclusiveMinimum<19> & tags.Maximum<100>;
}
const res = check({});
console.log({ res });
`;

	const expectedJs = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check = (input) => {
    return "object" === typeof input && null !== input && ("string" === typeof input.email && /^[a-z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(input.email) && ("string" === typeof input.id && /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(input.id)) && ("number" === typeof input.age && (Math.floor(input.age) === input.age && 0 <= input.age && input.age <= 4294967295 && 19 < input.age && input.age <= 100)));
};
const res = check({});
console.log({ res });
`;

	const result = await transformTypia('test.ts', code, new DummyContext() as UnpluginContext & UnpluginBuildContext, {
		cache: { enable: false },
		typia: {
			plugins: [],
		},
	});

	assertNotEquals(result, undefined);

	if (result == null) {
		throw new Error(
			'result is null',
		);
	}

	assertEquals(result, expectedTs);

	const js = ts.transpile(result, { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.NodeNext });

	assertEquals(js, expectedJs);
});
