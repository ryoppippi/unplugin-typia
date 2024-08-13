var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};

// ../../node_modules/typia/lib/module.mjs
var module_exports = {};
__export(module_exports, {
  TypeGuardError: () => TypeGuardError,
  assert: () => assertPure,
  assertEquals: () => assertEqualsPure,
  assertGuard: () => assertGuardPure,
  assertGuardEquals: () => assertGuardEqualsPure,
  createAssert: () => createAssertPure,
  createAssertEquals: () => createAssertEqualsPure,
  createAssertGuard: () => createAssertGuardPure,
  createAssertGuardEquals: () => createAssertGuardEqualsPure,
  createEquals: () => createEqualsPure,
  createIs: () => createIsPure,
  createRandom: () => createRandomPure,
  createValidate: () => createValidatePure,
  createValidateEquals: () => createValidateEqualsPure,
  equals: () => equalsPure,
  functional: () => functional_exports,
  http: () => http_exports,
  is: () => isPure,
  json: () => json_exports,
  misc: () => misc_exports,
  notations: () => notations_exports,
  protobuf: () => protobuf_exports,
  random: () => randomPure,
  reflect: () => reflect_exports,
  tags: () => tags_exports,
  validate: () => validatePure,
  validateEquals: () => validateEqualsPure
});

// ../../node_modules/typia/lib/utils/RandomGenerator/RandomGenerator.mjs
var RandomGenerator_exports = {};
__export(RandomGenerator_exports, {
  array: () => array,
  bigint: () => bigint,
  boolean: () => boolean,
  byte: () => byte,
  date: () => date,
  datetime: () => datetime,
  duration: () => duration,
  email: () => email,
  hostname: () => hostname,
  idnEmail: () => idnEmail,
  idnHostname: () => idnHostname,
  integer: () => integer,
  ipv4: () => ipv4,
  ipv6: () => ipv6,
  iri: () => iri,
  iriReference: () => iriReference,
  jsonPointer: () => jsonPointer,
  length: () => length,
  number: () => number,
  password: () => password,
  pattern: () => pattern,
  pick: () => pick,
  regex: () => regex,
  relativeJsonPointer: () => relativeJsonPointer,
  string: () => string,
  time: () => time,
  uri: () => uri,
  uriReference: () => uriReference,
  uriTemplate: () => uriTemplate,
  url: () => url,
  uuid: () => uuid
});

// ../../node_modules/typia/lib/_virtual/_commonjsHelpers.mjs
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}

// ../../node_modules/typia/lib/_virtual/index.mjs
var lib = { exports: {} };

// ../../node_modules/typia/lib/_virtual/util.mjs
var util = {};

// ../../node_modules/typia/lib/_external/node_modules_ret_lib/types.mjs
var types = {
  ROOT: 0,
  GROUP: 1,
  POSITION: 2,
  SET: 3,
  RANGE: 4,
  REPETITION: 5,
  REFERENCE: 6,
  CHAR: 7
};

// ../../node_modules/typia/lib/_virtual/sets.mjs
var sets = {};

// ../../node_modules/typia/lib/_virtual/positions.mjs
var positions = {};

// ../../node_modules/typia/lib/_external/node_modules_ret_lib/index.mjs
var util2 = util;
var types2 = types;
var sets2 = sets;
var positions2 = positions;
lib.exports = (regexpStr) => {
  var i = 0, l, c, start = { type: types2.ROOT, stack: [] }, lastGroup = start, last = start.stack, groupStack = [];
  var repeatErr = (i2) => {
    util2.error(regexpStr, `Nothing to repeat at column ${i2 - 1}`);
  };
  var str = util2.strToChars(regexpStr);
  l = str.length;
  while (i < l) {
    c = str[i++];
    switch (c) {
      case "\\":
        c = str[i++];
        switch (c) {
          case "b":
            last.push(positions2.wordBoundary());
            break;
          case "B":
            last.push(positions2.nonWordBoundary());
            break;
          case "w":
            last.push(sets2.words());
            break;
          case "W":
            last.push(sets2.notWords());
            break;
          case "d":
            last.push(sets2.ints());
            break;
          case "D":
            last.push(sets2.notInts());
            break;
          case "s":
            last.push(sets2.whitespace());
            break;
          case "S":
            last.push(sets2.notWhitespace());
            break;
          default:
            if (/\d/.test(c)) {
              last.push({ type: types2.REFERENCE, value: parseInt(c, 10) });
            } else {
              last.push({ type: types2.CHAR, value: c.charCodeAt(0) });
            }
        }
        break;
      case "^":
        last.push(positions2.begin());
        break;
      case "$":
        last.push(positions2.end());
        break;
      case "[":
        var not;
        if (str[i] === "^") {
          not = true;
          i++;
        } else {
          not = false;
        }
        var classTokens = util2.tokenizeClass(str.slice(i), regexpStr);
        i += classTokens[1];
        last.push({
          type: types2.SET,
          set: classTokens[0],
          not
        });
        break;
      case ".":
        last.push(sets2.anyChar());
        break;
      case "(":
        var group = {
          type: types2.GROUP,
          stack: [],
          remember: true
        };
        c = str[i];
        if (c === "?") {
          c = str[i + 1];
          i += 2;
          if (c === "=") {
            group.followedBy = true;
          } else if (c === "!") {
            group.notFollowedBy = true;
          } else if (c !== ":") {
            util2.error(
              regexpStr,
              `Invalid group, character '${c}' after '?' at column ${i - 1}`
            );
          }
          group.remember = false;
        }
        last.push(group);
        groupStack.push(lastGroup);
        lastGroup = group;
        last = group.stack;
        break;
      case ")":
        if (groupStack.length === 0) {
          util2.error(regexpStr, `Unmatched ) at column ${i - 1}`);
        }
        lastGroup = groupStack.pop();
        last = lastGroup.options ? lastGroup.options[lastGroup.options.length - 1] : lastGroup.stack;
        break;
      case "|":
        if (!lastGroup.options) {
          lastGroup.options = [lastGroup.stack];
          delete lastGroup.stack;
        }
        var stack = [];
        lastGroup.options.push(stack);
        last = stack;
        break;
      case "{":
        var rs = /^(\d+)(,(\d+)?)?\}/.exec(str.slice(i)), min, max;
        if (rs !== null) {
          if (last.length === 0) {
            repeatErr(i);
          }
          min = parseInt(rs[1], 10);
          max = rs[2] ? rs[3] ? parseInt(rs[3], 10) : Infinity : min;
          i += rs[0].length;
          last.push({
            type: types2.REPETITION,
            min,
            max,
            value: last.pop()
          });
        } else {
          last.push({
            type: types2.CHAR,
            value: 123
          });
        }
        break;
      case "?":
        if (last.length === 0) {
          repeatErr(i);
        }
        last.push({
          type: types2.REPETITION,
          min: 0,
          max: 1,
          value: last.pop()
        });
        break;
      case "+":
        if (last.length === 0) {
          repeatErr(i);
        }
        last.push({
          type: types2.REPETITION,
          min: 1,
          max: Infinity,
          value: last.pop()
        });
        break;
      case "*":
        if (last.length === 0) {
          repeatErr(i);
        }
        last.push({
          type: types2.REPETITION,
          min: 0,
          max: Infinity,
          value: last.pop()
        });
        break;
      default:
        last.push({
          type: types2.CHAR,
          value: c.charCodeAt(0)
        });
    }
  }
  if (groupStack.length !== 0) {
    util2.error(regexpStr, "Unterminated group");
  }
  return start;
};
lib.exports.types = types2;
var libExports = lib.exports;

// ../../node_modules/typia/lib/_external/node_modules_drange_lib/index.mjs
var SubRange = class _SubRange {
  constructor(low, high) {
    this.low = low;
    this.high = high;
    this.length = 1 + high - low;
  }
  overlaps(range) {
    return !(this.high < range.low || this.low > range.high);
  }
  touches(range) {
    return !(this.high + 1 < range.low || this.low - 1 > range.high);
  }
  // Returns inclusive combination of SubRanges as a SubRange.
  add(range) {
    return new _SubRange(
      Math.min(this.low, range.low),
      Math.max(this.high, range.high)
    );
  }
  // Returns subtraction of SubRanges as an array of SubRanges.
  // (There's a case where subtraction divides it in 2)
  subtract(range) {
    if (range.low <= this.low && range.high >= this.high) {
      return [];
    } else if (range.low > this.low && range.high < this.high) {
      return [
        new _SubRange(this.low, range.low - 1),
        new _SubRange(range.high + 1, this.high)
      ];
    } else if (range.low <= this.low) {
      return [new _SubRange(range.high + 1, this.high)];
    } else {
      return [new _SubRange(this.low, range.low - 1)];
    }
  }
  toString() {
    return this.low == this.high ? this.low.toString() : this.low + "-" + this.high;
  }
};
var DRange = class _DRange {
  constructor(a, b) {
    this.ranges = [];
    this.length = 0;
    if (a != null) this.add(a, b);
  }
  _update_length() {
    this.length = this.ranges.reduce((previous, range) => {
      return previous + range.length;
    }, 0);
  }
  add(a, b) {
    var _add = (subrange) => {
      var i = 0;
      while (i < this.ranges.length && !subrange.touches(this.ranges[i])) {
        i++;
      }
      var newRanges = this.ranges.slice(0, i);
      while (i < this.ranges.length && subrange.touches(this.ranges[i])) {
        subrange = subrange.add(this.ranges[i]);
        i++;
      }
      newRanges.push(subrange);
      this.ranges = newRanges.concat(this.ranges.slice(i));
      this._update_length();
    };
    if (a instanceof _DRange) {
      a.ranges.forEach(_add);
    } else {
      if (b == null) b = a;
      _add(new SubRange(a, b));
    }
    return this;
  }
  subtract(a, b) {
    var _subtract = (subrange) => {
      var i = 0;
      while (i < this.ranges.length && !subrange.overlaps(this.ranges[i])) {
        i++;
      }
      var newRanges = this.ranges.slice(0, i);
      while (i < this.ranges.length && subrange.overlaps(this.ranges[i])) {
        newRanges = newRanges.concat(this.ranges[i].subtract(subrange));
        i++;
      }
      this.ranges = newRanges.concat(this.ranges.slice(i));
      this._update_length();
    };
    if (a instanceof _DRange) {
      a.ranges.forEach(_subtract);
    } else {
      if (b == null) b = a;
      _subtract(new SubRange(a, b));
    }
    return this;
  }
  intersect(a, b) {
    var newRanges = [];
    var _intersect = (subrange) => {
      var i = 0;
      while (i < this.ranges.length && !subrange.overlaps(this.ranges[i])) {
        i++;
      }
      while (i < this.ranges.length && subrange.overlaps(this.ranges[i])) {
        var low = Math.max(this.ranges[i].low, subrange.low);
        var high = Math.min(this.ranges[i].high, subrange.high);
        newRanges.push(new SubRange(low, high));
        i++;
      }
    };
    if (a instanceof _DRange) {
      a.ranges.forEach(_intersect);
    } else {
      if (b == null) b = a;
      _intersect(new SubRange(a, b));
    }
    this.ranges = newRanges;
    this._update_length();
    return this;
  }
  index(index) {
    var i = 0;
    while (i < this.ranges.length && this.ranges[i].length <= index) {
      index -= this.ranges[i].length;
      i++;
    }
    return this.ranges[i].low + index;
  }
  toString() {
    return "[ " + this.ranges.join(", ") + " ]";
  }
  clone() {
    return new _DRange(this);
  }
  numbers() {
    return this.ranges.reduce((result, subrange) => {
      var i = subrange.low;
      while (i <= subrange.high) {
        result.push(i);
        i++;
      }
      return result;
    }, []);
  }
  subranges() {
    return this.ranges.map((subrange) => ({
      low: subrange.low,
      high: subrange.high,
      length: 1 + subrange.high - subrange.low
    }));
  }
};
var lib2 = DRange;

