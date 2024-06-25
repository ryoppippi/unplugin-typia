import typia from "typia";

const result = typia.validate<{ ctmnumb: number }>({ ctmnumb: "123" });
console.log("result", result);

