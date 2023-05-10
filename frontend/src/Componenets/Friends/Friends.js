import {useContext, useEffect, useState} from 'react';
import { UserContext } from '../../App';
import axios from "axios";
import "../main-styling.css"
import {backendURL} from "../../config";

export function Friends () {
    const {user, setUser} = useContext(UserContext);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        axios.get(`${backendURL}/api/user/getfriendrequests/${user.username}`)
            .then((res) => {
                setRequests(res.data.requests);
            })
            .catch((err) => {
                console.log(err);
            })
    })

    const handleAccept = async (request) => {
        await axios.post(`${backendURL}/api/user/acceptfriendrequest`, {
            id: request._id
        })
            .then(() => {
                alert("Friend request accepted!")
            })
            .catch((response) => {
                alert(response.response.data.message);
            })
    }

    const handleDecline = async (request) => {
        await axios.post(`${backendURL}/api/user/declinefriendrequest`, {
            id: request._id
        })
            .then(() => {
                alert("Friend request declined!")
            })
            .catch((response) => {
                alert(response.response.data.message);
            })
    }

    const getIP = async (username) => {
        await axios.get(`${backendURL}/api/user/getIP/${username}`)
            .then((res) => {
                alert(`${username}: ${res.data.ip}`)
            })
            .catch((err) => {
                alert(err.response.data.message)
            })
    }

    return (
        <div className="main-div">
            <div className="form">
                <div className="form-options">
                    <p className="desc">Friends: </p>
                    <ul>
                        {user.friends.map((friend) => (
                            <div key={friend.username} className="friend-container">
                                <a href={`/profile/${friend.username}`} className="form-label">
                                    {friend.username}:
                                </a>
                                <button className="btn-primary" onClick={()=>{getIP(friend.username)}}>Show IP</button>
                            </div>
                            ))}

                    </ul>
                </div>
            </div>

            <br/>

            <div className="form">
                <div className="form-options">
                    <p className="desc">Friend Requests: </p>
                    <ul>
                        {(requests !== null && requests.length > 0) ? (
                            requests.map((request) => (
                                <li key={request._id}>
                                    <a href={`/profile/${request.sender.username}`}>
                                        {request.sender.username} wants to be your friend!
                                    </a>
                                    <br/>
                                    <button onClick={()=>{handleAccept(request)}} className="btn-primary">Accept</button>
                                    <span> | </span>
                                    <button onClick={()=>{handleDecline(request)}} className="btn-primary">Decline</button>
                                </li>
                            ))
                        ) : (
                            <div>No friend requests</div>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}