// ../../node_modules/typia/lib/_external/node_modules_randexp_lib/randexp.mjs
var ret = libExports;
var DRange2 = lib2;
var types3 = ret.types;
var randexp = class RandExp {
  /**
   * @constructor
   * @param {RegExp|String} regexp
   * @param {String} m
   */
  constructor(regexp, m) {
    this._setDefaults(regexp);
    if (regexp instanceof RegExp) {
      this.ignoreCase = regexp.ignoreCase;
      this.multiline = regexp.multiline;
      regexp = regexp.source;
    } else if (typeof regexp === "string") {
      this.ignoreCase = m && m.indexOf("i") !== -1;
      this.multiline = m && m.indexOf("m") !== -1;
    } else {
      throw new Error("Expected a regexp or string");
    }
    this.tokens = ret(regexp);
  }
  /**
   * Checks if some custom properties have been set for this regexp.
   *
   * @param {RandExp} randexp
   * @param {RegExp} regexp
   */
  _setDefaults(regexp) {
    this.max = regexp.max != null ? regexp.max : RandExp.prototype.max != null ? RandExp.prototype.max : 100;
    this.defaultRange = regexp.defaultRange ? regexp.defaultRange : this.defaultRange.clone();
    if (regexp.randInt) {
      this.randInt = regexp.randInt;
    }
  }
  /**
   * Generates the random string.
   *
   * @return {String}
   */
  gen() {
    return this._gen(this.tokens, []);
  }
  /**
   * Generate random string modeled after given tokens.
   *
   * @param {Object} token
   * @param {Array.<String>} groups
   * @return {String}
   */
  _gen(token, groups) {
    var stack, str, n, i, l;
    switch (token.type) {
      case types3.ROOT:
      case types3.GROUP:
        if (token.followedBy || token.notFollowedBy) {
          return "";
        }
        if (token.remember && token.groupNumber === void 0) {
          token.groupNumber = groups.push(null) - 1;
        }
        stack = token.options ? this._randSelect(token.options) : token.stack;
        str = "";
        for (i = 0, l = stack.length; i < l; i++) {
          str += this._gen(stack[i], groups);
        }
        if (token.remember) {
          groups[token.groupNumber] = str;
        }
        return str;
      case types3.POSITION:
        return "";
      case types3.SET:
        var expandedSet = this._expand(token);
        if (!expandedSet.length) {
          return "";
        }
        return String.fromCharCode(this._randSelect(expandedSet));
      case types3.REPETITION:
        n = this.randInt(
          token.min,
          token.max === Infinity ? token.min + this.max : token.max
        );
        str = "";
        for (i = 0; i < n; i++) {
          str += this._gen(token.value, groups);
        }
        return str;
      case types3.REFERENCE:
        return groups[token.value - 1] || "";
      case types3.CHAR:
        var code = this.ignoreCase && this._randBool() ? this._toOtherCase(token.value) : token.value;
        return String.fromCharCode(code);
    }
  }
  /**
   * If code is alphabetic, converts to other case.
   * If not alphabetic, returns back code.
   *
   * @param {Number} code
   * @return {Number}
   */
  _toOtherCase(code) {
    return code + (97 <= code && code <= 122 ? -32 : 65 <= code && code <= 90 ? 32 : 0);
  }
  /**
   * Randomly returns a true or false value.
   *
   * @return {Boolean}
   */
  _randBool() {
    return !this.randInt(0, 1);
  }
  /**
   * Randomly selects and returns a value from the array.
   *
   * @param {Array.<Object>} arr
   * @return {Object}
   */
  _randSelect(arr) {
    if (arr instanceof DRange2) {
      return arr.index(this.randInt(0, arr.length - 1));
    }
    return arr[this.randInt(0, arr.length - 1)];
  }
  /**
   * expands a token to a DiscontinuousRange of characters which has a
   * length and an index function (for random selecting)
   *
   * @param {Object} token
   * @return {DiscontinuousRange}
   */
  _expand(token) {
    if (token.type === ret.types.CHAR) {
      return new DRange2(token.value);
    } else if (token.type === ret.types.RANGE) {
      return new DRange2(token.from, token.to);
    } else {
      let drange = new DRange2();
      for (let i = 0; i < token.set.length; i++) {
        let subrange = this._expand(token.set[i]);
        drange.add(subrange);
        if (this.ignoreCase) {
          for (let j = 0; j < subrange.length; j++) {
            let code = subrange.index(j);
            let otherCaseCode = this._toOtherCase(code);
            if (code !== otherCaseCode) {
              drange.add(otherCaseCode);
            }
          }
        }
      }
      if (token.not) {
        return this.defaultRange.clone().subtract(drange);
      } else {
        return this.defaultRange.clone().intersect(drange);
      }
    }
  }
  /**
   * Randomly generates and returns a number between a and b (inclusive).
   *
   * @param {Number} a
   * @param {Number} b
   * @return {Number}
   */
  randInt(a, b) {
    return a + Math.floor(Math.random() * (1 + b - a));
  }
  /**
   * Default range of characters to generate from.
   */
  get defaultRange() {
    return this._range = this._range || new DRange2(32, 126);
  }
  set defaultRange(range) {
    this._range = range;
  }
  /**
   *
   * Enables use of randexp with a shorter call.
   *
   * @param {RegExp|String| regexp}
   * @param {String} m
   * @return {String}
   */
  static randexp(regexp, m) {
    var randexp2;
    if (typeof regexp === "string") {
      regexp = new RegExp(regexp, m);
    }
    if (regexp._randexp === void 0) {
      randexp2 = new RandExp(regexp, m);
      regexp._randexp = randexp2;
    } else {
      randexp2 = regexp._randexp;
      randexp2._setDefaults(regexp);
    }
    return randexp2.gen();
  }
  /**
   * Enables sugary /regexp/.gen syntax.
   */
  static sugar() {
    RegExp.prototype.gen = function() {
      return RandExp.randexp(this);
    };
  }
};
var RandExp2 = /* @__PURE__ */ getDefaultExportFromCjs(randexp);

// ../../node_modules/typia/lib/utils/RandomGenerator/RandomGenerator.mjs
var ALPHABETS = "abcdefghijklmnopqrstuvwxyz";
var boolean = () => Math.random() < 0.5;
var integer = (min, max) => {
  min ??= 0;
  max ??= 100;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
var bigint = (min, max) => BigInt(integer(Number(min ?? BigInt(0)), Number(max ?? BigInt(100))));
var number = (min, max) => {
  min ??= 0;
  max ??= 100;
  return Math.random() * (max - min) + min;
};
var string = (length2) => new Array(length2 ?? integer(5, 10)).fill(0).map(() => ALPHABETS[integer(0, ALPHABETS.length - 1)]).join("");
var array = (closure, count, unique) => {
  count ??= length();
  unique ??= false;
  if (unique === false)
    return new Array(count ?? length()).fill(0).map((_e, index) => closure(index));
  else {
    const set = /* @__PURE__ */ new Set();
    while (set.size < count)
      set.add(closure(set.size));
    return Array.from(set);
  }
};
var pick = (array4) => array4[integer(0, array4.length - 1)];
var length = () => integer(0, 3);
var pattern = (regex2) => {
  const r = new RandExp2(regex2);
  for (let i = 0; i < 10; ++i) {
    const str = r.gen();
    if (regex2.test(str))
      return str;
  }
  return r.gen();
};
var byte = () => "vt7ekz4lIoNTTS9sDQYdWKharxIFAR54+z/umIxSgUM=";
var password = () => string(integer(4, 16));
var regex = () => "/^(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)$/";
var uuid = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0;
  const v = c === "x" ? r : r & 3 | 8;
  return v.toString(16);
});
var email = () => `${string(10)}@${string(10)}.${string(3)}`;
var hostname = () => `${string(10)}.${string(3)}`;
var idnEmail = () => email();
var idnHostname = () => hostname();
var iri = () => url();
var iriReference = () => url();
var ipv4 = () => array(() => integer(0, 255), 4).join(".");
var ipv6 = () => array(() => integer(0, 65535).toString(16), 8).join(":");
var uri = () => url();
var uriReference = () => url();
var uriTemplate = () => url();
var url = () => `https://${string(10)}.${string(3)}`;
var datetime = (min, max) => new Date(number(min ?? Date.now() - 30 * DAY, max ?? Date.now() + 7 * DAY)).toISOString();
var date = (min, max) => new Date(number(min ?? 0, max ?? Date.now() * 2)).toISOString().substring(0, 10);
var time = () => new Date(number(0, DAY)).toISOString().substring(11);
var duration = () => {
  const period = durate([
    ["Y", integer(0, 100)],
    ["M", integer(0, 12)],
    ["D", integer(0, 31)]
  ]);
  const time2 = durate([
    ["H", integer(0, 24)],
    ["M", integer(0, 60)],
    ["S", integer(0, 60)]
  ]);
  if (period.length + time2.length === 0)
    return "PT0S";
  return `P${period}${time2.length ? "T" : ""}${time2}`;
};
var jsonPointer = () => `/components/schemas/${string(10)}`;
var relativeJsonPointer = () => `${integer(0, 10)}#`;
var DAY = 864e5;
var durate = (elements) => elements.filter(([_unit, value]) => value !== 0).map(([unit, value]) => `${value}${unit}`).join("");

