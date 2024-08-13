const $join = (str) => variable(str) ? `.${str}` : `[${JSON.stringify(str)}]`;
const variable = (str) => reserved(str) === false && /^[a-zA-Z_$][a-zA-Z_$0-9]*$/g.test(str);
const reserved = (str) => RESERVED.has(str);
const RESERVED = /* @__PURE__ */ new Set([
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "new",
  "null",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with"
]);
const $report = (array) => {
  const reportable = (path) => {
    if (array.length === 0)
      return true;
    const last = array[array.length - 1].path;
    return path.length > last.length || last.substring(0, path.length) !== path;
  };
  return (exceptable, error) => {
    if (exceptable && reportable(error.path))
      array.push(error);
    return false;
  };
};
const $is_between = (value, minimum, maximum) => minimum <= value && value <= maximum;
const $is_bigint_string = (str) => {
  try {
    BigInt(str);
    return true;
  } catch {
    return false;
  }
};
const is = () => ({
  is_between: $is_between,
  is_bigint_string: $is_bigint_string
});
const validate$2 = () => ({
  ...is(),
  join: $join,
  report: $report,
  predicate: (res) => (matched, exceptionable, closure) => {
    if (matched === false && exceptionable === true)
      (() => {
        res.success && (res.success = false);
        const errorList = res.errors;
        const error = closure();
        if (errorList.length) {
          const last = errorList[errorList.length - 1].path;
          if (last.length >= error.path.length && last.substring(0, error.path.length) === error.path)
            return;
        }
        errorList.push(error);
        return;
      })();
    return matched;
  }
});
function validate$1() {
  halt("validate");
}
const validatePure = /* @__PURE__ */ Object.assign(
  validate$1,
  /* @__PURE__ */ validate$2()
);
function createValidate() {
  halt("createValidate");
}
const createValidatePure = /* @__PURE__ */ Object.assign(createValidate, validatePure);
function halt(name) {
  throw new Error(`Error on typia.${name}(): no transform has been configured. Read and follow https://typia.io/docs/setup please.`);
}
const validate = /* @__PURE__ */ (() => {
  const $io0 = (input) => "string" === typeof input.email && /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(input.email) && ("string" === typeof input.id && /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(input.id)) && ("number" === typeof input.age && (Math.floor(input.age) === input.age && 0 <= input.age && input.age <= 4294967295 && 19 < input.age && input.age <= 100));
  const $vo0 = (input, _path, _exceptionable = true) => ["string" === typeof input.email && (/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(input.email) || $report2(_exceptionable, {
    path: _path + ".email",
    expected: 'string & Format<"email">',
    value: input.email
  })) || $report2(_exceptionable, {
    path: _path + ".email",
    expected: '(string & Format<"email">)',
    value: input.email
  }), "string" === typeof input.id && (/^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(input.id) || $report2(_exceptionable, {
    path: _path + ".id",
    expected: 'string & Format<"uuid">',
    value: input.id
  })) || $report2(_exceptionable, {
    path: _path + ".id",
    expected: '(string & Format<"uuid">)',
    value: input.id
  }), "number" === typeof input.age && (Math.floor(input.age) === input.age && 0 <= input.age && input.age <= 4294967295 || $report2(_exceptionable, {
    path: _path + ".age",
    expected: 'number & Type<"uint32">',
    value: input.age
  })) && (19 < input.age || $report2(_exceptionable, {
    path: _path + ".age",
    expected: "number & ExclusiveMinimum<19>",
    value: input.age
  })) && (input.age <= 100 || $report2(_exceptionable, {
    path: _path + ".age",
    expected: "number & Maximum<100>",
    value: input.age
  })) || $report2(_exceptionable, {
    path: _path + ".age",
    expected: '(number & Type<"uint32"> & ExclusiveMinimum<19> & Maximum<100>)',
    value: input.age
  })].every((flag) => flag);
  const __is = (input) => "object" === typeof input && null !== input && $io0(input);
  let errors;
  let $report2;
  return (input) => {
    if (false === __is(input)) {
      errors = [];
      $report2 = createValidatePure.report(errors);
      ((input2, _path, _exceptionable = true) => ("object" === typeof input2 && null !== input2 || $report2(true, {
        path: _path + "",
        expected: "IMember",
        value: input2
      })) && $vo0(input2, _path + "", true) || $report2(true, {
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
