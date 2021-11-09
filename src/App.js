import React, { useContext } from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import Navbar from "./components/Navbar.js"
import Auth from "./components/Auth.js"
import Profile from "./components/Profile.js"
import Public from "./components/Public.js"
import { UserContext } from "./context/UserProvider.js"
import ProtectedRoute from "./components/ProtectedRoute.js"

export default function App(){
  const { token, logout } = useContext(UserContext)
  return(
    <div>
      { token && <Navbar logout={logout}/>}
      <Switch>
        <Route
          path="/"
          render={() => token ? <Redirect to="/profile"/> : <Auth />} />
        <ProtectedRoute
          path="/"
          component={Profile}
          token={token}
          redirectTo="/" />
        <ProtectedRoute
          path="/"
          component={Public}
          token={token}
          redirectTo="/" />
      </Switch>
    </div>
  )
}