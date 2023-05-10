import React, {useContext, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import "../main-styling.css"
import axios from 'axios'
import Popup from "../Popup/Popup";
import {UserContext} from "../../App";
import {backendURL} from "../../config";

function Login() {
    const {setUser, setLogged, logged} = useContext(UserContext);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("Undefined error.");
    const [title, setTitle] = useState("Error");
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const handlePopupClose = () => {
        setShowPopup(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Uncomment to prevent the form from submitting

        await axios.post(`${backendURL}/api/user/login`, {
            email: formData.email,
            password: formData.password
        }, {withCredentials: true})
            .then((response) => {
                setLogged(true);
                setUser(response.data.userInfo);
                setTitle("Login Successful")
                setMessage("Welcome back!")
                setShowPopup(true)

                navigate("/");
            })
            .catch((err) => {
                console.log(err)
                setTitle("Encountered an Error")
                setMessage(`Error ${err.response.data.status}: ${err.response.data.message}`)
                setShowPopup(true)
            })
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="main-div">
            <div className="form-info">
                <h2 className="title">
                    Social Transfer Network
                </h2>
                <p className="desc">
                    We provide a social network with a built-in P2P file
                    transfer system, offering fast and secure file sharing.
                    Our platform includes social features that promote
                    community and connection between users, with additional
                    benefits for those who use our P2P system.
                </p>
            </div>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-item">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input type="email" id="email" name="email" placeholder="Enter email" className="form-input" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="form-item">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input type="password" id="password" name="password" placeholder="Enter password" className="form-input" value={formData.password} onChange={handleInputChange} required />
                </div>
                <button type="submit" className="btn-primary">Login</button>
                <div className="form-options">
                    <p>
                        <Link to="/reset" className="form-link">Forgot Password?</Link>
                        <span> | </span>
                        <Link to="/register" className="form-link">Create an Account</Link>
                    </p>
                </div>
            </form>
            {showPopup && (
                <Popup
                    title={title}
                    message={message}
                    onClose={handlePopupClose}
                />
            )}
        </div>
    );
}

export default Login;
