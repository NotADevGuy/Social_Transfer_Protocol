import React from 'react';
import './Popup.css';

function Popup(props) {
    return (
        <div className="popup-container">
            <div className="popup">
                <h2>{props.title}</h2>
                <p>{props.message}</p>
                <button onClick={props.onClose}>Close</button>
            </div>
        </div>
    );
}

export default Popup;
