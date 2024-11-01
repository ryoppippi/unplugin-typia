import typia from "typia";
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
      ])) ?? ((_generator == null ? void 0 : _generator.integer) ?? $generator.integer)(20, 100)
    };
  };
  let _generator;
  return (generator) => {
    _generator = generator;
    return $ro0();
  };
})();
random();