// ../../node_modules/typia/lib/functional/_every.mjs
var $every = (array4, pred) => {
  let error = null;
  for (let i = 0; i < array4.length; ++i)
    if (null !== (error = pred(array4[i], i)))
      return error;
  return null;
};

// ../../node_modules/typia/lib/TypeGuardError.mjs
var TypeGuardError = class extends Error {
  method;
  path;
  expected;
  value;
  fake_expected_typed_value_;
  constructor(props) {
    super(props.message || `Error on ${props.method}(): invalid type${props.path ? ` on ${props.path}` : ""}, expect to be ${props.expected}`);
    const proto = new.target.prototype;
    if (Object.setPrototypeOf)
      Object.setPrototypeOf(this, proto);
    else
      this.__proto__ = proto;
    this.method = props.method;
    this.path = props.path;
    this.expected = props.expected;
    this.value = props.value;
  }
};

// ../../node_modules/typia/lib/functional/_guard.mjs
var $guard = (method) => (exceptionable, props, factory) => {
  if (exceptionable === true)
    throw (factory ?? ((props2) => new TypeGuardError(props2)))({
      method,
      path: props.path,
      expected: props.expected,
      value: props.value
    });
  return false;
};

// ../../node_modules/typia/lib/functional/_join.mjs
var $join = (str) => variable(str) ? `.${str}` : `[${JSON.stringify(str)}]`;
var variable = (str) => reserved(str) === false && /^[a-zA-Z_$][a-zA-Z_$0-9]*$/g.test(str);
var reserved = (str) => RESERVED.has(str);
var RESERVED = /* @__PURE__ */ new Set([
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

// ../../node_modules/typia/lib/functional/_report.mjs
var $report = (array4) => {
  const reportable = (path) => {
    if (array4.length === 0)
      return true;
    const last = array4[array4.length - 1].path;
    return path.length > last.length || last.substring(0, path.length) !== path;
  };
  return (exceptable, error) => {
    if (exceptable && reportable(error.path))
      array4.push(error);
    return false;
  };
};

// ../../node_modules/typia/lib/functional/_is_between.mjs
var $is_between = (value, minimum, maximum) => minimum <= value && value <= maximum;

// ../../node_modules/typia/lib/functional/_stoll.mjs
var $is_bigint_string = (str) => {
  try {
    BigInt(str);
    return true;
  } catch {
    return false;
  }
};

// ../../node_modules/typia/lib/functional/is.mjs
var is = () => ({
  is_between: $is_between,
  is_bigint_string: $is_bigint_string
});

// ../../node_modules/typia/lib/functional/Namespace/index.mjs
var assert = (method) => ({
  ...is(),
  join: $join,
  every: $every,
  guard: $guard(`typia.${method}`),
  predicate: (matched, exceptionable, closure) => {
    if (matched === false && exceptionable === true)
      throw new TypeGuardError({
        ...closure(),
        method: `typia.${method}`
      });
    return matched;
  }
});
var validate = () => ({
  ...is(),
  join: $join,
  report: $report,
  predicate: (res) => (matched, exceptionable, closure) => {
    if (matched === false && exceptionable === true)
      (() => {
        res.success &&= false;
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
var random = () => ({
  generator: RandomGenerator_exports,
  pick
});

// ../../node_modules/typia/lib/functional.mjs
var functional_exports = {};
__export(functional_exports, {
  assertEqualsFunction: () => assertEqualsFunctionPure,
  assertEqualsParameters: () => assertEqualsParametersPure,
  assertEqualsReturn: () => assertEqualsReturnPure,
  assertFunction: () => assertFunctionPure,
  assertParameters: () => assertParametersPure,
  assertReturn: () => assertReturnPure,
  equalsFunction: () => equalsFunctionPure,
  equalsParameters: () => equalsParametersPure,
  equalsReturn: () => equalsReturnPure,
  isFunction: () => isFunctionPure,
  isParameters: () => isParametersPure,
  isReturn: () => isReturnPure,
  validateEqualsFunction: () => validateEqualsFunctionPure,
  validateEqualsParameters: () => validateEqualsParametersPure,
  validateEqualsReturn: () => validateEqualsReturnPure,
  validateFunction: () => validateFunctionPure,
  validateParameters: () => validateParametersPure,
  validateReturn: () => validateReturnPure
});

// ../../node_modules/typia/lib/functional/Namespace/functional.mjs
var functionalAssert = () => ({
  errorFactory: (p) => new TypeGuardError(p)
});

// ../../node_modules/typia/lib/functional.mjs
function assertFunction() {
  halt("assertFunction");
}
var assertFunctionPure = /* @__PURE__ */ Object.assign(
  assertFunction,
  /* @__PURE__ */ assert("functional.assertFunction"),
  /* @__PURE__ */ functionalAssert()
);
var assertParametersPure = /* @__PURE__ */ Object.assign(
  assertFunction,
  /* @__PURE__ */ assert("functional.assertFunction"),
  /* @__PURE__ */ functionalAssert()
);
function assertReturn() {
  halt("assertReturn");
}
var assertReturnPure = /* @__PURE__ */ Object.assign(
  assertReturn,
  /* @__PURE__ */ assert("functional.assertReturn"),
  /* @__PURE__ */ functionalAssert()
);
function assertEqualsFunction() {
  halt("assertEqualsFunction");
}
var assertEqualsFunctionPure = /* @__PURE__ */ Object.assign(
  assertEqualsFunction,
  /* @__PURE__ */ assert("functional.assertEqualsFunction"),
  /* @__PURE__ */ functionalAssert()
);
function assertEqualsParameters() {
  halt("assertEqualsParameters");
}
var assertEqualsParametersPure = /* @__PURE__ */ Object.assign(
  assertEqualsParameters,
  /* @__PURE__ */ assert("functional.assertEqualsParameters"),
  /* @__PURE__ */ functionalAssert()
);
function assertEqualsReturn() {
  halt("assertEqualsReturn");
}
var assertEqualsReturnPure = /* @__PURE__ */ Object.assign(
  assertEqualsReturn,
  /* @__PURE__ */ assert("functional.assertEqualsReturn"),
  /* @__PURE__ */ functionalAssert()
);
function isFunction() {
  halt("isFunction");
}
var isFunctionPure = /* @__PURE__ */ Object.assign(
  isFunction,
  /* @__PURE__ */ is()
);
function isParameters() {
  halt("isParameters");
}
var isParametersPure = /* @__PURE__ */ Object.assign(isParameters, /* @__PURE__ */ is());
function isReturn() {
  halt("isReturn");
}
var isReturnPure = /* @__PURE__ */ Object.assign(
  isReturn,
  /* @__PURE__ */ is()
);
function equalsFunction() {
  halt("equalsFunction");
}
var equalsFunctionPure = /* @__PURE__ */ Object.assign(equalsFunction, /* @__PURE__ */ is());
function equalsParameters() {
  halt("equalsParameters");
}
var equalsParametersPure = /* @__PURE__ */ Object.assign(equalsParameters, /* @__PURE__ */ is());
function equalsReturn() {
  halt("equalsReturn");
}
var equalsReturnPure = /* @__PURE__ */ Object.assign(equalsReturn, /* @__PURE__ */ is());
function validateFunction() {
  halt("validateFunction");
}
var validateFunctionPure = /* @__PURE__ */ Object.assign(validateFunction, /* @__PURE__ */ validate());
function validateParameters() {
  halt("validateReturn");
}
var validateParametersPure = /* @__PURE__ */ Object.assign(validateParameters, /* @__PURE__ */ validate());
function validateReturn() {
  halt("validateReturn");
}
var validateReturnPure = /* @__PURE__ */ Object.assign(validateReturn, /* @__PURE__ */ validate());
function validateEqualsFunction() {
  halt("validateEqualsFunction");
}
var validateEqualsFunctionPure = /* @__PURE__ */ Object.assign(validateEqualsFunction, /* @__PURE__ */ validate());
function validateEqualsParameters() {
  halt("validateEqualsParameters");
}
var validateEqualsParametersPure = /* @__PURE__ */ Object.assign(validateEqualsParameters, /* @__PURE__ */ validate());
function validateEqualsReturn() {
  halt("validateEqualsReturn");
}
var validateEqualsReturnPure = /* @__PURE__ */ Object.assign(validateEqualsReturn, /* @__PURE__ */ validate());
function halt(name2) {
  throw new Error(`Error on typia.functional.${name2}(): no transform has been configured. Read and follow https://typia.io/docs/setup please.`);
}

// ../../node_modules/typia/lib/http.mjs
var http_exports = {};
__export(http_exports, {
  assertFormData: () => assertFormDataPure,
  assertHeaders: () => assertHeadersPure,
  assertQuery: () => assertQueryPure,
  createAssertFormData: () => createAssertFormDataPure,
  createAssertHeaders: () => createAssertHeadersPure,
  createAssertQuery: () => createAssertQueryPure,
  createFormData: () => createFormDataPure,
  createHeaders: () => createHeadersPure,
  createIsFormData: () => createIsFormDataPure,
  createIsHeaders: () => createIsHeadersPure,
  createIsQuery: () => createIsQueryPure,
  createParameter: () => createParameterPure,
  createQuery: () => createQueryPure,
  createValidateFormData: () => createValidateFormDataPure,
  createValidateHeaders: () => createValidateHeadersPure,
  createValidateQuery: () => createValidateQueryPure,
  formData: () => formDataPure,
  headers: () => headersPure,
  isFormData: () => isFormDataPure,
  isHeaders: () => isHeadersPure,
  isQuery: () => isQueryPure,
  parameter: () => parameterPure,
  query: () => queryPure,
  validateFormData: () => validateFormDataPure,
  validateHeaders: () => validateHeadersPure,
  validateQuery: () => validateQueryPure
});

// ../../node_modules/typia/lib/functional/_FormDataReader/_FormDataReader.mjs
var FormDataReader_exports = {};
__export(FormDataReader_exports, {
  array: () => array2,
  bigint: () => bigint2,
  blob: () => blob,
  boolean: () => boolean2,
  file: () => file,
  number: () => number2,
  string: () => string2
});
var boolean2 = (input) => input instanceof File ? input : input === null ? void 0 : input === "null" ? null : input.length === 0 ? true : input === "true" || input === "1" ? true : input === "false" || input === "0" ? false : input;
var number2 = (input) => input instanceof File ? input : !!input?.length ? input === "null" ? null : toNumber(input) : void 0;
var bigint2 = (input) => input instanceof File ? input : !!input?.length ? input === "null" ? null : toBigint(input) : void 0;
var string2 = (input) => input instanceof File ? input : input === null ? void 0 : input === "null" ? null : input;
var array2 = (input, alternative) => input.length ? input : alternative;
var blob = (input) => input instanceof Blob ? input : input === null ? void 0 : input === "null" ? null : input;
var file = (input) => input instanceof File ? input : input === null ? void 0 : input === "null" ? null : input;
var toNumber = (str) => {
  const value = Number(str);
  return isNaN(value) ? str : value;
};
var toBigint = (str) => {
  try {
    return BigInt(str);
  } catch {
    return str;
  }
};

// ../../node_modules/typia/lib/functional/_HeadersReader/_HeadersReader.mjs
var HeadersReader_exports = {};
__export(HeadersReader_exports, {
  bigint: () => bigint3,
  boolean: () => boolean3,
  number: () => number3,
  string: () => string3
});
var boolean3 = (value) => value !== void 0 ? value === "true" ? true : value === "false" ? false : value : void 0;
var bigint3 = (value) => value !== void 0 ? toBigint2(value) : void 0;
var number3 = (value) => value !== void 0 ? toNumber2(value) : void 0;
var string3 = (value) => value;
var toBigint2 = (str) => {
  try {
    return BigInt(str);
  } catch {
    return str;
  }
};
var toNumber2 = (str) => {
  const value = Number(str);
  return isNaN(value) ? str : value;
};

// ../../node_modules/typia/lib/functional/_ParameterReader/_ParameterReader.mjs
var ParameterReader_exports = {};
__export(ParameterReader_exports, {
  bigint: () => bigint4,
  boolean: () => boolean4,
  number: () => number4,
  string: () => string4
});
var boolean4 = (value) => value !== "null" ? value === "true" || value === "1" ? true : value === "false" || value === "0" ? false : value : null;
var bigint4 = (value) => value !== "null" ? toBigint3(value) : null;
var number4 = (value) => value !== "null" ? toNumber3(value) : null;
var string4 = (value) => value !== "null" ? value : null;
var toNumber3 = (str) => {
  const value = Number(str);
  return isNaN(value) ? str : value;
};
var toBigint3 = (str) => {
  try {
    return BigInt(str);
  } catch {
    return str;
  }
};

// ../../node_modules/typia/lib/functional/_QueryReader/_QueryReader.mjs
var QueryReader_exports = {};
__export(QueryReader_exports, {
  array: () => array3,
  bigint: () => bigint5,
  boolean: () => boolean5,
  number: () => number5,
  params: () => params,
  string: () => string5
});
var boolean5 = (str) => str === null ? void 0 : str === "null" ? null : str.length === 0 ? true : str === "true" || str === "1" ? true : str === "false" || str === "0" ? false : str;
var number5 = (str) => !!str?.length ? str === "null" ? null : toNumber4(str) : void 0;
var bigint5 = (str) => !!str?.length ? str === "null" ? null : toBigint4(str) : void 0;
var string5 = (str) => str === null ? void 0 : str === "null" ? null : str;
var params = (input) => {
  if (typeof input === "string") {
    const index = input.indexOf("?");
    input = index === -1 ? "" : input.substring(index + 1);
    return new URLSearchParams(input);
  }
  return input;
};
var array3 = (input, alternative) => input.length ? input : alternative;
var toNumber4 = (str) => {
  const value = Number(str);
  return isNaN(value) ? str : value;
};
var toBigint4 = (str) => {
  try {
    return BigInt(str);
  } catch {
    return str;
  }
};

// ../../node_modules/typia/lib/functional/Namespace/http.mjs
var formData = () => FormDataReader_exports;
var headers = () => HeadersReader_exports;
var parameter = () => ParameterReader_exports;
var query = () => QueryReader_exports;

// ../../node_modules/typia/lib/http.mjs
function formData2() {
  halt2("formData");
}
var formDataPure = /* @__PURE__ */ Object.assign(
  formData2,
  /* @__PURE__ */ formData()
);
function assertFormData() {
  halt2("assertFormData");
}
var assertFormDataPure = /* @__PURE__ */ Object.assign(
  assertFormData,
  /* @__PURE__ */ formData(),
  /* @__PURE__ */ assert("http.assertFormData")
);
function isFormData() {
  halt2("isFormData");
}
var isFormDataPure = /* @__PURE__ */ Object.assign(
  isFormData,
  /* @__PURE__ */ formData(),
  /* @__PURE__ */ is()
);
function validateFormData() {
  halt2("validateFormData");
}
var validateFormDataPure = /* @__PURE__ */ Object.assign(
  validateFormData,
  /* @__PURE__ */ formData(),
  /* @__PURE__ */ validate()
);
function query2() {
  halt2("query");
}
var queryPure = /* @__PURE__ */ Object.assign(
  query2,
  /* @__PURE__ */ query()
);
function assertQuery() {
  halt2("assertQuery");
}
var assertQueryPure = /* @__PURE__ */ Object.assign(
  assertQuery,
  /* @__PURE__ */ query(),
  /* @__PURE__ */ assert("http.assertQuery")
);
function isQuery() {
  halt2("isQuery");
}
var isQueryPure = /* @__PURE__ */ Object.assign(
  isQuery,
  /* @__PURE__ */ query(),
  /* @__PURE__ */ is()
);
function validateQuery() {
  halt2("validateQuery");
}
var validateQueryPure = /* @__PURE__ */ Object.assign(
  validateQuery,
  /* @__PURE__ */ query(),
  /* @__PURE__ */ validate()
);
function headers2() {
  halt2("headers");
}
var headersPure = /* @__PURE__ */ Object.assign(
  headers2,
  /* @__PURE__ */ headers()
);
function assertHeaders() {
  halt2("assertHeaders");
}
var assertHeadersPure = /* @__PURE__ */ Object.assign(
  assertHeaders,
  /* @__PURE__ */ headers(),
  /* @__PURE__ */ assert("http.assertHeaders")
);
function isHeaders() {
  halt2("isHeaders");
}
var isHeadersPure = /* @__PURE__ */ Object.assign(
  isHeaders,
  /* @__PURE__ */ headers(),
  /* @__PURE__ */ is()
);
function validateHeaders() {
  halt2("validateHeaders");
}
var validateHeadersPure = /* @__PURE__ */ Object.assign(
  validateHeaders,
  /* @__PURE__ */ headers(),
  /* @__PURE__ */ validate()
);
function parameter2() {
  halt2("parameter");
}
var parameterPure = /* @__PURE__ */ Object.assign(
  parameter2,
  /* @__PURE__ */ parameter(),
  /* @__PURE__ */ assert("http.parameter")
);
function createFormData() {
  halt2("createFormData");
}
var createFormDataPure = /* @__PURE__ */ Object.assign(createFormData, /* @__PURE__ */ formData());
function createAssertFormData() {
  halt2("createAssertFormData");
}
var createAssertFormDataPure = /* @__PURE__ */ Object.assign(
  createAssertFormData,
  /* @__PURE__ */ formData(),
  /* @__PURE__ */ assert("http.createAssertFormData")
);
function createIsFormData() {
  halt2("createIsFormData");
}
var createIsFormDataPure = /* @__PURE__ */ Object.assign(
  createIsFormData,
  /* @__PURE__ */ formData(),
  /* @__PURE__ */ is()
);
function createValidateFormData() {
  halt2("createValidateFormData");
}
var createValidateFormDataPure = /* @__PURE__ */ Object.assign(
  createValidateFormData,
  /* @__PURE__ */ formData(),
  /* @__PURE__ */ validate()
);
function createQuery() {
  halt2("createQuery");
}
var createQueryPure = /* @__PURE__ */ Object.assign(
  createQuery,
  /* @__PURE__ */ query()
);
function createAssertQuery() {
  halt2("createAssertQuery");
}
var createAssertQueryPure = /* @__PURE__ */ Object.assign(
  createAssertQuery,
  /* @__PURE__ */ query(),
  /* @__PURE__ */ assert("http.createAssertQuery")
);
function createIsQuery() {
  halt2("createIsQuery");
}
var createIsQueryPure = /* @__PURE__ */ Object.assign(
  createIsQuery,
  /* @__PURE__ */ query(),
  /* @__PURE__ */ is()
);
function createValidateQuery() {
  halt2("createValidateQuery");
}
var createValidateQueryPure = /* @__PURE__ */ Object.assign(
  createValidateQuery,
  /* @__PURE__ */ query(),
  /* @__PURE__ */ validate()
);
function createHeaders() {
  halt2("createHeaders");
}
var createHeadersPure = /* @__PURE__ */ Object.assign(createHeaders, /* @__PURE__ */ headers());
function createAssertHeaders() {
  halt2("createAssertHeaders");
}
var createAssertHeadersPure = /* @__PURE__ */ Object.assign(
  createAssertHeaders,
  /* @__PURE__ */ headers(),
  /* @__PURE__ */ assert("http.createAssertHeaders")
);
function createIsHeaders() {
  halt2("createIsHeaders");
}
var createIsHeadersPure = /* @__PURE__ */ Object.assign(
  createIsHeaders,
  /* @__PURE__ */ headers(),
  /* @__PURE__ */ is()
);
function createValidateHeaders() {
  halt2("createValidateHeaders");
}
var createValidateHeadersPure = /* @__PURE__ */ Object.assign(
  createValidateHeaders,
  /* @__PURE__ */ headers(),
  /* @__PURE__ */ validate()
);
function createParameter() {
  halt2("createParameter");
}
var createParameterPure = /* @__PURE__ */ Object.assign(
  createParameter,
  /* @__PURE__ */ parameter(),
  /* @__PURE__ */ assert("http.createParameter")
);
function halt2(name2) {
  throw new Error(`Error on typia.http.${name2}(): no transform has been configured. Read and follow https://typia.io/docs/setup please.`);
}

// ../../node_modules/typia/lib/json.mjs
var json_exports = {};
__export(json_exports, {
  application: () => application,
  assertParse: () => assertParsePure,
  assertStringify: () => assertStringifyPure,
  createAssertParse: () => createAssertParsePure,
  createAssertStringify: () => createAssertStringifyPure,
  createIsParse: () => createIsParsePure,
  createIsStringify: () => createIsStringifyPure,
  createStringify: () => createStringifyPure,
  createValidateParse: () => createValidateParsePure,
  createValidateStringify: () => createValidateStringifyPure,
  isParse: () => isParsePure,
  isStringify: () => isStringifyPure,
  stringify: () => stringifyPure,
  validateParse: () => validateParsePure,
  validateStringify: () => validateStringifyPure
});

// ../../node_modules/typia/lib/functional/_number.mjs
var $number = (value) => {
  if (isFinite(value) === false)
    throw new TypeGuardError({
      method: "typia.json.stringify",
      expected: "number",
      value,
      message: "Error on typia.json.stringify(): infinite or not a number."
    });
  return value;
};

// ../../node_modules/typia/lib/functional/_rest.mjs
var $rest = (str) => {
  return str.length === 2 ? "" : "," + str.substring(1, str.length - 1);
};

// ../../node_modules/typia/lib/functional/_string.mjs
var $string = (str) => {
  const len = str.length;
  let result = "";
  let last = -1;
  let point = 255;
  for (var i = 0; i < len; i++) {
    point = str.charCodeAt(i);
    if (point < 32) {
      return JSON.stringify(str);
    }
    if (point >= 55296 && point <= 57343) {
      return JSON.stringify(str);
    }
    if (point === 34 || // '"'
    point === 92) {
      last === -1 && (last = 0);
      result += str.slice(last, i) + "\\";
      last = i;
    }
  }
  return last === -1 && '"' + str + '"' || '"' + result + str.slice(last) + '"';
};

// ../../node_modules/typia/lib/functional/_tail.mjs
var $tail = (str) => str[str.length - 1] === "," ? str.substring(0, str.length - 1) : str;

// ../../node_modules/typia/lib/functional/_throws.mjs
var $throws = (method) => (props) => {
  throw new TypeGuardError({
    ...props,
    method: `typia.${method}`
  });
};

// ../../node_modules/typia/lib/functional/Namespace/json.mjs
var stringify = (method) => ({
  ...is(),
  number: $number,
  string: $string,
  tail: $tail,
  rest: $rest,
  throws: $throws(`json.${method}`)
});

// ../../node_modules/typia/lib/json.mjs
function application() {
  halt3("application");
}
function assertParse() {
  halt3("assertParse");
}
var assertParsePure = /* @__PURE__ */ Object.assign(
  assertParse,
  /* @__PURE__ */ assert("json.assertParse")
);
function isParse() {
  halt3("isParse");
}
var isParsePure = /* @__PURE__ */ Object.assign(
  isParse,
  /* @__PURE__ */ is()
);
function validateParse() {
  halt3("validateParse");
}
var validateParsePure = /* @__PURE__ */ Object.assign(validateParse, /* @__PURE__ */ validate());
function stringify2() {
  halt3("stringify");
}
var stringifyPure = /* @__PURE__ */ Object.assign(
  stringify2,
  /* @__PURE__ */ stringify("stringify")
);
function assertStringify() {
  halt3("assertStringify");
}
var assertStringifyPure = /* @__PURE__ */ Object.assign(
  assertStringify,
  /* @__PURE__ */ assert("json.assertStringify"),
  /* @__PURE__ */ stringify("assertStringify")
);
function isStringify() {
  halt3("isStringify");
}
var isStringifyPure = /* @__PURE__ */ Object.assign(
  isStringify,
  /* @__PURE__ */ is(),
  /* @__PURE__ */ stringify("isStringify")
);
function validateStringify() {
  halt3("validateStringify");
}
var validateStringifyPure = /* @__PURE__ */ Object.assign(
  validateStringify,
  /* @__PURE__ */ validate(),
  /* @__PURE__ */ stringify("validateStringify")
);
function createIsParse() {
  halt3("createIsParse");
}
var createIsParsePure = /* @__PURE__ */ Object.assign(createIsParse, isParsePure);
function createAssertParse() {
  halt3("createAssertParse");
}
var createAssertParsePure = /* @__PURE__ */ Object.assign(createAssertParse, assertParsePure);
function createValidateParse() {
  halt3("createValidateParse");
}
var createValidateParsePure = /* @__PURE__ */ Object.assign(createValidateParse, validateParsePure);
function createStringify() {
  halt3("createStringify");
}
var createStringifyPure = /* @__PURE__ */ Object.assign(createStringify, stringifyPure);
function createAssertStringify() {
  halt3("createAssertStringify");
}
var createAssertStringifyPure = /* @__PURE__ */ Object.assign(createAssertStringify, assertStringifyPure);
function createIsStringify() {
  halt3("createIsStringify");
}
var createIsStringifyPure = /* @__PURE__ */ Object.assign(createIsStringify, isStringifyPure);
function createValidateStringify() {
  halt3("createValidateStringify");
}
var createValidateStringifyPure = /* @__PURE__ */ Object.assign(createValidateStringify, validateStringifyPure);
function halt3(name2) {
  throw new Error(`Error on typia.json.${name2}(): no transform has been configured. Read and follow https://typia.io/docs/setup please.`);
}

// ../../node_modules/typia/lib/misc.mjs
var misc_exports = {};
__export(misc_exports, {
  assertClone: () => assertClonePure,
  assertPrune: () => assertPrunePure,
  clone: () => clonePure,
  createAssertClone: () => createAssertClonePure,
  createAssertPrune: () => createAssertPrunePure,
  createClone: () => createClonePure,
  createIsClone: () => createIsClonePure,
  createIsPrune: () => createIsPrunePure,
  createPrune: () => createPrunePure,
  createValidateClone: () => createValidateClonePure,
  createValidatePrune: () => createValidatePrunePure,
  isClone: () => isClonePure,
  isPrune: () => isPrunePure,
  literals: () => literals,
  prune: () => prunePure,
  validateClone: () => validateClonePure,
  validatePrune: () => validatePrunePure
});

// ../../node_modules/typia/lib/functional/_clone.mjs
var $clone = (value) => $cloneMain(value);
var $cloneMain = (value) => {
  if (value === void 0)
    return void 0;
  else if (typeof value === "object")
    if (value === null)
      return null;
    else if (Array.isArray(value))
      return value.map($cloneMain);
    else if (value instanceof Date)
      return new Date(value);
    else if (value instanceof Uint8Array)
      return new Uint8Array(value);
    else if (value instanceof Uint8ClampedArray)
      return new Uint8ClampedArray(value);
    else if (value instanceof Uint16Array)
      return new Uint16Array(value);
    else if (value instanceof Uint32Array)
      return new Uint32Array(value);
    else if (value instanceof BigUint64Array)
      return new BigUint64Array(value);
    else if (value instanceof Int8Array)
      return new Int8Array(value);
    else if (value instanceof Int16Array)
      return new Int16Array(value);
    else if (value instanceof Int32Array)
      return new Int32Array(value);
    else if (value instanceof BigInt64Array)
      return new BigInt64Array(value);
    else if (value instanceof Float32Array)
      return new Float32Array(value);
    else if (value instanceof Float64Array)
      return new Float64Array(value);
    else if (value instanceof ArrayBuffer)
      return value.slice(0);
    else if (value instanceof SharedArrayBuffer)
      return value.slice(0);
    else if (value instanceof DataView)
      return new DataView(value.buffer.slice(0));
    else if (typeof File !== "undefined" && value instanceof File)
      return new File([value], value.name, { type: value.type });
    else if (typeof Blob !== "undefined" && value instanceof Blob)
      return new Blob([value], { type: value.type });
    else if (value instanceof Set)
      return new Set([...value].map($cloneMain));
    else if (value instanceof Map)
      return new Map([...value].map(([k, v]) => [$cloneMain(k), $cloneMain(v)]));
    else if (value instanceof WeakSet || value instanceof WeakMap)
      throw new Error("WeakSet and WeakMap are not supported");
    else if (value.valueOf() !== value)
      return $cloneMain(value.valueOf());
    else
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, $cloneMain(v)]).filter(([, v]) => v !== void 0));
  else if (typeof value === "function")
    return void 0;
  return value;
};

// ../../node_modules/typia/lib/functional/_any.mjs
var $any = (val) => $clone(val);

// ../../node_modules/typia/lib/functional/Namespace/misc.mjs
var clone = (method) => ({
  ...is(),
  throws: $throws(`misc.${method}`),
  any: $any
});
var prune = (method) => ({
  ...is(),
  throws: $throws(`misc.${method}`)
});

// ../../node_modules/typia/lib/misc.mjs
function literals() {
  halt4("literals");
}
function clone2() {
  halt4("clone");
}
var clonePure = /* @__PURE__ */ Object.assign(
  clone2,
  /* @__PURE__ */ clone("clone")
);
function assertClone() {
  halt4("assertClone");
}
var assertClonePure = /* @__PURE__ */ Object.assign(
  assertClone,
  /* @__PURE__ */ assert("misc.assertClone"),
  /* @__PURE__ */ clone("assertClone")
);
function isClone() {
  halt4("isClone");
}
var isClonePure = /* @__PURE__ */ Object.assign(
  isClone,
  /* @__PURE__ */ is(),
  /* @__PURE__ */ clone("isClone")
);
function validateClone() {
  halt4("validateClone");
}
var validateClonePure = /* @__PURE__ */ Object.assign(
  validateClone,
  /* @__PURE__ */ validate(),
  /* @__PURE__ */ clone("validateClone")
);
function prune2() {
  halt4("prune");
}
var prunePure = /* @__PURE__ */ Object.assign(
  prune2,
  /* @__PURE__ */ prune("prune")
);
function assertPrune() {
  halt4("assertPrune");
}
var assertPrunePure = /* @__PURE__ */ Object.assign(
  assertPrune,
  /* @__PURE__ */ assert("misc.assertPrune"),
  /* @__PURE__ */ prune("assertPrune")
);
function isPrune() {
  halt4("isPrune");
}
var isPrunePure = /* @__PURE__ */ Object.assign(
  isPrune,
  /* @__PURE__ */ is(),
  /* @__PURE__ */ prune("isPrune")
);
function validatePrune() {
  halt4("validatePrune");
}
var validatePrunePure = /* @__PURE__ */ Object.assign(
  validatePrune,
  /* @__PURE__ */ prune("validatePrune"),
  /* @__PURE__ */ validate()
);
function createClone() {
  halt4("createClone");
}
var createClonePure = /* @__PURE__ */ Object.assign(createClone, clonePure);
function createAssertClone() {
  halt4("createAssertClone");
}
var createAssertClonePure = /* @__PURE__ */ Object.assign(createAssertClone, assertClonePure);
function createIsClone() {
  halt4("createIsClone");
}
var createIsClonePure = /* @__PURE__ */ Object.assign(createIsClone, isClonePure);
function createValidateClone() {
  halt4("createValidateClone");
}
var createValidateClonePure = /* @__PURE__ */ Object.assign(createValidateClone, validateClonePure);
function createPrune() {
  halt4("createPrune");
}
var createPrunePure = /* @__PURE__ */ Object.assign(createPrune, prunePure);
function createAssertPrune() {
  halt4("createAssertPrune");
}
var createAssertPrunePure = /* @__PURE__ */ Object.assign(createAssertPrune, assertPrunePure);
function createIsPrune() {
  halt4("createIsPrune");
}
var createIsPrunePure = /* @__PURE__ */ Object.assign(createIsPrune, isPrunePure);
function createValidatePrune() {
  halt4("createValidatePrune");
}
var createValidatePrunePure = /* @__PURE__ */ Object.assign(createValidatePrune, validatePrunePure);
function halt4(name2) {
  throw new Error(`Error on typia.misc.${name2}(): no transform has been configured. Read and follow https://typia.io/docs/setup please.`);
}

// ../../node_modules/typia/lib/notations.mjs
var notations_exports = {};
__export(notations_exports, {
  assertCamel: () => assertCamelPure,
  assertPascal: () => assertPascalPure,
  assertSnake: () => assertSnakePure,
  camel: () => camelPure,
  createAssertCamel: () => createAssertCamelPure,
  createAssertPascal: () => createAssertPascalPure,
  createAssertSnake: () => createAssertSnakePure,
  createCamel: () => createCamelPure,
  createIsCamel: () => createIsCamelPure,
  createIsPascal: () => createIsPascalPure,
  createIsSnake: () => createIsSnakePure,
  createPascal: () => createPascalPure,
  createSnake: () => createSnakePure,
  createValidateCamel: () => createValidateCamelPure,
  createValidatePascal: () => createValidatePascalPure,
  createValidateSnake: () => createValidateSnakePure,
  isCamel: () => isCamelPure,
  isPascal: () => isPascalPure,
  isSnake: () => isSnakePure,
  pascal: () => pascalPure,
  snake: () => snakePure,
  validateCamel: () => validateCamelPure,
  validatePascal: () => validatePascalPure,
  validateSnake: () => validateSnakePure
});

// ../../node_modules/typia/lib/utils/StringUtil/StringUtil.mjs
var capitalize = (str) => str.length ? str[0].toUpperCase() + str.slice(1).toLowerCase() : str;

// ../../node_modules/typia/lib/utils/NamingConvention/NamingConvention.mjs
function snake(str) {
  if (str.length === 0)
    return str;
  let prefix = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "_")
      prefix += "_";
    else
      break;
  }
  if (prefix.length !== 0)
    str = str.substring(prefix.length);
  const out = (s) => `${prefix}${s}`;
  const items = str.split("_");
  if (items.length > 1)
    return out(items.map((s) => s.toLowerCase()).join("_"));
  const indexes = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (65 <= code && code <= 90)
      indexes.push(i);
  }
  for (let i = indexes.length - 1; i > 0; --i) {
    const now = indexes[i];
    const prev = indexes[i - 1];
    if (now - prev === 1)
      indexes.splice(i, 1);
  }
  if (indexes.length !== 0 && indexes[0] === 0)
    indexes.splice(0, 1);
  if (indexes.length === 0)
    return str.toLowerCase();
  let ret2 = "";
  for (let i = 0; i < indexes.length; i++) {
    const first = i === 0 ? 0 : indexes[i - 1];
    const last = indexes[i];
    ret2 += str.substring(first, last).toLowerCase();
    ret2 += "_";
  }
  ret2 += str.substring(indexes[indexes.length - 1]).toLowerCase();
  return out(ret2);
}
var camel = (str) => unsnake({
  plain: (str2) => str2.length ? str2 === str2.toUpperCase() ? str2.toLocaleLowerCase() : `${str2[0].toLowerCase()}${str2.substring(1)}` : str2,
  snake: (str2, i) => i === 0 ? str2.toLowerCase() : capitalize(str2.toLowerCase())
})(str);
var pascal = (str) => unsnake({
  plain: (str2) => str2.length ? `${str2[0].toUpperCase()}${str2.substring(1)}` : str2,
  snake: capitalize
})(str);
var unsnake = (props) => (str) => {
  let prefix = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "_")
      prefix += "_";
    else
      break;
  }
  if (prefix.length !== 0)
    str = str.substring(prefix.length);
  const out = (s) => `${prefix}${s}`;
  if (str.length === 0)
    return out("");
  const items = str.split("_").filter((s) => s.length !== 0);
  return items.length === 0 ? out("") : items.length === 1 ? out(props.plain(items[0])) : out(items.map(props.snake).join(""));
};

