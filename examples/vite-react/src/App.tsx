import { useEffect, useState } from 'react'
import './App.css'
import { v4 } from 'uuid'
import { type IMember, type IValidation, validate } from './types.js'

function InputForm() {
  const [email, setEmail] = useState("example@example.com")
  const [age, setAge] = useState(19)
  const [result, setResult] = useState<IValidation | null>(null)

  useEffect(() => {
    const member = {
      id: v4(),
      email,
      age,
    } as const satisfies IMember;
    const result = validate(member);
    setResult(result);
  }, [email, age])


  return (
    <form style={ {display: 'flex', flexDirection: 'column', gap: '10px'} }>
      <div>
      <label>Email</label>
        <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      </div>
      <div>
        <label>Age</label>
        <input
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
      />
      </div>
      <div>
        {(result?.success === true)
          ? <p style={{color: 'green'}}>Valid</p> 
          : <p style={{color: 'red'}}>
            { result?.errors != null ? JSON.stringify(result.errors) : 'Invalid' }
          </p>}
      </div>
    </form>
  )
}

function App() {
  return (
    <div className="App">
      <InputForm />
    </div>
  )
}

export default App
