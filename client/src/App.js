import React, {useEffect, createContext, useReducer, useContext} from 'react'
import Navbar from './components/Navbar'
import './app.css'
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Signup from './pages/Signup'
import Createpost from './pages/CreatePost'
import UserProfile from './pages/UserProfile'
import FollowingPost from './pages/FollowingPosts'

import {reducer, initialState} from './reducers/userReducer'

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory();
  const {state,dispatch} = useContext(UserContext)

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type: 'USER', payload: user})
    } else {
      history.push('/login')
    }
  },[])

  return(
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route path="/followingposts" component={FollowingPost}/>
      <Route path="/login" component={Login}/>
      <Route path="/signup" component={Signup}/>
      <Route path="/profile" component={Profile}/>
      <Route exact path="/user/:userId" component={UserProfile}/> {/* //talvez seja mais interessante colocar direto o userID */}
      <Route path="/createpost" component={Createpost}/>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
