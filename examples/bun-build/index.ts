/**
* This is the example of how to use typia with bun
*/

import typia, { type tags } from "typia"
import { randomUUID } from 'crypto';

/** define the schema of the member */
interface IMember {
  email: string & tags.Format<"email">;
  id: string & tags.Format<"uuid">;
  age: number & tags.ExclusiveMinimum<19> & tags.Maximum<100>;
}

/**
* example: create check function
*/
const is = typia.createIs<IMember>()

/** dummy member */
const member = {
  id: randomUUID(),
  email: 'example@example.com',
  age: 25
} as const satisfies IMember

console.log({ member, is: is(member) }) // true

/**
* example: create protobuf schema in builid time
*
* @output
*```
* syntax = "proto3";
*
* message IMember {
*   required string email = 1;
*   required string id = 2;
*   required double age = 3;
* }
*```
*/

/** create protobuf schema */
const MemberSchema = typia.protobuf.message<IMember>()
console.log(MemberSchema)

