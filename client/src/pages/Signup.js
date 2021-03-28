import React, {useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Singup = () => {
  const history = useHistory();
  const [name,setName] = useState("")
  const [password,setPassword] = useState("")
  const [email,setEmail] = useState("")
  const [image,setImage] = useState("")
  const [url,setUrl] = useState(undefined)

  useEffect(()=>{
    if(url){
      uploadFields()
    }
  },[url])

  const uploadProfilePic = () => {
      const data = new FormData()
      data.append("file", image)
      data.append("upload_preset", "ovo-test")
      data.append("cloud_name","ovoovo")
      fetch("	https://api.cloudinary.com/v1_1/ovoovo/image/upload", {
        method: "POST",
        body: data,
      })
      .then(res => res.json())
      .then(data => {
        setUrl(data.url)
        console.log(data.url)
        console.log(url)
      })
      .catch(err => console.log(err))

  }

  const uploadFields = () => {
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      M.toast({html: "invalid email"})
      return
    }
    fetch("/signup", { 
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
        name,
        password,
        email,
        pic: url,
      })
    }).then(res => res.json())
    .then(data => {
     if(data.error) {
       M.toast({html: data.error})
     } else {
      M.toast({html: data.message})
      history.push('/login')
     }
    })
    .catch(err => {console.log(err)})
  }

  const PostData = () => {
    if(image){
      uploadProfilePic()
    } else {
      uploadFields()
   }
  }

    return (
      <div className="mycard">
        <div className="card auth-card">
            <div className="card-content input-field">
                <h2 style={{color: 'white'}}>OvO</h2>
                 <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)}/>
                 <input type="text" placeholder="email"value={email} onChange={e => setEmail(e.target.value)} />
                 <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)}/>
                 <div className="file-field input-field"> 
                  <div className="btn #757575 grey darken-1">
                      <span>Select Profile Pic</span>
                      <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                  </div>
                  <div className="file-path-wrapper">
                      <input className="file-path validate" type="text"/>
                  </div>
                </div>
               <button className="btn waves-effect waves-light #212121 grey darken-4" type="submit" name="action" onClick={()=>PostData()}>
                    Sign Up
                </button>
                    <h6>
                    <Link to="/login">
                        Already have an account?
                    </Link>
                    </h6>
            </div>
        </div>
      </div>
    )
}

export default Singup