// ../../node_modules/typia/lib/functional/_convention.mjs
var $convention = (rename) => {
  const main = (input) => {
    if (typeof input === "object")
      if (input === null)
        return null;
      else if (Array.isArray(input))
        return input.map(main);
      else if (input instanceof Boolean || input instanceof BigInt || input instanceof Number || input instanceof String)
        return input.valueOf();
      else if (input instanceof Date)
        return new Date(input);
      else if (input instanceof Uint8Array || input instanceof Uint8ClampedArray || input instanceof Uint16Array || input instanceof Uint32Array || input instanceof BigUint64Array || input instanceof Int8Array || input instanceof Int16Array || input instanceof Int32Array || input instanceof BigInt64Array || input instanceof Float32Array || input instanceof Float64Array || input instanceof DataView)
        return input;
      else
        return object(input);
    return input;
  };
  const object = (input) => Object.fromEntries(Object.entries(input).map(([key, value]) => [rename(key), main(value)]));
  return main;
};

// ../../node_modules/typia/lib/functional/Namespace/notations.mjs
var camel2 = (method) => ({
  ...base(method),
  any: $convention(camel)
});
var pascal2 = (method) => ({
  ...base(method),
  any: $convention(pascal)
});
var snake2 = (method) => ({
  ...base(method),
  any: $convention(snake)
});
var base = (method) => ({
  ...is(),
  throws: $throws(`notations.${method}`)
});

