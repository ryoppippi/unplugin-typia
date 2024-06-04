"use client";

import { useFormState } from 'react-dom'
import type { Entries } from 'type-fest';
import  { type IMember, randomOnServer  } from '../actions';

export default function RandomDataClient({ initialData }: { initialData: IMember }) {
  const [state, formAction] = useFormState(randomOnServer, initialData);

  return (
    <div>
      <div style={
        {
          display:  "grid",
          placeContent: "center",
          placeItems: "center",
        }
      }>
        <h1> Random Data </h1>
        <div>
          {
            (Object.entries(state) as Entries<IMember> )
            .map(([key, value]) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                <span> {`${key}:\t${value}`} </span>
              </div>
            )
            )
          }
        </div>
        <form
          style={{
            display: "block",
            margin: "auto"
          }}
          action={formAction}
        >
          <button
          >
            Randomize
          </button>
        </form>
      </div>
    </div>
  );
}
