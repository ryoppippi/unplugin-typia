// random.js
import typia from 'typia';

const random = (generator) => {
  const $generator = typia.createRandom.generator;
  const $ro0 = (_recursive = false, _depth = 0) => ({
    email: ($generator.customs)?.string?.([
      {
        name: 'Format<"email">',
        kind: "format",
        value: "email"
      }
    ]) ?? (0, $generator.email)(),
    id: ($generator.customs)?.string?.([
      {
        name: 'Format<"uuid">',
        kind: "format",
        value: "uuid"
      }
    ]) ?? (0, $generator.uuid)(),
    age: ($generator.customs)?.number?.([
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
    ]) ?? (0, $generator.integer)(19, 100)
  });
  return $ro0();
};
random();