// ../../node_modules/typia/lib/notations.mjs
function camel3() {
  return halt5("camel");
}
var camelPure = /* @__PURE__ */ Object.assign(
  camel3,
  /* @__PURE__ */ camel2("camel")
);
function assertCamel() {
  return halt5("assertCamel");
}
var assertCamelPure = /* @__PURE__ */ Object.assign(
  assertCamel,
  /* @__PURE__ */ camel2("assertCamel"),
  /* @__PURE__ */ assert("notations.assertCamel")
);
function isCamel() {
  return halt5("isCamel");
}
var isCamelPure = /* @__PURE__ */ Object.assign(
  isCamel,
  /* @__PURE__ */ camel2("isCamel"),
  /* @__PURE__ */ is()
);
function validateCamel() {
  return halt5("validateCamel");
}
var validateCamelPure = /* @__PURE__ */ Object.assign(
  validateCamel,
  /* @__PURE__ */ camel2("validateCamel"),
  /* @__PURE__ */ validate()
);
function pascal3() {
  return halt5("pascal");
}
var pascalPure = /* @__PURE__ */ Object.assign(
  pascal3,
  /* @__PURE__ */ pascal2("pascal")
);
function assertPascal() {
  return halt5("assertPascal");
}
var assertPascalPure = /* @__PURE__ */ Object.assign(
  assertPascal,
  /* @__PURE__ */ pascal2("assertPascal"),
  /* @__PURE__ */ assert("notations.assertPascal")
);
function isPascal() {
  return halt5("isPascal");
}
var isPascalPure = /* @__PURE__ */ Object.assign(
  isPascal,
  /* @__PURE__ */ pascal2("isPascal"),
  /* @__PURE__ */ is()
);
function validatePascal() {
  return halt5("validatePascal");
}
var validatePascalPure = /* @__PURE__ */ Object.assign(
  validatePascal,
  /* @__PURE__ */ pascal2("validatePascal"),
  /* @__PURE__ */ validate()
);
function snake3() {
  return halt5("snake");
}
var snakePure = /* @__PURE__ */ Object.assign(
  snake3,
  /* @__PURE__ */ snake2("snake")
);
function assertSnake() {
  return halt5("assertSnake");
}
var assertSnakePure = /* @__PURE__ */ Object.assign(
  assertSnake,
  /* @__PURE__ */ snake2("assertSnake"),
  /* @__PURE__ */ assert("notations.assertSnake")
);
function isSnake() {
  return halt5("isSnake");
}
var isSnakePure = /* @__PURE__ */ Object.assign(
  isSnake,
  /* @__PURE__ */ snake2("isSnake"),
  /* @__PURE__ */ is()
);
function validateSnake() {
  return halt5("validateSnake");
}
var validateSnakePure = /* @__PURE__ */ Object.assign(
  validateSnake,
  /* @__PURE__ */ snake2("validateSnake"),
  /* @__PURE__ */ validate()
);
function createCamel() {
  halt5("createCamel");
}
var createCamelPure = /* @__PURE__ */ Object.assign(
  createCamel,
  /* @__PURE__ */ camel2("createCamel")
);
function createAssertCamel() {
  halt5("createAssertCamel");
}
var createAssertCamelPure = /* @__PURE__ */ Object.assign(
  createAssertCamel,
  /* @__PURE__ */ camel2("createAssertCamel"),
  /* @__PURE__ */ assert("notations.createAssertCamel")
);
function createIsCamel() {
  halt5("createIsCamel");
}
var createIsCamelPure = /* @__PURE__ */ Object.assign(
  createIsCamel,
  /* @__PURE__ */ camel2("createIsCamel"),
  /* @__PURE__ */ is()
);
function createValidateCamel() {
  halt5("createValidateCamel");
}
var createValidateCamelPure = /* @__PURE__ */ Object.assign(
  createValidateCamel,
  /* @__PURE__ */ camel2("createValidateCamel"),
  /* @__PURE__ */ validate()
);
function createPascal() {
  halt5("createPascal");
}
var createPascalPure = /* @__PURE__ */ Object.assign(createPascal, /* @__PURE__ */ pascal2("createPascal"));
function createAssertPascal() {
  halt5("createAssertPascal");
}
var createAssertPascalPure = /* @__PURE__ */ Object.assign(
  createAssertPascal,
  /* @__PURE__ */ pascal2("createAssertPascal"),
  /* @__PURE__ */ assert("notations.createAssertPascal")
);
function createIsPascal() {
  halt5("createIsPascal");
}
var createIsPascalPure = /* @__PURE__ */ Object.assign(
  createIsPascal,
  /* @__PURE__ */ pascal2("createIsPascal"),
  /* @__PURE__ */ is()
);
function createValidatePascal() {
  halt5("createValidatePascal");
}
var createValidatePascalPure = /* @__PURE__ */ Object.assign(
  createValidatePascal,
  /* @__PURE__ */ pascal2("createValidatePascal"),
  /* @__PURE__ */ validate()
);
function createSnake() {
  halt5("createSnake");
}
var createSnakePure = /* @__PURE__ */ Object.assign(
  createSnake,
  /* @__PURE__ */ snake2("createSnake")
);
function createAssertSnake() {
  halt5("createAssertSnake");
}
var createAssertSnakePure = /* @__PURE__ */ Object.assign(
  createAssertSnake,
  /* @__PURE__ */ snake2("createAssertSnake"),
  /* @__PURE__ */ assert("notations.createAssertSnake")
);
function createIsSnake() {
  halt5("createIsSnake");
}
var createIsSnakePure = /* @__PURE__ */ Object.assign(
  createIsSnake,
  /* @__PURE__ */ snake2("createIsSnake"),
  /* @__PURE__ */ is()
);
function createValidateSnake() {
  halt5("createValidateSnake");
}
var createValidateSnakePure = /* @__PURE__ */ Object.assign(
  createValidateSnake,
  /* @__PURE__ */ snake2("createValidateSnake"),
  /* @__PURE__ */ validate()
);
function halt5(name2) {
  throw new Error(`Error on typia.notations.${name2}(): no transform has been configured. Read and follow https://typia.io/docs/setup please.`);
}

