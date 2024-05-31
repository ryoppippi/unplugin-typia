import typia, { type tags } from "typia";
import { v4 } from "uuid";

export const check = typia.createIs<IMember>();

interface IMember {
  email: string & tags.Format<"email">;
  id: string & tags.Format<"uuid">;
  age: number & tags.ExclusiveMinimum<19> & tags.Maximum<100>;
}

const member = {
  id: v4(),
  email: "example@example.com",
  age: 30,
} as const satisfies IMember;

const result = check(member);
document.getElementById("app")!.innerHTML = JSON.stringify(result);
