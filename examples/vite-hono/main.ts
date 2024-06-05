import { Hono } from "hono";
import { typiaValidator } from '@hono/typia-validator'
import typia, { type tags } from "typia";

/** define the author interface */
interface Author {
  name: string;
  age:
  & number
  & tags.Type<"uint32">
  & tags.Minimum<20>
  & tags.ExclusiveMaximum<100>;
}

/** create a validate function */
const validate = typia.createValidate<Author>();


const app = new Hono();

app.post("/",
  typiaValidator('json', validate),
  (c) => {
    const data = c.req.valid("json");
    return c.json({
      success: true,
      message: `${data.name} is ${data.age}`,
    });
  });

export default app;