// ../../node_modules/typia/lib/protobuf.mjs
var protobuf_exports = {};
__export(protobuf_exports, {
  assertDecode: () => assertDecodePure,
  assertEncode: () => assertEncodePure,
  createAssertDecode: () => createAssertDecodePure,
  createAssertEncode: () => createAssertEncodePure,
  createDecode: () => createDecodePure,
  createEncode: () => createEncodePure,
  createIsDecode: () => createIsDecodePure,
  createIsEncode: () => createIsEncodePure,
  createValidateDecode: () => createValidateDecodePure,
  createValidateEncode: () => createValidateEncodePure,
  decode: () => decodePure,
  encode: () => encodePure,
  isDecode: () => isDecodePure,
  isEncode: () => isEncodePure,
  message: () => message,
  validateDecode: () => validateDecodePure,
  validateEncode: () => validateEncodePure
});

// ../../node_modules/typia/lib/utils/Singleton.mjs
var Singleton = class {
  closure_;
  value_;
  constructor(closure) {
    this.closure_ = closure;
    this.value_ = NOT_MOUNTED_YET;
  }
  get(...args) {
    if (this.value_ === NOT_MOUNTED_YET)
      this.value_ = this.closure_(...args);
    return this.value_;
  }
};
var NOT_MOUNTED_YET = {};

