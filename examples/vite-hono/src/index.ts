import { Hono } from "hono";
import { typiaValidator } from "@hono/typia-validator";
import { validate } from "./types.js";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    success: true,
    message: "Hello World",
  });
});

app.post("/", typiaValidator("json", validate), (c) => {
  const data = c.req.valid("json");
  return c.json({
    success: true,
    message: `${data.name} is ${data.age}`,
  });
});

export default app;
