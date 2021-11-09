import React, { useState, useContext } from "react"
import AuthForm from "./AuthForm.js"
import { UserContext } from "./context/UserProvider.js"

export default function Auth(){
  const [inputs, setInputs] = useState()
  const [toggle, setToggle] = useState(false)

  const { signup, login, errMsg, resetAuthErr } = useContext(UserContext)

  function handleChange(e){
    const { name, value } = e.target
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]:value
    }))
  }
  function handleSignup(e){
    e.preventDefault()
    signup(inputs)
  }
  function handleLogin(e){
    e.preventDefault()
    login(inputs)
  }
  function toggleForm(){
    setInputs(prev => !prev)
    resetAuthErr()
  }

  return(
    <div>
      <h1>Todo App</h1>
      {!toggle ?
        <>
          <AuthForm
            handleChange={handleChange}
            handleSubmit={handleSignup}
            inputs={inputs}
            btnText="Signup"
            errMsg={errMsg} />
            <p onClick={toggleForm}>Already a Member?</p>
        </>
        :
        <>
          <AuthForm
            handleChange={handleChange}
            handleSubmit={handleLogin}
            inputs={inputs}
            btnText="Login"
            errMsg={errMsg} />
            <p onClick={toggleForm}>Not a Member?</p>
        </>
      }
    </div>
  )
}