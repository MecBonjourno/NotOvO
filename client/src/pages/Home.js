import React, {useState, useEffect, useContext} from 'react'
import {Link} from 'react-router-dom'
import {UserContext} from '../App'

const Home = () => {

    const [data, setData] = useState([])
    const {state,dispatch} = useContext(UserContext)

    useEffect(()=>{
        fetch("/allposts",{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result => {
           setData(result.posts)
           console.log(result.posts)
        })
    },[])

    const LikePost = (id) => {
        fetch("/like",{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id,
            })
        }).then(res=>res.json())
        .then(result => {
            const newData = data.map(item =>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
            console.log(result)
        })
        .catch(err =>{console.log(err)});
    }

    const UnLikePost = (id) => {
        fetch("/unlike",{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id,
            })
        }).then(res=>res.json())
        .then(result => {
            const newData = data.map(item =>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
            console.log(result)
        })
        .catch(err =>{console.log(err)});

    }

    const Commented = (text, postId) => {
        fetch("/comment", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
        .then(result => {
            const newData = data.map(item =>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
            console.log(result)
        })
        .catch(err =>{console.log(err)});
    }

    const DeletePost = (postId) => {
        fetch(`/delete/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        }).then(res => res.json())
        .then(result => {
            console.log(result)
            const newData = data.filter(item => {
                return item._id !== result._id
            })
            setData(newData)
        })
    }


    return (
        <div>
                {data.map(item=> {
                    return (
                <div className="card home-card #00acc1 cyan darken-1" key={item._id} >
                <h5 className="home-card-postedBy"><Link to={item.postedBy._id !== state._id ? "/user/"+item.postedBy._id : "/profile"} style={{color: "#000!important"}}>{item.postedBy.name}</Link>
                    {item.postedBy._id === state._id &&
                    <i className="material-icons" style={{float: 'right'}} onClick={()=>DeletePost(item._id)}>delete</i>
                    }
                 </h5>
                 <div className="card-image">
                     <img src={item.photo} />
                 </div>
                 <div className="card-content"> 
                 {item.likes.includes(state._id)
                    ?
                    <i className="material-icons" onClick={ () => {UnLikePost(item._id)} }>thumb_down</i>
                    :
                    <i className="material-icons" onClick={ () => {LikePost(item._id)} }>thumb_up</i>
                 }
                    <h6>{item.likes.length} likes</h6>
                    <h6>{item.title}</h6>
                    <p>{item.body}</p>
                    {
                        item.comments.map(record => {
                            return(
                                <h6 key={record._id}><span style={{fontWeight: "500"}}>{record.postedBy.name}</span> {record.text}</h6>
                            )
                        })
                    }
                    <form onSubmit={ (e) =>{
                        e.preventDefault()
                        Commented(e.target[0].value, item._id)
                    }}>   
                    <input type="text" placeholder="comenta ai" />
                 </form>
                 </div>
            </div>)
                })}
            
        </div>
    )
}

export default Home