function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var lib$1 = { exports: {} };
var util$1 = {};
var types$2 = {
  ROOT: 0,
  GROUP: 1,
  POSITION: 2,
  SET: 3,
  RANGE: 4,
  REPETITION: 5,
  REFERENCE: 6,
  CHAR: 7
};
var sets$1 = {};
var positions$1 = {};
const util = util$1;
const types$1 = types$2;
const sets = sets$1;
const positions = positions$1;
lib$1.exports = (regexpStr) => {
  var i = 0, l, c, start = { type: types$1.ROOT, stack: [] }, lastGroup = start, last = start.stack, groupStack = [];
  var repeatErr = (i2) => {
    util.error(regexpStr, `Nothing to repeat at column ${i2 - 1}`);
  };
  var str = util.strToChars(regexpStr);
  l = str.length;
  while (i < l) {
    c = str[i++];
    switch (c) {
      case "\\":
        c = str[i++];
        switch (c) {
          case "b":
            last.push(positions.wordBoundary());
            break;
          case "B":
            last.push(positions.nonWordBoundary());
            break;
          case "w":
            last.push(sets.words());
            break;
          case "W":
            last.push(sets.notWords());
            break;
          case "d":
            last.push(sets.ints());
            break;
          case "D":
            last.push(sets.notInts());
            break;
          case "s":
            last.push(sets.whitespace());
            break;
          case "S":
            last.push(sets.notWhitespace());
            break;
          default:
            if (/\d/.test(c)) {
              last.push({ type: types$1.REFERENCE, value: parseInt(c, 10) });
            } else {
              last.push({ type: types$1.CHAR, value: c.charCodeAt(0) });
            }
        }
        break;
      case "^":
        last.push(positions.begin());
        break;
      case "$":
        last.push(positions.end());
        break;
      case "[":
        var not;
        if (str[i] === "^") {
          not = true;
          i++;
        } else {
          not = false;
        }
        var classTokens = util.tokenizeClass(str.slice(i), regexpStr);
        i += classTokens[1];
        last.push({
          type: types$1.SET,
          set: classTokens[0],
          not
        });
        break;
      case ".":
        last.push(sets.anyChar());
        break;
      case "(":
        var group = {
          type: types$1.GROUP,
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
            util.error(
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
          util.error(regexpStr, `Unmatched ) at column ${i - 1}`);
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
            type: types$1.REPETITION,
            min,
            max,
            value: last.pop()
          });
        } else {
          last.push({
            type: types$1.CHAR,
            value: 123
          });
        }
        break;
      case "?":
        if (last.length === 0) {
          repeatErr(i);
        }
        last.push({
          type: types$1.REPETITION,
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
          type: types$1.REPETITION,
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
          type: types$1.REPETITION,
          min: 0,
          max: Infinity,
          value: last.pop()
        });
        break;
      default:
        last.push({
          type: types$1.CHAR,
          value: c.charCodeAt(0)
        });
    }
  }
  if (groupStack.length !== 0) {
    util.error(regexpStr, "Unterminated group");
  }
  return start;
};
lib$1.exports.types = types$1;
var libExports = lib$1.exports;
class SubRange {
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
    return new SubRange(
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
        new SubRange(this.low, range.low - 1),
        new SubRange(range.high + 1, this.high)
      ];
    } else if (range.low <= this.low) {
      return [new SubRange(range.high + 1, this.high)];
    } else {
      return [new SubRange(this.low, range.low - 1)];
    }
  }
  toString() {
    return this.low == this.high ? this.low.toString() : this.low + "-" + this.high;
  }
}
let DRange$1 = class DRange {
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
    if (a instanceof DRange) {
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
    if (a instanceof DRange) {
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
    if (a instanceof DRange) {
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
    return new DRange(this);
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
var lib = DRange$1;
const ret = libExports;
const DRange2 = lib;
const types = ret.types;
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
      case types.ROOT:
      case types.GROUP:
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
      case types.POSITION:
        return "";
      case types.SET:
        var expandedSet = this._expand(token);
        if (!expandedSet.length) {
          return "";
        }
        return String.fromCharCode(this._randSelect(expandedSet));
      case types.REPETITION:
        n = this.randInt(
          token.min,
          token.max === Infinity ? token.min + this.max : token.max
        );
        str = "";
        for (i = 0; i < n; i++) {
          str += this._gen(token.value, groups);
        }
        return str;
      case types.REFERENCE:
        return groups[token.value - 1] || "";
      case types.CHAR:
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
const ALPHABETS = "abcdefghijklmnopqrstuvwxyz";
const boolean = () => Math.random() < 0.5;
const integer = (min, max) => {
  min ?? (min = 0);
  max ?? (max = 100);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const bigint = (min, max) => BigInt(integer(Number(min ?? BigInt(0)), Number(max ?? BigInt(100))));
const number = (min, max) => {
  min ?? (min = 0);
  max ?? (max = 100);
  return Math.random() * (max - min) + min;
};
const string = (length2) => new Array(length2 ?? integer(5, 10)).fill(0).map(() => ALPHABETS[integer(0, ALPHABETS.length - 1)]).join("");
const array = (closure, count, unique) => {
  count ?? (count = length());
  unique ?? (unique = false);
  if (unique === false)
    return new Array(count ?? length()).fill(0).map((_e, index) => closure(index));
  else {
    const set = /* @__PURE__ */ new Set();
    while (set.size < count)
      set.add(closure(set.size));
    return Array.from(set);
  }
};
const pick = (array2) => array2[integer(0, array2.length - 1)];
const length = () => integer(0, 3);
const pattern = (regex2) => {
  const r = new RandExp2(regex2);
  for (let i = 0; i < 10; ++i) {
    const str = r.gen();
    if (regex2.test(str))
      return str;
  }
  return r.gen();
};
const byte = () => "vt7ekz4lIoNTTS9sDQYdWKharxIFAR54+z/umIxSgUM=";
const password = () => string(integer(4, 16));
const regex = () => "/^(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)$/";
const uuid = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0;
  const v = c === "x" ? r : r & 3 | 8;
  return v.toString(16);
});
const email = () => `${string(10)}@${string(10)}.${string(3)}`;
const hostname = () => `${string(10)}.${string(3)}`;
const idnEmail = () => email();
const idnHostname = () => hostname();
const iri = () => url();
const iriReference = () => url();
const ipv4 = () => array(() => integer(0, 255), 4).join(".");
const ipv6 = () => array(() => integer(0, 65535).toString(16), 8).join(":");
const uri = () => url();
const uriReference = () => url();
const uriTemplate = () => url();
const url = () => `https://${string(10)}.${string(3)}`;
const datetime = (min, max) => new Date(number(min ?? Date.now() - 30 * DAY, max ?? Date.now() + 7 * DAY)).toISOString();
const date = (min, max) => new Date(number(min ?? 0, max ?? Date.now() * 2)).toISOString().substring(0, 10);
const time = () => new Date(number(0, DAY)).toISOString().substring(11);
const duration = () => {
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
const jsonPointer = () => `/components/schemas/${string(10)}`;
const relativeJsonPointer = () => `${integer(0, 10)}#`;
const DAY = 864e5;
const durate = (elements) => elements.filter(([_unit, value]) => value !== 0).map(([unit, value]) => `${value}${unit}`).join("");
const RandomGenerator = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  array,
  bigint,
  boolean,
  byte,
  date,
  datetime,
  duration,
  email,
  hostname,
  idnEmail,
  idnHostname,
  integer,
  ipv4,
  ipv6,
  iri,
  iriReference,
  jsonPointer,
  length,
  number,
  password,
  pattern,
  pick,
  regex,
  relativeJsonPointer,
  string,
  time,
  uri,
  uriReference,
  uriTemplate,
  url,
  uuid
}, Symbol.toStringTag, { value: "Module" }));
const random$2 = () => ({
  generator: RandomGenerator,
  pick
});
function random$1() {
  halt("random");
}
const randomPure = /* @__PURE__ */ Object.assign(
  random$1,
  /* @__PURE__ */ random$2()
);
function createRandom() {
  halt("createRandom");
}
const createRandomPure = /* @__PURE__ */ Object.assign(createRandom, randomPure);
function halt(name) {
  throw new Error(`Error on typia.${name}(): no transform has been configured. Read and follow https://typia.io/docs/setup please.`);
}
const random = (generator) => {
  const $generator = createRandomPure.generator;
  const $ro0 = (_recursive = false, _depth = 0) => {
    var _a, _b, _c, _d, _e, _f;
    return {
      email: ((_b = (_a = $generator.customs) == null ? void 0 : _a.string) == null ? void 0 : _b.call(_a, [
        {
          name: 'Format<"email">',
          kind: "format",
          value: "email"
        }
      ])) ?? (0, $generator.email)(),
      id: ((_d = (_c = $generator.customs) == null ? void 0 : _c.string) == null ? void 0 : _d.call(_c, [
        {
          name: 'Format<"uuid">',
          kind: "format",
          value: "uuid"
        }
      ])) ?? (0, $generator.uuid)(),
      age: ((_f = (_e = $generator.customs) == null ? void 0 : _e.number) == null ? void 0 : _f.call(_e, [
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
      ])) ?? (0, $generator.integer)(19, 100)
    };
  };
  return $ro0();
};
random();
