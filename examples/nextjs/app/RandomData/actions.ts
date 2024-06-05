"use server";

import typia, { type tags } from "typia";

export interface IMember {
  email: string & tags.Format<"email">;
  id: string & tags.Format<"uuid">;
  age: number & tags.Type<"uint32"> & tags.ExclusiveMinimum<19> & tags.Maximum<100>;
}

export async function randomOnServer()  {
  return typia.random<IMember>();
}
