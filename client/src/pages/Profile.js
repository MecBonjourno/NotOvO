import React, {useState, useEffect, useContext}from 'react'
import { UserContext } from '../App'

const Profile = () => {
    const [myPics, setMyPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    // const [url,setUrl] = useState(undefined)

    useEffect(()=>{
        fetch("/myposts",{
        headers:{
            "Authorization": "Bearer " + localStorage.getItem("jwt")
        }}).then(res=>res.json())
        .then(result=>{
            setMyPics(result.mypost)
        })
    },[])

    useEffect(()=>{
        if(image){
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
            //   setUrl(data.url)
            //   console.log(data.url + " update perfil")
            //   localStorage.setItem("user", JSON.stringify({...state,pic:data.url}))
              fetch("/updatepic",{
                  method: "PUT",
                  headers: {
                      'Content-Type':"application/json",
                      "Authorization": "Bearer " + localStorage.getItem("jwt")
                    },
                    body: JSON.stringify({
                        pic: data.url
                    })
              }).then(res => res.json())
              .then(
                  result => {
                      console.log(result)
                    localStorage.setItem("user", JSON.stringify({...state, pic:result.pic}))
                    dispatch({type:"UPDATEPIC", payload:result.pic})
                })
            //   window.location.reload()
            })
            .catch(err => console.log(err))
        }
    },[image])

    const updatedProfilePic = (file) => {
        setImage(file)
    }

    return (
        <div style={{maxWidth: "550px", margin: "0 auto"}}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                margin: "10px 0px",
                borderBottom: "1px solid",
            }}>
                <div>
                    <img style={{width: "160px", height: "160px", borderRadius: "50%" }} 
                    src={state?state.pic:"loading"}/> 
             <div className="file-field input-field"> 
                  <div className="btn #757575 grey darken-1">
                      <span>Select Profile Pic</span>
                      <input type="file" onChange={(e)=>updatedProfilePic(e.target.files[0])}/>
                  </div>
                 
                </div>
                </div>
               
                <div>
                    <h4>{state?state.name:"loading"}</h4>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <h6> {myPics.length} Posts </h6>
                        <h6> {state?state.followers.length: "loading"} followers </h6>
                        <h6> {state?state.followers.length: "loading"} following </h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    myPics.map(item => {
                        return (
                            <img className="item" key={item._id} src={item.photo} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Profile