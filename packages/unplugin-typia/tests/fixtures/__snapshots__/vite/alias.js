import typia from "typia";
const is = /* @__PURE__ */ (() => {
  const $io0 = (input) => "string" === typeof input.email && /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(input.email) && ("string" === typeof input.id && /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(input.id)) && ("number" === typeof input.age && (Math.floor(input.age) === input.age && 0 <= input.age && input.age <= 4294967295 && 19 < input.age && input.age <= 100));
  return (input) => "object" === typeof input && null !== input && $io0(input);
})();
const random = (() => {
  const $generator = typia.createRandom.generator;
  const $ro0 = (_recursive = false, _depth = 0) => {
    var _a, _b, _c, _d, _e, _f;
    return {
      email: ((_b = (_a = (_generator == null ? void 0 : _generator.customs) ?? $generator.customs) == null ? void 0 : _a.string) == null ? void 0 : _b.call(_a, [
        {
          name: 'Format<"email">',
          kind: "format",
          value: "email"
        }
      ])) ?? ((_generator == null ? void 0 : _generator.email) ?? $generator.email)(),
      id: ((_d = (_c = (_generator == null ? void 0 : _generator.customs) ?? $generator.customs) == null ? void 0 : _c.string) == null ? void 0 : _d.call(_c, [
        {
          name: 'Format<"uuid">',
          kind: "format",
          value: "uuid"
        }
      ])) ?? ((_generator == null ? void 0 : _generator.uuid) ?? $generator.uuid)(),
      age: ((_f = (_e = (_generator == null ? void 0 : _generator.customs) ?? $generator.customs) == null ? void 0 : _e.number) == null ? void 0 : _f.call(_e, [
        {
          name: 'Type<"uint32">',
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
      ])) ?? ((_generator == null ? void 0 : _generator.integer) ?? $generator.integer)(19, 100)
    };
  };
  let _generator;
  return (generator) => {
    _generator = generator;
    return $ro0();
  };
})();
const validate = /* @__PURE__ */ (() => {
  const $io0 = (input) => "string" === typeof input.email && /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(input.email) && ("string" === typeof input.id && /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(input.id)) && ("number" === typeof input.age && (Math.floor(input.age) === input.age && 0 <= input.age && input.age <= 4294967295 && 19 < input.age && input.age <= 100));
  const $vo0 = (input, _path, _exceptionable = true) => ["string" === typeof input.email && (/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(input.email) || $report(_exceptionable, {
    path: _path + ".email",
    expected: 'string & Format<"email">',
    value: input.email
  })) || $report(_exceptionable, {
    path: _path + ".email",
    expected: '(string & Format<"email">)',
    value: input.email
  }), "string" === typeof input.id && (/^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(input.id) || $report(_exceptionable, {
    path: _path + ".id",
    expected: 'string & Format<"uuid">',
    value: input.id
  })) || $report(_exceptionable, {
    path: _path + ".id",
    expected: '(string & Format<"uuid">)',
    value: input.id
  }), "number" === typeof input.age && (Math.floor(input.age) === input.age && 0 <= input.age && input.age <= 4294967295 || $report(_exceptionable, {
    path: _path + ".age",
    expected: 'number & Type<"uint32">',
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
    expected: '(number & Type<"uint32"> & ExclusiveMinimum<19> & Maximum<100>)',
    value: input.age
  })].every((flag) => flag);
  const __is = (input) => "object" === typeof input && null !== input && $io0(input);
  let errors;
  let $report;
  return (input) => {
    if (false === __is(input)) {
      errors = [];
      $report = typia.createValidate.report(errors);
      ((input2, _path, _exceptionable = true) => ("object" === typeof input2 && null !== input2 || $report(true, {
        path: _path + "",
        expected: "IMember",
        value: input2
      })) && $vo0(input2, _path + "", true) || $report(true, {
        path: _path + "",
        expected: "IMember",
        value: input2
      }))(input, "$input", true);
      const success = 0 === errors.length;
      return {
        success,
        errors,
        data: success ? input : void 0
      };
    }
    return {
      success: true,
      errors: [],
      data: input
    };
  };
})();
is({});
validate({});
random();
