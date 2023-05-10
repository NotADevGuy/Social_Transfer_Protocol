import { useContext } from "react";
import {useNavigate} from "react-router-dom";
import { UserContext } from "../../App";
import "./NavBar.css";

export function NavBar() {
    const { user, setUser, setLogged} = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser({});
        setLogged(false);
        localStorage.clear();
        navigate("/login")
    }

    return (
        <header className="navbar">
            <a className="navbar_brand" href="/home">STP</a>
            <nav className="navbar_menu">
                <ul className="navbar_items">
                    <li className="navbar_item"><a href="/search">Search</a></li>
                    <li className="navbar_item"><a href="/friends">Friends</a></li>
                    <li className="navbar_item"><a href="/add_files">Add Files</a></li>
                </ul>
            </nav>

            <nav className="navbar_profile">
                <ul className="navbar_items">
                    <li className="navbar_item"><a href={"/profile/" + user.username}>My Profile</a></li>
                    <li className="navbar_item"><a onClick={handleLogout}>Logout</a></li>
                </ul>
            </nav>
        </header>
    );
}

