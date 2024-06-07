/**
* This is the example of how to use typia with bun
*/

import typia, { type tags } from "typia"
import { randomUUID } from 'crypto';

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

/**
* example: create json schema in builid time
*
* @output
* ```
* {
*   "version": "3.0",
*   "components": {
*     "schemas": {
*       "IMember": {
*         "type": "object",
*         "properties": {
*           "email": {
*             "type": "string",
*             "format": "email",
*             "description": "email of the member"
*           },
*           "id": {
*             "type": "string",
*             "format": "uuid",
*             "description": "id of the member"
*           },
*           "age": {
*             "type": "number",
*             "exclusiveMinimum": true,
*             "minimum": 19,
*             "maximum": 100,
*             "description": "age of the member\nage should be greater than 19"
*           }
*         },
*         "nullable": false,
*         "required": [
*           "email",
*           "id",
*           "age"
*         ],
*         "description": "define the schema of the member"
*       }
*     }
*   },
*   "schemas": [
*     {
*       "$ref": "#/components/schemas/IMember"
*     }
*   ]
* }
* ```
*/

const MemberJsonSchema = typia.json.application<[IMember], '3.0'>()
console.log(JSON.stringify(MemberJsonSchema, null, 2))

