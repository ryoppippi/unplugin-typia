import typia from "typia";
const random = (generator) => {
  const $generator = typia.createRandom.generator;
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
