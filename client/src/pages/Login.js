import React, {useState, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../App'

const Login = () => {
  const {state,dispatch} = useContext(UserContext);
  const history = useHistory();
  const [password,setPassword] = useState("")
  const [email,setEmail] = useState("")

  const PostData = () => {
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      M.toast({html: "invalid email"})
      return
    }
    fetch("/signin", { 
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
        email,
        password
      })
    }).then(res => res.json())
    .then(data => {
     if(data.error) {
       M.toast({html: data.error})
     } else {
       localStorage.setItem("jwt", data.token)
       localStorage.setItem("user", JSON.stringify(data.user))
       dispatch({type: "USER", payload: data.user})
      M.toast({html: "signedin succesfully"})
      history.push('/')
     }
    })
    .catch(err => {console.log(err)})
  }

    return (
      <div className="mycard">
        <div className="card auth-card">
            <div className="card-content input-field">
                <h2 style={{color: 'white'}}>OvO</h2>
                <input type="text" placeholder="email"value={email} onChange={e => setEmail(e.target.value)} />
                 <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)}/>
               <button className="btn waves-effect waves-light #212121 grey darken-4" type="submit" name="action" onClick={()=>PostData()}>
                    Sign In
                </button>
                <h6>
                    <Link to="/login">
                        Don't have an account?
                    </Link>
                    </h6>
            </div>
        </div>
      </div>
    )
}

export default Login