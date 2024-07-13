<script lang="ts">
  import { v4 } from "uuid";
  import typia, { type tags } from "typia";

  interface IMember {
    id: string & tags.Format<"uuid">;
    email: string & tags.Format<"email">;
    age: number & tags.ExclusiveMinimum<19> & tags.Maximum<100>;
  }

  const check = typia.createIs<IMember>();

  let member = $state<IMember>({
    id: v4(),
    email: "samchon.github@gmai19l.com",
    age: 20,
  })

  let isValid = $derived(check(member))
</script>

<h1>
  {isValid ? "Valid" : "Invalid"}
</h1>

<div>
  <p>{member.id}</p>
</div>

<div style="display: flex; flex-direction: column;">
  <div>
    <label for="email">Email</label>
    <input type="text" id="email" bind:value={member.email} />
  </div>
  <div>
    <label for="age">Age</label>
    <input type="number" id="age" bind:value={member.age} />
  </div>
</div>

