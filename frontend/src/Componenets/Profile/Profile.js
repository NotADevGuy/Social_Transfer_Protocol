import {useContext, useEffect, useState} from 'react';
import { UserContext } from '../../App';
import {useNavigate, useParams} from 'react-router-dom';
import axios from "axios";
import "../main-styling.css"
import {backendURL} from "../../config";

export function Profile() {
    const {user} = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const {username} = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`${backendURL}/api/user/get/${username}`)
            .then((res) => {
                setProfile(res.data.profile);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [username]);


    const handleAddFriend = async (friend) => {
        // alert("HEY " + friend)
        await axios.post(`${backendURL}/api/user/addfriend`, {
            sender: user.username,
            recipient: friend
        })
            .then(() => {
                alert("Friend request sent!")
                // navigate("/profile/" + profile.username)
            })
            .catch((response) => {
                alert(response.response.data.message);
            })
    }
    const handleDelete = async (file) => {
        axios.post(`${backendURL}/api/user/removefile`, {
            id: file._id,
            username: profile.username,
            filename: file.name
        })
            .then(() => {
                alert("File deleted successfully")
                navigate("/profile/" + profile.username)
            })
            .catch((response) => {
                alert(response.response.data.message);
            })
    }

    if (!profile) {
        return (<div>User not found...</div>)
    }

    const isSelf = user.username === profile.username;

    return (
        <div className="main-div">
            <div className="form">
                <div className="form-info">
                    <h2>{profile.name}'s Profile</h2>
                    <h2>@{profile.username}</h2>
                    {!isSelf && (
                        <form onSubmit={() => handleAddFriend(profile.username)}>
                            <button type="submit" className="btn-primary">Add Friend</button>
                        </form>
                    )}
                </div>

                <div className="form-item">
                    <p className="desc">Friends: {" "}</p>
                    {profile.friends.map((friend) => (
                        <div key={friend.user} className="friend-container">
                            <label className="form-label">{friend.username}</label>
                            {/* Code for future addition of remove friend option. */}
                            {/*{isSelf && (*/}
                            {/*    <form onSubmit={() => handleDelete(friend._id)}>*/}
                            {/*        <button type="submit">Delete</button>*/}
                            {/*    </form>*/}
                            {/*)}*/}
                        </div>
                    ))}

                <div className="form-item">
                    <p className="desc">Files: {" "}</p>
                    {profile.files.map((file) => (
                        <div key={file._id} className="file-container">
                            <label className="form-label">{file.name}</label>
                            {isSelf && (
                                <form onSubmit={() => handleDelete(file)}>
                                    <button className="btn-primary" type="submit">Delete</button>
                                </form>
                            )}
                        </div>
                    ))}
                </div>

                </div>
            </div>
        </div>
    )
}