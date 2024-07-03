import typia, { type tags } from "typia";


interface IMember {
  email: string & tags.Format<"email">;
  id: string & tags.Format<"uuid">;
  age: number & tags.ExclusiveMinimum<19> & tags.Maximum<100>;
}

const dummyData = {
  email: "example@example.com",
  id: `2f3cb112-102d-45ae-a1ba-88f4c46d5bf5`,
  age: 20
} as const satisfies IMember;

const res = typia.validate<IMember>(dummyData);

document.getElementById("app")!.innerHTML = res.success ? "Success" : JSON.stringify(res.errors, null, 2);

