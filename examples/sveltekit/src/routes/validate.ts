import typia, { type tags } from "typia";

export interface IMember {
  id: string & tags.Format<"uuid">;
  email: string & tags.Format<"email">;
  age: number & tags.ExclusiveMinimum<19> & tags.Maximum<100>;
}

export const validate = typia.createValidate<IMember>();

