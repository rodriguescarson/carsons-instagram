import './App.css';
import React, { useEffect, createContext, useReducer ,useContext } from 'react'
import NavBar from './components/NavBar'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import Home from './components/Screens/Home'
import SignIn from './components/Screens/SignIn'
import Profile from './components/Screens/Profile'
import Signup from './components/Screens/Signup'
import CreatePost from './components/Screens/CreatePost'
import { reducer, initialState } from './reducer/userReducer'
import UserProfile from './components/Screens/UserProfile'
import SubscribeUserPosts from './components/Screens/SubscribeUserPosts'
export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const {state,dispatch} =useContext(UserContext)
  useEffect(() => { 
    const user = JSON.parse(localStorage.getItem("user"))

    if (user) {
      dispatch({type:"USER",payload:user})

    } else {
      history.push('/signin') 
    }
  }, [])

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <SignIn />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribeUserPosts />
      </Route>
    </Switch>
  )
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;