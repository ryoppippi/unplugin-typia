// alias.js
import typia from 'typia';

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
  return (input) => {
    if (false === __is()) {
      errors = [];
      typia.createValidate.report(errors);
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
random();
