import React, {useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Createpost = () => {
  const history = useHistory();
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("")

  useEffect(()=>{
      if(url){
        fetch("/post", { 
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("jwt")
          },
          body:JSON.stringify({
            title,
            body,
            pic:url
          })
        }).then(res => res.json())
        .then(data => {
        if(data.error) {
          M.toast({html: data.error})
        } else {
          M.toast({html: "posted succesfully"})
          history.push('/')
        }
        })
        .catch(err => {console.log(err)})
      }
  },[url])

  const postDetails = () => {
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

    return (
      <div className="card input-field" style={{
        marginTop: "15%",
        margin: "10px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign:"center"
      }}>
          <input type="text" placeholder="title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
          <input type="text" placeholder="body"value={body} onChange={(e)=>setBody(e.target.value)}/>
          <div className="file-field input-field"> 
            <div className="btn #757575 grey darken-1">
                <span>Select Photo</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
          </div>
            <button class="btn waves-effect waves-light #757575 grey darken-1" type="submit" name="action" onClick={()=>postDetails()}>
             Post
            </button>
      </div>
    )
}

export default Createpost