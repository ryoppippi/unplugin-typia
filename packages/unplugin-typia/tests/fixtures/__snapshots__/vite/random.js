function getAugmentedNamespace(n) {
  if (Object.prototype.hasOwnProperty.call(n, "__esModule")) return n;
  var f = n.default;
  if (typeof f == "function") {
    var a = function a2() {
      if (this instanceof a2) {
        return Reflect.construct(f, arguments, this.constructor);
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
var _randomFormatEmail = {};
const _randomInteger$1 = (props) => {
  let minimum = props.minimum ?? (props.multipleOf ?? 1) * (props.maximum === void 0 ? 0 : props.maximum - 100);
  if (props.minimum !== void 0 && props.exclusiveMinimum === true)
    minimum++;
  let maximum = props.maximum ?? (props.multipleOf ?? 1) * (props.minimum === void 0 ? 100 : props.minimum + 100);
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
const _randomString = (props) => {
  const length = _randomInteger$1({
    minimum: props.minLength ?? 0,
    maximum: props.maxLength
  });
  return new Array(length).fill(0).map(() => ALPHABETS[random$1()]).join("");
};
const ALPHABETS = "abcdefghijklmnopqrstuvwxyz";
const random$1 = () => _randomInteger$1({
  minimum: 0,
  maximum: ALPHABETS.length - 1
});
const _randomString$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _randomString
}, Symbol.toStringTag, { value: "Module" }));
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(_randomString$1);
var hasRequired_randomFormatEmail;
function require_randomFormatEmail() {
  if (hasRequired_randomFormatEmail) return _randomFormatEmail;
  hasRequired_randomFormatEmail = 1;
  Object.defineProperty(_randomFormatEmail, "__esModule", { value: true });
  _randomFormatEmail._randomFormatEmail = void 0;
  const _randomString_1 = require$$0;
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
var _randomInteger = {};
var hasRequired_randomInteger;
function require_randomInteger() {
  if (hasRequired_randomInteger) return _randomInteger;
  hasRequired_randomInteger = 1;
  Object.defineProperty(_randomInteger, "__esModule", { value: true });
  _randomInteger._randomInteger = void 0;
  const _randomInteger$12 = (props) => {
    var _a, _b, _c, _d;
    let minimum = (_a = props.minimum) !== null && _a !== void 0 ? _a : ((_b = props.multipleOf) !== null && _b !== void 0 ? _b : 1) * (props.maximum === void 0 ? 0 : props.maximum - 100);
    if (props.minimum !== void 0 && props.exclusiveMinimum === true)
      minimum++;
    let maximum = (_c = props.maximum) !== null && _c !== void 0 ? _c : ((_d = props.multipleOf) !== null && _d !== void 0 ? _d : 1) * (props.minimum === void 0 ? 100 : props.minimum + 100);
    if (props.maximum !== void 0 && props.exclusiveMaximum === true)
      maximum--;
    if (minimum > maximum)
      throw new Error("Minimum value is greater than maximum value.");
    return props.multipleOf === void 0 ? scalar2({
      minimum,
      maximum
    }) : multiple2({
      minimum,
      maximum,
      multipleOf: props.multipleOf
    });
  };
  _randomInteger._randomInteger = _randomInteger$12;
  const scalar2 = (p) => Math.floor(Math.random() * (p.maximum - p.minimum + 1)) + p.minimum;
  const multiple2 = (p) => {
    const minimum = Math.ceil(p.minimum / p.multipleOf) * p.multipleOf;
    const maximum = Math.floor(p.maximum / p.multipleOf) * p.multipleOf;
    if (minimum > maximum)
      throw new Error("The range of the integer is smaller than the multipleOf value.");
    const value = scalar2({
      minimum,
      maximum
    });
    return value - value % p.multipleOf;
  };
  return _randomInteger;
}
var _randomIntegerExports = /* @__PURE__ */ require_randomInteger();
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
random();
