import { Hono } from "hono";
import { validator } from 'hono/validator'
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
const check = typia.createIs<Author>();


const app = new Hono();

app.post("/",
  validator('json', (v, c)=>{
    const result = check(v);
    if (!result){
      return c.json({success: false, message: 'Invalid data', data: v})
    }
    return v
  })
  , (c) => {
  const data = c.req.valid("json");
  return c.json({
    success: true,
    message: `${data.name} is ${data.age}`,
  });
});

export default app;
