import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
const Home = () => {

    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        fetch('/allpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setData(result.posts)
                console.log(result)
            })

    }, [])
    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => console.log(err))
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => console.log(err))
    }
    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify(
                {
                    postId,
                    text
                }
            )
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => console.log(err))
    }
    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
            })
    }

    return (

        <div className="home">
            {

                data.map((item) => (
                    <div className="card home-card">
                        <div>
                            <div style={{ float: "left", margin: "10px", marginRight: "20px" }}>
                                <img style={{ width: "35px", heigth: "35px", borderRadius: "80px" }}
                                    src={item.postedBy.pic}
                                    alt={item.postedBy._id}
                                />
                            </div>
                            <div style={{ margin: "20px" }}>
                                <h5 style={{ padding: "5px" }}><Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile/"}>{item.postedBy.name}</Link> {item.postedBy._id == state._id &&
                                    <i className="material-icons" style={{ float: "right" }}
                                        onClick={() => { deletePost(item._id) }}
                                    >delete</i>
                                }</h5>
                            </div>
                        </div>
                        <div className="card-image">
                            <img src={item.photo} alt={item.title} />
                        </div>
                        <div className="card-content">
                            <i className="material-icons" style={{ color: "red" }}>favorite</i>
                            {item.likes.includes(state._id)
                                ? <i className="material-icons"
                                    onClick={() => { unlikePost(item._id) }}
                                >thumb_down</i> :
                                <i className="material-icons"
                                    onClick={() => { likePost(item._id) }}
                                >thumb_up</i>

                            }

                            <h6>{item.likes.length} likes</h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            {
                                item.comments.map(record => {
                                    return (
                                        <div>
                                            <div style={{ float: "left", marginRight:"5px"}}>
                                                <img style={{ width: "15px", heigth: "15px", borderRadius: "80px" }}
                                                    src={record.postedBy.pic}
                                                    alt={record.postedBy._id}
                                                />
                                            </div>
                                            <div>
                                                <h6 key={record._id}><span style={{ fontWeight: "500" }}>{record.postedBy.name}</span> {record.text}</h6>
                                            </div>
                                        </div>

                                    )
                                })
                            }
                            <form onSubmit={(e) => {
                                e.preventDefault()
                                makeComment(e.target[0].value, item._id)
                            }}>
                                <input type="text" placeholder="add a comment" />
                            </form>
                        </div>
                    </div>

                ))
            }
        </div>
    )
}
export default Home