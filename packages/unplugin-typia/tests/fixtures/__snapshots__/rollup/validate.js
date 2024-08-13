// validate.js
import typia from 'typia';

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
validate({});
