import typia from "typia";
import type { IMember } from "../actions";
import RandomDataClient from "./client";

export default function RandomData() {

  return (
    <RandomDataClient initialData={typia.random<IMember>()} />
  )
}
