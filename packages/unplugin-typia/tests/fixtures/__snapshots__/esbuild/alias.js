import typia from "typia";
const is = /* @__PURE__ */ (() => {
  return (input) => true;
})();
const random = /* @__PURE__ */ (() => {
  let _generator;
  return (generator) => {
    _generator = generator;
    return "any type used...";
  };
})();
const validate = /* @__PURE__ */ (() => {
  const __is = (input) => true;
  let errors;
  let $report;
  return (input) => {
    if (false === __is(input)) {
      errors = [];
      $report = typia.createValidate.report(errors);
      /* @__PURE__ */ ((input2, _path, _exceptionable = true) => true)(input, "$input", true);
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
