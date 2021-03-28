import React, {useState, useEffect, useContext}from 'react'
import { UserContext } from '../App'
import {useParams} from 'react-router-dom'

const Profile = () => {
    // const [myPics, setMyPics] = useState([])
    const [userProfile, setProfile] = useState(null)
    const {state,dispatch} = useContext(UserContext)
    const {userId} = useParams()

    const [showFollow, setShowFollow] = useState(state?!state.following.includes(userId):true)


    useEffect(()=>{
        fetch(`/user/${userId}`,{
        headers:{
            "Authorization": "Bearer " + localStorage.getItem("jwt")
        }}).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setProfile(result)
        })
    },[])

    const followUser = () => {
        fetch("/follow",{
            method: "PUT",
            headers:{
                 "Content-Type": "application/json",
                 "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
            body: JSON.stringify({
                followId: userId,
            })
        }).then(res=>res.json)
        .then(data=>{
            dispatch({type:"UPDATE", payload:{following: data.following, followers: data.followers}})
            localStorage.setItem("user", JSON.stringify(data))
            setProfile((prevState) => {
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers: [...prevState.user.followers, data._id]
                    }
                }
            })
        })
        setShowFollow(false)
    }

    const unfollowUser = () => {
        fetch("/unfollow",{
            method: "PUT",
            headers:{
                 "Content-Type": "application/json",
                 "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
            body: JSON.stringify({
                unfollowId: userId,
            })
        }).then(res=>res.json)
        .then(data=>{
            dispatch({type:"UPDATE", payload:{following: data.following, followers: data.followers}})
            localStorage.setItem("user", JSON.stringify(data)) 
            setProfile((prevState) => {
                const newFollower = prevState.user.followers.filter(item=>item !== data._id)
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers: newFollower
                    }
                }
            })
        })
        setShowFollow(true)
    }

    return (
        <>
        {userProfile ? 
        <div style={{maxWidth: "550px", margin: "0 auto"}}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                margin: "10px 0px",
                borderBottom: "1px solid",
            }}>
                <div>
                    <img style={{width: "160px", height: "160px", borderRadius: "50%" }} 
                    src={userProfile.user.pic} /> 
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <h5>{userProfile.user.email}</h5>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <h6> {userProfile.user.followers.length} Followers</h6>
                        <h6> {userProfile.user.following.length} Following</h6>
                        <h6> {userProfile.posts.length} Posts</h6>
                    </div>
                    { showFollow ? 
                <button style={{margin: "8px"}} className="btn waves-effect waves-light #212121 grey darken-4" type="submit" name="action" onClick={()=>followUser()}>
                Follow
              </button> 
              : 
              <button style={{margin: "8px"}} className="btn waves-effect waves-light #212121 grey darken-4" type="submit" name="action" onClick={()=>unfollowUser()}>
              Unfollow
            </button>   
                }
                    
                  
                </div>
            </div>
            <div className="gallery">
                {
                    userProfile.posts.map(item => {
                        return (
                            <img className="item" key={item._id} src={item.photo} />
                        )
                    })
                }
            </div>
        </div>
        :
        <h2>loading</h2>}
        
     </>
    )
}

export default Profile