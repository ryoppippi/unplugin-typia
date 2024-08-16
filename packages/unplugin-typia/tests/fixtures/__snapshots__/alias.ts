import type { IMember } from '@/type.d.ts';
import typia from 'typia';
const is = (() => { const $io0 = (input: any): boolean => "string" === typeof input.email && /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(input.email) && ("string" === typeof input.id && /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(input.id)) && ("number" === typeof input.age && (Math.floor(input.age) === input.age && 0 <= input.age && input.age <= 4294967295 && 19 < input.age && input.age <= 100)); return (input: any): input is IMember => "object" === typeof input && null !== input && $io0(input); })();
const random = (generator?: Partial<typia.IRandomGenerator>): import("typia").Resolved<IMember> => {
    const $generator = (typia.createRandom as any).generator;
    const $ro0 = (_recursive: boolean = false, _depth: number = 0): any => ({
        email: (generator?.customs ?? $generator.customs)?.string?.([
            {
                name: "Format<\"email\">",
                kind: "format",
                value: "email"
            }
        ]) ?? (generator?.email ?? $generator.email)(),
        id: (generator?.customs ?? $generator.customs)?.string?.([
            {
                name: "Format<\"uuid\">",
                kind: "format",
                value: "uuid"
            }
        ]) ?? (generator?.uuid ?? $generator.uuid)(),
        age: (generator?.customs ?? $generator.customs)?.number?.([
            {
                name: "Type<\"uint32\">",
                kind: "type",
                value: "uint32"
            },
            {
                name: "ExclusiveMinimum<19>",
                kind: "exclusiveMinimum",
                value: 19
            },
            {
                name: "Maximum<100>",
                kind: "maximum",
                value: 100
            }
        ]) ?? (generator?.integer ?? $generator.integer)(19, 100)
    });
    return $ro0();
};
const validate = (() => { const $io0 = (input: any): boolean => "string" === typeof input.email && /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(input.email) && ("string" === typeof input.id && /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(input.id)) && ("number" === typeof input.age && (Math.floor(input.age) === input.age && 0 <= input.age && input.age <= 4294967295 && 19 < input.age && input.age <= 100)); const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.email && (/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(input.email) || $report(_exceptionable, {
        path: _path + ".email",
        expected: "string & Format<\"email\">",
        value: input.email
    })) || $report(_exceptionable, {
        path: _path + ".email",
        expected: "(string & Format<\"email\">)",
        value: input.email
    }), "string" === typeof input.id && (/^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(input.id) || $report(_exceptionable, {
        path: _path + ".id",
        expected: "string & Format<\"uuid\">",
        value: input.id
    })) || $report(_exceptionable, {
        path: _path + ".id",
        expected: "(string & Format<\"uuid\">)",
        value: input.id
    }), "number" === typeof input.age && (Math.floor(input.age) === input.age && 0 <= input.age && input.age <= 4294967295 || $report(_exceptionable, {
        path: _path + ".age",
        expected: "number & Type<\"uint32\">",
        value: input.age
    })) && (19 < input.age || $report(_exceptionable, {
        path: _path + ".age",
        expected: "number & ExclusiveMinimum<19>",
        value: input.age
    })) && (input.age <= 100 || $report(_exceptionable, {
        path: _path + ".age",
        expected: "number & Maximum<100>",
        value: input.age
    })) || $report(_exceptionable, {
        path: _path + ".age",
        expected: "(number & Type<\"uint32\"> & ExclusiveMinimum<19> & Maximum<100>)",
        value: input.age
    })].every((flag: boolean) => flag); const __is = (input: any): input is IMember => "object" === typeof input && null !== input && $io0(input); let errors; let $report; return (input: any): typia.IValidation<IMember> => {
    if (false === __is(input)) {
        errors = [];
        $report = (typia.createValidate as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) => ("object" === typeof input && null !== input || $report(true, {
            path: _path + "",
            expected: "IMember",
            value: input
        })) && $vo0(input, _path + "", true) || $report(true, {
            path: _path + "",
            expected: "IMember",
            value: input
        }))(input, "$input", true);
        const success = 0 === errors.length;
        return {
            success,
            errors,
            data: success ? input : undefined
        } as any;
    }
    return {
        success: true,
        errors: [],
        data: input
    } as any;
}; })();
is({});
validate({});
random();
