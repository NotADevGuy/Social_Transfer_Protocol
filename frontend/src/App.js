import {BrowserRouter, Routes, Route, useParams} from "react-router-dom";
import {createContext, useEffect, useState} from "react";
import Login from "./Componenets/Login/Login";
import Reset from "./Componenets/Reset/Reset";
import Register from "./Componenets/Register/Register";
import Home from "./Componenets/Home/Home";
import {NavBar} from "./Componenets/NavBar/NavBar";
import {Profile} from "./Componenets/Profile/Profile";
import {AddFiles} from "./Componenets/AddFile/AddFile";
import {Search} from "./Componenets/Search/Search";
import {Friends} from "./Componenets/Friends/Friends";
import axios from "axios";
import {backendURL} from "./config";

export const UserContext = createContext();

function App() {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : {};
    });
    const [logged, setLogged] = useState(() => {
        const storedLogged = localStorage.getItem('logged');
        return storedLogged ? JSON.parse(storedLogged) : false;
    });

    const func = async () => {
        return
        const res = await axios.get("https://api.ipify.org/?format=json")
        axios.post(`${backendURL}/api/user/updateIP`, {ip: res.data.ip, username: user.username})
    }

    useEffect(() => {
        localStorage.setItem('logged', JSON.stringify(logged));
        localStorage.setItem('user', JSON.stringify(user));
        func()
    }, [user, logged]);

    const loggedInRoutes = (
        <>
            <Route path="/" element={<Home/>}/>
            <Route path="home" element={<Home/>}/>
            <Route path="friends" element={<Friends/>}/>
            <Route path="profile/:username" element={<Profile editable={true}/>}/>
            <Route path="profile/:username" element={<Profile editable={false}/>}/>
            <Route path="add_files" element={<AddFiles/>}/>
            <Route path="search" element={<Search/>}/>
        </>
    )

    const loggedOutRoutes = (
        <>
            <Route path="/" element={<Login/>}/>
            <Route path="login" element={<Login/>}/>
            <Route path="reset" element={<Reset/>}/>
            <Route path="register" element={<Register/>}/>
        </>
    )


    return (
        <UserContext.Provider value={{user, setUser, logged, setLogged}}>
            <BrowserRouter basename="/">
            <div className="App h-100">
                {logged && (
                    <div className="row vh-25">
                        <NavBar/>
                    </div>
                )}
                <div className="row vh-75">
                        <Routes>
                            {logged ? loggedInRoutes : loggedOutRoutes}
                        </Routes>
                </div>
            </div>
            </BrowserRouter>
        </UserContext.Provider>
    )
}

export default App;
