// alias.js
import * as __typia_transform__validateReport from 'typia/lib/internal/_validateReport.js';

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
      __typia_transform__validateReport._validateReport(errors);
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
