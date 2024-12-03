var _isFormatEmail = {};
var hasRequired_isFormatEmail;
function require_isFormatEmail() {
  if (hasRequired_isFormatEmail) return _isFormatEmail;
  hasRequired_isFormatEmail = 1;
  Object.defineProperty(_isFormatEmail, "__esModule", { value: true });
  _isFormatEmail._isFormatEmail = void 0;
  const _isFormatEmail$1 = (str) => PATTERN.test(str);
  _isFormatEmail._isFormatEmail = _isFormatEmail$1;
  const PATTERN = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
  return _isFormatEmail;
}
var _isFormatEmailExports = /* @__PURE__ */ require_isFormatEmail();
var _isFormatUuid = {};
var hasRequired_isFormatUuid;
function require_isFormatUuid() {
  if (hasRequired_isFormatUuid) return _isFormatUuid;
  hasRequired_isFormatUuid = 1;
  Object.defineProperty(_isFormatUuid, "__esModule", { value: true });
  _isFormatUuid._isFormatUuid = void 0;
  const _isFormatUuid$1 = (str) => PATTERN.test(str);
  _isFormatUuid._isFormatUuid = _isFormatUuid$1;
  const PATTERN = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
  return _isFormatUuid;
}
var _isFormatUuidExports = /* @__PURE__ */ require_isFormatUuid();
var _isTypeUint32 = {};
var hasRequired_isTypeUint32;
function require_isTypeUint32() {
  if (hasRequired_isTypeUint32) return _isTypeUint32;
  hasRequired_isTypeUint32 = 1;
  Object.defineProperty(_isTypeUint32, "__esModule", { value: true });
  _isTypeUint32._isTypeUint32 = void 0;
  const _isTypeUint32$1 = (value) => Math.floor(value) === value && MINIMUM <= value && value <= MAXIMUM;
  _isTypeUint32._isTypeUint32 = _isTypeUint32$1;
  const MINIMUM = 0;
  const MAXIMUM = Math.pow(2, 32) - 1;
  return _isTypeUint32;
}
var _isTypeUint32Exports = /* @__PURE__ */ require_isTypeUint32();
var _randomFormatEmail = {};
var _randomString = {};
var _randomInteger = {};
var hasRequired_randomInteger;
function require_randomInteger() {
  if (hasRequired_randomInteger) return _randomInteger;
  hasRequired_randomInteger = 1;
  Object.defineProperty(_randomInteger, "__esModule", { value: true });
  _randomInteger._randomInteger = void 0;
  const _randomInteger$1 = (props) => {
    var _a, _b, _c, _d;
    let minimum = (_a = props.minimum) !== null && _a !== void 0 ? _a : ((_b = props.multipleOf) !== null && _b !== void 0 ? _b : 1) * (props.maximum === void 0 ? 0 : props.maximum - 100);
    if (props.minimum !== void 0 && props.exclusiveMinimum === true)
      minimum++;
    let maximum = (_c = props.maximum) !== null && _c !== void 0 ? _c : ((_d = props.multipleOf) !== null && _d !== void 0 ? _d : 1) * (props.minimum === void 0 ? 100 : props.minimum + 100);
    if (props.maximum !== void 0 && props.exclusiveMaximum === true)
      maximum--;
    if (minimum > maximum)
      throw new Error("Minimum value is greater than maximum value.");
    return props.multipleOf === void 0 ? scalar({
      minimum,
      maximum
    }) : multiple({
      minimum,
      maximum,
      multipleOf: props.multipleOf
    });
  };
  _randomInteger._randomInteger = _randomInteger$1;
  const scalar = (p) => Math.floor(Math.random() * (p.maximum - p.minimum + 1)) + p.minimum;
  const multiple = (p) => {
    const minimum = Math.ceil(p.minimum / p.multipleOf) * p.multipleOf;
    const maximum = Math.floor(p.maximum / p.multipleOf) * p.multipleOf;
    if (minimum > maximum)
      throw new Error("The range of the integer is smaller than the multipleOf value.");
    const value = scalar({
      minimum,
      maximum
    });
    return value - value % p.multipleOf;
  };
  return _randomInteger;
}
var hasRequired_randomString;
function require_randomString() {
  if (hasRequired_randomString) return _randomString;
  hasRequired_randomString = 1;
  Object.defineProperty(_randomString, "__esModule", { value: true });
  _randomString._randomString = void 0;
  const _randomInteger_1 = /* @__PURE__ */ require_randomInteger();
  const _randomString$1 = (props) => {
    var _a;
    const length = (0, _randomInteger_1._randomInteger)({
      type: "integer",
      minimum: (_a = props.minLength) !== null && _a !== void 0 ? _a : 0,
      maximum: props.maxLength
    });
    return new Array(length).fill(0).map(() => ALPHABETS[random2()]).join("");
  };
  _randomString._randomString = _randomString$1;
  const ALPHABETS = "abcdefghijklmnopqrstuvwxyz";
  const random2 = () => (0, _randomInteger_1._randomInteger)({
    type: "integer",
    minimum: 0,
    maximum: ALPHABETS.length - 1
  });
  return _randomString;
}
var hasRequired_randomFormatEmail;
function require_randomFormatEmail() {
  if (hasRequired_randomFormatEmail) return _randomFormatEmail;
  hasRequired_randomFormatEmail = 1;
  Object.defineProperty(_randomFormatEmail, "__esModule", { value: true });
  _randomFormatEmail._randomFormatEmail = void 0;
  const _randomString_1 = /* @__PURE__ */ require_randomString();
  const _randomFormatEmail$1 = () => `${random2(10)}@${random2(10)}.${random2(3)}`;
  _randomFormatEmail._randomFormatEmail = _randomFormatEmail$1;
  const random2 = (length) => (0, _randomString_1._randomString)({
    type: "string",
    minLength: length,
    maxLength: length
  });
  return _randomFormatEmail;
}
var _randomFormatEmailExports = /* @__PURE__ */ require_randomFormatEmail();
var _randomFormatUuid = {};
var hasRequired_randomFormatUuid;
function require_randomFormatUuid() {
  if (hasRequired_randomFormatUuid) return _randomFormatUuid;
  hasRequired_randomFormatUuid = 1;
  Object.defineProperty(_randomFormatUuid, "__esModule", { value: true });
  _randomFormatUuid._randomFormatUuid = void 0;
  const _randomFormatUuid$1 = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
  _randomFormatUuid._randomFormatUuid = _randomFormatUuid$1;
  return _randomFormatUuid;
}
var _randomFormatUuidExports = /* @__PURE__ */ require_randomFormatUuid();
var _randomIntegerExports = /* @__PURE__ */ require_randomInteger();
var _validateReport = {};
var hasRequired_validateReport;
function require_validateReport() {
  if (hasRequired_validateReport) return _validateReport;
  hasRequired_validateReport = 1;
  Object.defineProperty(_validateReport, "__esModule", { value: true });
  _validateReport._validateReport = void 0;
  const _validateReport$1 = (array) => {
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
  _validateReport._validateReport = _validateReport$1;
  return _validateReport;
}
var _validateReportExports = /* @__PURE__ */ require_validateReport();
const is = /* @__PURE__ */ (() => {
  const _io0 = (input) => "string" === typeof input.email && _isFormatEmailExports._isFormatEmail(input.email) && ("string" === typeof input.id && _isFormatUuidExports._isFormatUuid(input.id)) && ("number" === typeof input.age && (_isTypeUint32Exports._isTypeUint32(input.age) && 19 < input.age && input.age <= 100));
  return (input) => "object" === typeof input && null !== input && _io0(input);
})();
const random = /* @__PURE__ */ (() => {
  const _ro0 = (_recursive = false, _depth = 0) => ({
    email: ((_generator == null ? void 0 : _generator.email) ?? _randomFormatEmailExports._randomFormatEmail)(),
    id: ((_generator == null ? void 0 : _generator.uuid) ?? _randomFormatUuidExports._randomFormatUuid)(),
    age: ((_generator == null ? void 0 : _generator.integer) ?? _randomIntegerExports._randomInteger)({
      type: "integer",
      exclusiveMinimum: true,
      minimum: 19,
      maximum: 100
    })
  });
  let _generator;
  return (generator) => {
    _generator = generator;
    return _ro0();
  };
})();
const validate = /* @__PURE__ */ (() => {
  const _io0 = (input) => "string" === typeof input.email && _isFormatEmailExports._isFormatEmail(input.email) && ("string" === typeof input.id && _isFormatUuidExports._isFormatUuid(input.id)) && ("number" === typeof input.age && (_isTypeUint32Exports._isTypeUint32(input.age) && 19 < input.age && input.age <= 100));
  const _vo0 = (input, _path, _exceptionable = true) => ["string" === typeof input.email && (_isFormatEmailExports._isFormatEmail(input.email) || _report(_exceptionable, {
    path: _path + ".email",
    expected: 'string & Format<"email">',
    value: input.email
  })) || _report(_exceptionable, {
    path: _path + ".email",
    expected: '(string & Format<"email">)',
    value: input.email
  }), "string" === typeof input.id && (_isFormatUuidExports._isFormatUuid(input.id) || _report(_exceptionable, {
    path: _path + ".id",
    expected: 'string & Format<"uuid">',
    value: input.id
  })) || _report(_exceptionable, {
    path: _path + ".id",
    expected: '(string & Format<"uuid">)',
    value: input.id
  }), "number" === typeof input.age && (_isTypeUint32Exports._isTypeUint32(input.age) || _report(_exceptionable, {
    path: _path + ".age",
    expected: 'number & Type<"uint32">',
    value: input.age
  })) && (19 < input.age || _report(_exceptionable, {
    path: _path + ".age",
    expected: "number & ExclusiveMinimum<19>",
    value: input.age
  })) && (input.age <= 100 || _report(_exceptionable, {
    path: _path + ".age",
    expected: "number & Maximum<100>",
    value: input.age
  })) || _report(_exceptionable, {
    path: _path + ".age",
    expected: '(number & Type<"uint32"> & ExclusiveMinimum<19> & Maximum<100>)',
    value: input.age
  })].every((flag) => flag);
  const __is = (input) => "object" === typeof input && null !== input && _io0(input);
  let errors;
  let _report;
  return (input) => {
    if (false === __is(input)) {
      errors = [];
      _report = _validateReportExports._validateReport(errors);
      ((input2, _path, _exceptionable = true) => ("object" === typeof input2 && null !== input2 || _report(true, {
        path: _path + "",
        expected: "IMember",
        value: input2
      })) && _vo0(input2, _path + "", true) || _report(true, {
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
