import React, { useState } from 'react';
import axios from 'axios';
import "../main-styling.css"
import {backendURL} from "../../config";

export function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ files: [], users: [] });

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.get(`${backendURL}/api/user/search?query=${query}`);
            setResults(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="main-div">
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-item">
                    <label htmlFor="search-input" className="form-label">Search:</label>
                    <input type="text" id="search-input" className="form-input" value={query} onChange={(event) => setQuery(event.target.value)} />
                    <button className="btn-primary" type="submit">Go</button>
                </div>
            </form>

            <div className="form">
                <div className="form-options">
                    <p className="desc">Files:</p>
                    <ul>
                        {results.files.map((file) => (
                            <li><a className="form-label" key={file._id} href={`/profile/${file.ownerUsername}`}>{file.ownerUsername}: {file.name}</a></li>
                        ))}
                    </ul>
                </div>

            </div>

            <div className="form">
                <div className="form-options">
                    <p className="desc">Users:</p>
                    <ul>
                        {results.users.map((user) => (
                            <li key={user._id}>
                                <a href={`/profile/${user.username}`}>
                                    {user.name} (aka {user.username})
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
