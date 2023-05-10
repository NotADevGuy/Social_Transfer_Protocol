import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Popup from "../Popup/Popup";
import "../main-styling.css"
import axios from "axios";
import {backendURL} from "../../config";
const bcrypt = require('bcryptjs');

function Registration() {
    const [formData, setFormData] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("Undefined error.");
    const [title, setTitle] = useState("Error");

    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();

        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(formData.password, salt);

        await axios.post(`${backendURL}/api/user/register`, {
            username: formData.username,
            password: hashPass,
            email: formData.email,
            name: formData.name
        })
            .then((response) => {
                setTitle("Account Registered")
                setMessage("Welcome to Social Transfer Protocol! You can log in now, or check your email for a surprise!")
                setShowPopup(true);
            })
            .catch((err) => {
                setMessage(`Error ${err.response.data.status}: ${err.response.data.message}`)
                setTitle("Encountered an Error")
                setShowPopup(true)
            });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handlePopupClose = () => {
        setShowPopup(false);
        if (title === "Account Registered") {
            navigate("/login");
        }
    }

    return (
        <div className="main-div">
            <div className="form-info">
                <h2 className="title">
                    Register for an Account
                </h2>
                <p className="desc">
                    Create a new account to access all the features of
                    our platform.
                </p>
            </div>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-item">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input pattern="^[A-Za-z][A-Za-z0-9_]{7,29}$" type="text" id="username" name="username"  className="form-input" placeholder="Enter a username" value={formData.username} onChange={handleInputChange} required />
                </div>
                <div className="form-item">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input pattern="^(?!.* )(?=.*\d)(?=.*[A-Z]).{8,15}$" type="password" id="password" name="password"  className="form-input" placeholder="Enter a password" value={formData.password} onChange={handleInputChange} required />
                </div>
                <div className="form-item">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" id="email" name="email"  className="form-input" placeholder="Enter your email address" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="form-item">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" id="name" name="name"  className="form-input" placeholder="Enter your name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <button className="btn-primary" type="submit">Create Account</button>
                <div className="form-options">
                    <p>Already have an account? <Link to="/login" className="form-link">Login here</Link>.</p>
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

export default Registration;
