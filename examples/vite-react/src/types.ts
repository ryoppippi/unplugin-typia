import typia, { type tags, IValidation } from "typia";

export const validate = typia.createValidate<IMember>();
 
export interface IMember {
  id: string & tags.Format<"uuid">;
  email: string & tags.Format<"email">;
  age: number & tags.Type<"uint32"> & tags.ExclusiveMinimum<19> & tags.Maximum<100>;
}

export type { IValidation };
