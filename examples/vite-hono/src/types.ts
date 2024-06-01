import typia, { type tags } from "typia";

export interface Author {
  name: string;
  age:
    & number
    & tags.Type<"uint32">
    & tags.Minimum<20>
    & tags.ExclusiveMaximum<100>;
}

export const validate = typia.createValidate<Author>();
