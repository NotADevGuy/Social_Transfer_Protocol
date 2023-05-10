import { useState, useContext } from 'react';
import { UserContext } from '../../App';
import axios from "axios";
import "./AddFile.css"
import {useNavigate} from "react-router-dom";
import {backendURL} from "../../config";

export function AddFiles() {
    const [file, setFile] = useState({filename: ''});
    const { user } = useContext(UserContext);
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            console.log('No file selected');
            return;
        }
        const {name, size} = file;
        const extension = name.split('.').pop().toLowerCase();
        // alert(`File name: ${name}`)
        // alert(`File size: ${size}`)
        // alert(`File extension: ${extension}`)
        // alert(`File owner: ${user.username}`)

        await axios.post(`${backendURL}/api/user/addfile`, {
            filename: name,
            size: size,
            extension: extension,
            owner: user.username
        })
            .then(() => {
                alert('File added successfully');
                navigate("/profile/" + user.username)
            })
        // Send data to backend to add file
        // ...
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    return (
        <div className="add-file-container">
            <h1>Add File to {user.username}</h1>
            <form className="add-file-form" onSubmit={handleSubmit}>
                <label htmlFor="file-input">Select file:</label>
                <input type="file" id="file-input" name="file-input" onChange={handleFileChange}/>
                <button type="submit">Submit</button>
            </form>
            <p className="current-file">{file.filename}</p>
        </div>


    );
}