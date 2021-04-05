import React, { useContext, useRef, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'
import { Dropdown } from 'react-bootstrap';

const NewNavbar = () => {
  const searchModal = useRef(null)
  const {state, dispatch} = useContext(UserContext)
  const history = useHistory();
  const [search, setSearch] = useState('')
  const [userFound, setUserFound] = useState([])
  
  useEffect(() => {
    M.Modal.init(searchModal.current)
  },[])

  const renderList = () => {
    if(state){
      return [ 
      <li key={"0"}><i data-target="modal1" className="material-icons modal-trigger">search</i> </li>,
        <li key={"1"}><Link  to="/profile">Profile</Link></li>,
          <li key={"2"}><Link  to="/createpost">Post</Link></li>,
          <li key={"3"}><Link  to="/followingposts">My Feed</Link></li>,
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
          <li key={"4"}><Link  to="/signup">SignUp</Link></li>,
          <li key={"5"}><Link  to="/login">Login</Link></li>
        ]
    }
  }

  const fetchUsers = (query) =>{
    setSearch(query)
    fetch("/search",{
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        query
      })
    }).then(response => response.json())
    .then(result => {
      setUserFound(result.user)
    })
  }

    return(
    <div className="navbar-fixed">

    <nav>  

        <div className="nav-wrapper black">
        <Link to={state?"/":"/signin"} className="brand-logo left" style={{fontSize: "48px", padding: "4px"}}>OvO</Link>
            {/* <ul id="nav-mobile" className="right ">
            {renderList()}
            </ul> */}
        <Dropdown className="dropped right "> 
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                Menu
            </Dropdown.Toggle>
         <Dropdown.Menu >
                <Dropdown.Item className="noHover">
                  {renderList()}
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        </div>
       
            <div id="modal1" className="modal #212121 grey darken-4" ref={searchModal}>
             <div className="modal-content #212121 grey darken-4">
                <input type="text" placeholder="Search" value={search} onChange={e => fetchUsers(e.target.value)}/>
                <ul className="collection #212121 grey darken-4" style={{color: "black"}}>
                    {userFound.map(item => {
                return  <Link to={item._id !== state._id ? "/user/"+item._id : "/profile"}
                onClick={()=>{M.Modal.getInstance(searchModal.current).close()
                    setSearch('')}}><li className="collection-item #212121 grey darken-4">{item.email}</li></Link> 
                    } )}
                </ul>
            
                  </div>
              <div className="modal-footer #212121 grey darken-4">
             <button href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>Close</button>
            </div>
            
        </div>
    </nav>
  </div>
  )
}

export default NewNavbar;