// ../../node_modules/typia/lib/functional/_ProtobufReader.mjs
var $ProtobufReader = class {
  /**
   * Read buffer
   */
  buf;
  /**
   * Read buffer pointer.
   */
  ptr;
  /**
   * DataView for buffer.
   */
  view;
  constructor(buf) {
    this.buf = buf;
    this.ptr = 0;
    this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  }
  index() {
    return this.ptr;
  }
  size() {
    return this.buf.length;
  }
  uint32() {
    return this.varint32();
  }
  int32() {
    return this.varint32();
  }
  sint32() {
    const value = this.varint32();
    return value >>> 1 ^ -(value & 1);
  }
  uint64() {
    return this.varint64();
  }
  int64() {
    return this.varint64();
  }
  sint64() {
    const value = this.varint64();
    return value >> BigInt(1) ^ -(value & BigInt(1));
  }
  bool() {
    return this.varint32() !== 0;
  }
  float() {
    const value = this.view.getFloat32(this.ptr, true);
    this.ptr += 4;
    return value;
  }
  double() {
    const value = this.view.getFloat64(this.ptr, true);
    this.ptr += 8;
    return value;
  }
  bytes() {
    const length2 = this.uint32();
    const from = this.ptr;
    this.ptr += length2;
    return this.buf.subarray(from, from + length2);
  }
  string() {
    return utf8.get().decode(this.bytes());
  }
  skip(length2) {
    if (length2 === 0)
      while (this.u8() & 128)
        ;
    else {
      if (this.index() + length2 > this.size())
        throw new Error("Error on typia.protobuf.decode(): buffer overflow.");
      this.ptr += length2;
    }
  }
  skipType(wireType) {
    switch (wireType) {
      case 0:
        this.skip(0);
        break;
      case 1:
        this.skip(8);
        break;
      case 2:
        this.skip(this.uint32());
        break;
      case 3:
        while ((wireType = this.uint32() & 7) !== 4)
          this.skipType(wireType);
        break;
      case 5:
        this.skip(4);
        break;
      default:
        throw new Error(`Invalid wire type ${wireType} at offset ${this.ptr}.`);
    }
  }
  varint32() {
    let loaded;
    let value;
    value = (loaded = this.u8()) & 127;
    if (loaded < 128)
      return value;
    value |= ((loaded = this.u8()) & 127) << 7;
    if (loaded < 128)
      return value;
    value |= ((loaded = this.u8()) & 127) << 14;
    if (loaded < 128)
      return value;
    value |= ((loaded = this.u8()) & 127) << 21;
    if (loaded < 128)
      return value;
    value |= ((loaded = this.u8()) & 15) << 28;
    if (loaded < 128)
      return value;
    if (this.u8() < 128)
      return value;
    if (this.u8() < 128)
      return value;
    if (this.u8() < 128)
      return value;
    if (this.u8() < 128)
      return value;
    if (this.u8() < 128)
      return value;
    return value;
  }
  varint64() {
    let loaded;
    let value;
    value = (loaded = this.u8n()) & BigInt(127);
    if (loaded < BigInt(128))
      return value;
    value |= ((loaded = this.u8n()) & BigInt(127)) << BigInt(7);
    if (loaded < BigInt(128))
      return value;
    value |= ((loaded = this.u8n()) & BigInt(127)) << BigInt(14);
    if (loaded < BigInt(128))
      return value;
    value |= ((loaded = this.u8n()) & BigInt(127)) << BigInt(21);
    if (loaded < BigInt(128))
      return value;
    value |= ((loaded = this.u8n()) & BigInt(127)) << BigInt(28);
    if (loaded < BigInt(128))
      return value;
    value |= ((loaded = this.u8n()) & BigInt(127)) << BigInt(35);
    if (loaded < BigInt(128))
      return value;
    value |= ((loaded = this.u8n()) & BigInt(127)) << BigInt(42);
    if (loaded < BigInt(128))
      return value;
    value |= ((loaded = this.u8n()) & BigInt(127)) << BigInt(49);
    if (loaded < BigInt(128))
      return value;
    value |= ((loaded = this.u8n()) & BigInt(127)) << BigInt(56);
    if (loaded < BigInt(128))
      return value;
    value |= (this.u8n() & BigInt(1)) << BigInt(63);
    return BigInt.asIntN(64, value);
  }
  u8() {
    return this.view.getUint8(this.ptr++);
  }
  u8n() {
    return BigInt(this.u8());
  }
};
var utf8 = /* @__PURE__ */ new Singleton(() => new TextDecoder("utf-8"));

// ../../node_modules/typia/lib/functional/_strlen.mjs
var $strlen = (s) => {
  let b;
  let i;
  let c;
  for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 3 : c >> 7 ? 2 : 1)
    ;
  return b;
};

// ../../node_modules/typia/lib/functional/_ProtobufSizer.mjs
var $ProtobufSizer = class {
  /**
   * Total length.
   */
  len;
  /**
   * Position stack.
   */
  pos;
  /**
   * Variable length list.
   */
  varlen;
  /**
   * Variable length index stack.
   */
  varlenidx;
  constructor(length2 = 0) {
    this.len = length2;
    this.pos = [];
    this.varlen = [];
    this.varlenidx = [];
  }
  bool() {
    this.len += 1;
  }
  int32(value) {
    if (value < 0) {
      this.len += 10;
    } else {
      this.varint32(value);
    }
  }
  sint32(value) {
    this.varint32(value << 1 ^ value >> 31);
  }
  uint32(value) {
    this.varint32(value);
  }
  int64(value) {
    this.varint64(typeof value === "number" ? BigInt(value) : value);
  }
  sint64(value) {
    if (typeof value === "number")
      value = BigInt(value);
    this.varint64(value << BigInt(1) ^ value >> BigInt(63));
  }
  uint64(value) {
    this.varint64(typeof value === "number" ? BigInt(value) : value);
  }
  // public fixed32(_value: number): void {
  //     this.len += 4;
  // }
  // public sfixed32(_value: number): void {
  //     this.len += 4;
  // }
  // public fixed64(_value: number | bigint): void {
  //     this.len += 8;
  // }
  // public sfixed64(_value: number | bigint): void {
  //     this.len += 8;
  // }
  float(_value) {
    this.len += 4;
  }
  double(_value) {
    this.len += 8;
  }
  bytes(value) {
    this.uint32(value.byteLength);
    this.len += value.byteLength;
  }
  string(value) {
    const len = $strlen(value);
    this.varlen.push(len);
    this.uint32(len);
    this.len += len;
  }
  fork() {
    this.pos.push(this.len);
    this.varlenidx.push(this.varlen.length);
    this.varlen.push(0);
  }
  ldelim() {
    if (!(this.pos.length && this.varlenidx.length))
      throw new Error("Error on typia.protobuf.encode(): missing fork() before ldelim() call.");
    const endPos = this.len;
    const startPos = this.pos.pop();
    const idx = this.varlenidx.pop();
    const len = endPos - startPos;
    this.varlen[idx] = len;
    this.uint32(len);
  }
  reset() {
    this.len = 0;
    this.pos.length = 0;
    this.varlen.length = 0;
    this.varlenidx.length = 0;
  }
  varint32(value) {
    this.len += value < 0 ? 10 : value < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5;
  }
  varint64(val) {
    val = BigInt.asUintN(64, val);
    while (val > BigInt(127)) {
      ++this.len;
      val = val >> BigInt(7);
    }
    ++this.len;
  }
};

