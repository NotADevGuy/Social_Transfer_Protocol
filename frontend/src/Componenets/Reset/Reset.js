import React, { useState } from 'react';
import {Link, useNavigate, } from 'react-router-dom';
import Popup from '../Popup/Popup';
import "../main-styling.css"

function PasswordReset() {
    const [formData, setFormData] = useState({
        emailOrUsername: '',
    });
    const navigate = useNavigate()


    const [showPopup, setShowPopup] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setShowPopup(true);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handlePopupClose = () => {
        setShowPopup(false);
        navigate("/login")
    };

    return (
        <div className="main-div">
            <div className="form-info">
                <h2 className="title">
                    Reset Your Password
                </h2>
                <p className="desc">
                    Enter your email address or username below and we'll send you a link to
                    reset your password.
                </p>
            </div>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-item">
                    <label htmlFor="email-or-username" className="form-label">Email or Username</label>
                    <input
                        type="text"
                        id="email-or-username"
                        name="emailOrUsername"
                        className="form-input"
                        placeholder="Enter your email or username"
                        value={formData.emailOrUsername}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className="btn-primary">
                    Reset Password
                </button>
                <div className="form-options">
                    <p>
                        Remember your password?
                        <span/>
                        <Link to="/login" className="form-link">
                            Login now
                        </Link>
                        .
                    </p>

                </div>
            </form>
            {showPopup && (
                <Popup
                    title="Instructions Sent"
                    message="Please check your email for password reset instructions."
                    onClose={handlePopupClose}
                />
            )}
        </div>
    );
}

export default PasswordReset;
