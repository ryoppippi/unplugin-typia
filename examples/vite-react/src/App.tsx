import { useState } from 'react'
import './App.css'
import typia, { tags } from "typia";
import { v4 } from "uuid";
 
export const check = typia.createIs<IMember>();
 
interface IMember {
  id: string & tags.Format<"uuid">;
  email: string & tags.Format<"email">;
  age: number & tags.ExclusiveMinimum<19> & tags.Maximum<100>;
}


const member = {
  id: v4(),
  email: "example@example.com",
  age: 30,
} as const satisfies IMember;

const result = check(member);

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {result ? (<h1>Valid</h1>) : (<h1>Invalid</h1>)}
    </>
  )
}

export default App
