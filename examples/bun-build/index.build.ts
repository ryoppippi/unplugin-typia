/**
* This is the example of how to use typia with bun
*/

import typia, { type tags } from "typia"

/** define the schema of the member */
interface IMember {
  /**
  * email of the member
  */
  email: string & tags.Format<"email">;

  /**
  * id of the member
  */
  id: string & tags.Format<"uuid">;
  
  /**
  * age of the member
  * age should be greater than 19
  */
  age: number & tags.ExclusiveMinimum<19> & tags.Maximum<100>;

  /**
  * pattern of the member
  */
  pattern: string & tags.Pattern<"^[a-z]+$">;
}

const random = typia.createRandom<IMember>();
console.log(random())