// ../../node_modules/typia/lib/functional/_ProtobufWriter.mjs
var $ProtobufWriter = class {
  /**
   * Related sizer
   */
  sizer;
  /**
   * Current pointer.
   */
  ptr;
  /**
   * Protobuf buffer.
   */
  buf;
  /**
   * DataView for buffer.
   */
  view;
  /**
   * Index in varlen array from sizer.
   */
  varlenidx;
  constructor(sizer) {
    this.sizer = sizer;
    this.buf = new Uint8Array(sizer.len);
    this.view = new DataView(this.buf.buffer);
    this.ptr = 0;
    this.varlenidx = 0;
  }
  buffer() {
    return this.buf;
  }
  bool(value) {
    this.byte(value ? 1 : 0);
  }
  byte(value) {
    this.buf[this.ptr++] = value & 255;
  }
  int32(value) {
    if (value < 0)
      this.int64(value);
    else
      this.variant32(value >>> 0);
  }
  sint32(value) {
    this.variant32(value << 1 ^ value >> 31);
  }
  uint32(value) {
    this.variant32(value);
  }
  sint64(value) {
    value = BigInt(value);
    this.variant64(value << BigInt(1) ^ value >> BigInt(63));
  }
  int64(value) {
    this.variant64(BigInt(value));
  }
  uint64(value) {
    this.variant64(BigInt(value));
  }
  float(val) {
    this.view.setFloat32(this.ptr, val, true);
    this.ptr += 4;
  }
  double(val) {
    this.view.setFloat64(this.ptr, val, true);
    this.ptr += 8;
  }
  bytes(value) {
    this.uint32(value.byteLength);
    for (let i = 0; i < value.byteLength; i++)
      this.buf[this.ptr++] = value[i];
  }
  string(value) {
    const len = this.varlen();
    this.uint32(len);
    const binary = utf82.get().encode(value);
    for (let i = 0; i < binary.byteLength; i++)
      this.buf[this.ptr++] = binary[i];
  }
  fork() {
    this.uint32(this.varlen());
  }
  ldelim() {
  }
  finish() {
    return this.buf;
  }
  reset() {
    this.buf = new Uint8Array(this.sizer.len);
    this.view = new DataView(this.buf.buffer);
    this.ptr = 0;
    this.varlenidx = 0;
  }
  variant32(val) {
    while (val > 127) {
      this.buf[this.ptr++] = val & 127 | 128;
      val = val >>> 7;
    }
    this.buf[this.ptr++] = val;
  }
  variant64(val) {
    val = BigInt.asUintN(64, val);
    while (val > BigInt(127)) {
      this.buf[this.ptr++] = Number(val & BigInt(127) | BigInt(128));
      val = val >> BigInt(7);
    }
    this.buf[this.ptr++] = Number(val);
  }
  varlen() {
    return this.varlenidx >= this.sizer.varlen.length ? 0 : this.sizer.varlen[this.varlenidx++];
  }
};
var utf82 = /* @__PURE__ */ new Singleton(() => new TextEncoder());

// ../../node_modules/typia/lib/functional/Namespace/protobuf.mjs
var decode = (method) => ({
  ...is(),
  Reader: $ProtobufReader,
  throws: $throws(`protobuf.${method}`)
});
var encode = (method) => ({
  ...is(),
  Sizer: $ProtobufSizer,
  Writer: $ProtobufWriter,
  strlen: $strlen,
  throws: $throws(method)
});

// ../../node_modules/typia/lib/protobuf.mjs
function message() {
  halt6("message");
}
function decode2() {
  halt6("decode");
}
var decodePure = /* @__PURE__ */ Object.assign(
  decode2,
  /* @__PURE__ */ decode("decode")
);
function assertDecode() {
  halt6("assertDecode");
}
var assertDecodePure = /* @__PURE__ */ Object.assign(
  assertDecode,
  /* @__PURE__ */ assert("protobuf.assertDecode"),
  /* @__PURE__ */ decode("assertDecode")
);
function isDecode() {
  halt6("isDecode");
}
var isDecodePure = /* @__PURE__ */ Object.assign(
  isDecode,
  /* @__PURE__ */ is(),
  /* @__PURE__ */ decode("isDecode")
);
function validateDecode() {
  halt6("validateDecode");
}
var validateDecodePure = /* @__PURE__ */ Object.assign(
  validateDecode,
  /* @__PURE__ */ validate(),
  /* @__PURE__ */ decode("validateDecode")
);
function encode2() {
  halt6("encode");
}
var encodePure = /* @__PURE__ */ Object.assign(
  encode2,
  /* @__PURE__ */ encode("encode")
);
function assertEncode() {
  halt6("assertEncode");
}
var assertEncodePure = /* @__PURE__ */ Object.assign(
  assertEncode,
  /* @__PURE__ */ assert("protobuf.assertEncode"),
  /* @__PURE__ */ encode("assertEncode")
);
function isEncode() {
  halt6("isEncode");
}
var isEncodePure = /* @__PURE__ */ Object.assign(
  isEncode,
  /* @__PURE__ */ is(),
  /* @__PURE__ */ encode("isEncode")
);
function validateEncode() {
  halt6("validateEncode");
}
var validateEncodePure = /* @__PURE__ */ Object.assign(
  validateEncode,
  /* @__PURE__ */ validate(),
  /* @__PURE__ */ encode("validateEncode")
);
function createDecode() {
  halt6("createDecode");
}
var createDecodePure = /* @__PURE__ */ Object.assign(createDecode, /* @__PURE__ */ decode("createDecode"));
function createIsDecode() {
  halt6("createIsDecode");
}
var createIsDecodePure = /* @__PURE__ */ Object.assign(
  createIsDecode,
  /* @__PURE__ */ is(),
  /* @__PURE__ */ decode("createIsDecode")
);
function createAssertDecode() {
  halt6("createAssertDecode");
}
var createAssertDecodePure = /* @__PURE__ */ Object.assign(
  createAssertDecode,
  /* @__PURE__ */ assert("protobuf.createAssertDecode"),
  /* @__PURE__ */ decode("createAssertDecode")
);
function createValidateDecode() {
  halt6("createValidateDecode");
}
var createValidateDecodePure = /* @__PURE__ */ Object.assign(
  createValidateDecode,
  /* @__PURE__ */ validate(),
  /* @__PURE__ */ decode("createValidateDecode")
);
function createEncode() {
  halt6("createEncode");
}
var createEncodePure = /* @__PURE__ */ Object.assign(createEncode, /* @__PURE__ */ encode("createEncode"));
function createIsEncode() {
  halt6("createIsEncode");
}
var createIsEncodePure = /* @__PURE__ */ Object.assign(
  createIsEncode,
  /* @__PURE__ */ is(),
  /* @__PURE__ */ encode("createIsEncode")
);
function createAssertEncode() {
  halt6("createAssertEncode");
}
var createAssertEncodePure = /* @__PURE__ */ Object.assign(
  createAssertEncode,
  /* @__PURE__ */ assert("protobuf.createAssertEncode"),
  /* @__PURE__ */ encode("createAssertEncode")
);
function createValidateEncode() {
  halt6("createValidateEncode");
}
var createValidateEncodePure = /* @__PURE__ */ Object.assign(
  createValidateEncode,
  /* @__PURE__ */ validate(),
  /* @__PURE__ */ encode("createValidateEncode")
);
function halt6(name2) {
  throw new Error(`Error on typia.protobuf.${name2}(): no transform has been configured. Read and follow https://typia.io/docs/setup please.`);
}

// ../../node_modules/typia/lib/reflect.mjs
var reflect_exports = {};
__export(reflect_exports, {
  metadata: () => metadataPure,
  name: () => name
});
function metadata() {
  halt7("metadata");
}
var metadataPure = /* @__PURE__ */ Object.assign(metadata, { from: (input) => input });
function name() {
  halt7("name");
}
function halt7(name2) {
  throw new Error(`Error on typia.reflect.${name2}(): no transform has been configured. Read and follow https://typia.io/docs/setup please.`);
}

// ../../node_modules/typia/lib/tags/index.mjs
var tags_exports = {};

// ../../node_modules/typia/lib/module.mjs
function assert2() {
  halt8("assert");
}
var assertPure = /* @__PURE__ */ Object.assign(
  assert2,
  /* @__PURE__ */ assert("assert")
);
function assertGuard() {
  halt8("assertGuard");
}
var assertGuardPure = /* @__PURE__ */ Object.assign(
  assertGuard,
  /* @__PURE__ */ assert("assertGuard")
);
function is2() {
  halt8("is");
}
var isPure = /* @__PURE__ */ Object.assign(
  is2,
  /* @__PURE__ */ assert("is")
);
function validate2() {
  halt8("validate");
}
var validatePure = /* @__PURE__ */ Object.assign(
  validate2,
  /* @__PURE__ */ validate()
);
function assertEquals() {
  halt8("assertEquals");
}
var assertEqualsPure = /* @__PURE__ */ Object.assign(assertEquals, /* @__PURE__ */ assert("assertEquals"));
function assertGuardEquals() {
  halt8("assertGuardEquals");
}
var assertGuardEqualsPure = /* @__PURE__ */ Object.assign(assertGuardEquals, /* @__PURE__ */ assert("assertGuardEquals"));
function equals() {
  halt8("equals");
}
var equalsPure = /* @__PURE__ */ Object.assign(
  equals,
  /* @__PURE__ */ is()
);
function validateEquals() {
  halt8("validateEquals");
}
var validateEqualsPure = /* @__PURE__ */ Object.assign(validateEquals, /* @__PURE__ */ validate());
function random2() {
  halt8("random");
}
var randomPure = /* @__PURE__ */ Object.assign(
  random2,
  /* @__PURE__ */ random()
);
function createAssert() {
  halt8("createAssert");
}
var createAssertPure = /* @__PURE__ */ Object.assign(createAssert, assertPure);
function createAssertGuard() {
  halt8("createAssertGuard");
}
var createAssertGuardPure = /* @__PURE__ */ Object.assign(createAssertGuard, assertGuardPure);
function createIs() {
  halt8("createIs");
}
var createIsPure = /* @__PURE__ */ Object.assign(createIs, isPure);
function createValidate() {
  halt8("createValidate");
}
var createValidatePure = /* @__PURE__ */ Object.assign(createValidate, validatePure);
function createAssertEquals() {
  halt8("createAssertEquals");
}
var createAssertEqualsPure = /* @__PURE__ */ Object.assign(createAssertEquals, assertEqualsPure);
function createAssertGuardEquals() {
  halt8("createAssertGuardEquals");
}
var createAssertGuardEqualsPure = /* @__PURE__ */ Object.assign(createAssertGuardEquals, assertGuardEqualsPure);
function createEquals() {
  halt8("createEquals");
}
var createEqualsPure = /* @__PURE__ */ Object.assign(createEquals, equalsPure);
function createValidateEquals() {
  halt8("createValidateEquals");
}
var createValidateEqualsPure = /* @__PURE__ */ Object.assign(createValidateEquals, validateEqualsPure);
function createRandom() {
  halt8("createRandom");
}
var createRandomPure = /* @__PURE__ */ Object.assign(createRandom, randomPure);
function halt8(name2) {
  throw new Error(`Error on typia.${name2}(): no transform has been configured. Read and follow https://typia.io/docs/setup please.`);
}

// tests/fixtures/validate.ts
var validate3 = /* @__PURE__ */ (() => {
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
      $report2 = module_exports.createValidate.report(errors);
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
validate3({});
