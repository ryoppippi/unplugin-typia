<script lang="ts">
import typia, { type tags } from "typia";

interface IMember {
  id: string & tags.Format<"uuid">;
  email: string & tags.Format<"email">;
  age: number & tags.ExclusiveMinimum<19> & tags.Maximum<100>;
}

const validate = typia.createValidate<IMember>();

let member = $state<IMember>({
  id: crypto.randomUUID(),
  email: "samchon.github@gmai19l.com",
  age: 20,
})

let validation = $derived(validate(member))
</script>

<h1> {validation.success ? "Valid" : "Invalid"} </h1>

<div style="display: flex; flex-direction: column; width: 100%;">
  <div>
    <label for="id">ID</label>
    <input type="text" id="id" value={member.id} disabled />
  </div>
  <div>
    <label for="email">Email</label>
    <input type="text" id="email" bind:value={member.email} />
  </div>
  <div>
    <label for="age">Age</label>
    <input type="number" id="age" bind:value={member.age} />
  </div>
</div>

{#if !validation.success}
  <p> errors: </p>
  <ul style="color: red;">
    {#each validation.errors as error, i}
      <li>{JSON.stringify(error)}</li>
    {/each}
  </ul>
{/if}
