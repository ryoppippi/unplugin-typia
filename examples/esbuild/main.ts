import typia, { type tags } from "typia";

export const random = typia.createRandom<IMember>();

interface IMember {
  email: string & tags.Format<"email">;
  id: string & tags.Format<"uuid">;
  age: number & tags.Type<"uint32"> & tags.ExclusiveMinimum<19> & tags.Maximum<100>;
}

const dummy = random();

console.log({ dummy })
