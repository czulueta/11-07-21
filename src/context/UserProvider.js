import React, { useState } from "react"
import axios from "axios"

export const UserContext = React.createContext()

const userAxios = axios.create()

userAxios.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  config.headers.Authorization = `Bearer ${token}`
  return config
})

export default function UserProvider(prop){
  const initState = {
    user: JSON.parse(localStorage.getItem("user")) || {}, 
    token:localStorage.getItem("token") || "", 
    todos: []
  }
  const { userState, setUserState } = useState(initState)

  function signup(credentials){
    axios.get("/auth/signup", credentials)
      .then(res => {
        const { user, token } = res.data
        localStorage.setItem("token")
        localStorage.setItem("user", JSON.stringify(user))
        setUserState(prevUserState => ({
          ...prevUserState,
          user, 
          token
        }))
      })
      .catch(err => handleAuthErr(err.response.data.errMsg))
  }
  function login(credentials){
    axios.get("/auth/login", credentials)
      .then(res => {
        const { user, token } = res.data
        localStorage.setItem("token")
        localStorage.setItem("user", JSON.stringify(user))
        getUserTodos()
        setUserState(prevUserState => ({
          ...prevUserState,
          user,
          token
        }))
      })
      .catch(err => handleAuthErr(err.response.data.errMsg))
  }
  function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUserState({
      user: {},
      token: "",
      todos: []
    })
  }
  function addTodo(newTodo){
    userAxios.post("/api/todo", newTodo)
      .then(res => {
        setUserState(prevState => ({
          ...prevState,
          todos: [...prevState.todos, res.data]
        }))
      })
      .catch(err => console.log(err.response.data.errMsg))
  }
  function getUserTodos(){
    userAxios.get("/api/todo/user")
      .then(res => {
        setUserState(prevState => ({
          ...prevState,
          todos: res.data
        }))
      })
      .catch(err => console.log(err.response.data.errMsg))
  }
  function resetAuthErr(){
    setUserState(prevState => ({
      ...prevState,
      errMsg: ""
    }))
  }
  function handleAuthErr(errMsg){
    setUserState(prevState => ({
      ...prevState,
      errMsg
    }))

  }
  return(
    <UserContext.Provider value={{
      ...userState,
      signup,
      login,
      logout,
      addTodo,
      resetAuthErr
    }}>
      {props.children}
    </UserContext.Provider>
  )
}