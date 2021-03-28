import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {UserContext} from '../App'

const Navbar = () => {
  const {state, dispatch} = useContext(UserContext)
  const history = useHistory();
  const renderList = () => {
    if(state){
      return [ 
        <li key={"a"}><Link  to="/profile">Profile</Link></li>,
          <li key={"b"}><Link  to="/createpost">Post</Link></li>,
          <li key={"c"}><Link  to="/followingposts">My Feed</Link></li>,
          <li>
            <button className="btn waves-effect waves-light #212121 grey darken-4" type="submit" name="action" 
            onClick={()=> {
            localStorage.clear()
            dispatch({type: "CLEAR"})
            history.push("/login")
          }
            }>
                    Logout
                </button>
            </li>
      ]
    }else {
        return [
          <li key={"d"}><Link  to="/signup">SignUp</Link></li>,
          <li key={"e"}><Link  to="/login">Login</Link></li>
        ]
    }
  }

    return(
    <div className="navbar-fixed">
    <nav>
     <div className="nav-wrapper black">
      <Link to={state?"/":"/signin"} className="brand-logo left" style={{fontSize: "48px", padding: "4px"}}>OvO</Link>
        <ul id="nav-mobile" className="right ">
          {renderList()}
        </ul>
     </div>
  </nav>
  </div>
  )
}

export default Navbar;