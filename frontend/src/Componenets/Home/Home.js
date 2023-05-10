import React from "react";
import "./Home.css"
import {backendURL} from "../../config";

function Home () {
    return (
        <div className="container">
            <h1>Welcome to Our Site</h1>
            <p>
                Introducing our revolutionary app, created by a team of talented developers including Kenny, Moises, and Matthew. Our app offers a unique P2P file transfer service that is complemented by a social media platform built around it, providing users with a one-of-a-kind experience. With our app, you can easily and securely transfer files between devices, while also earning incentives for sharing and engaging with others on our social media platform.
            </p>
            <p>
                Our app is designed with ease of use and security in mind, ensuring that your files are always protected while being transferred between devices. Whether you need to transfer large files or simply want to share photos with friends and family, our app provides a seamless and hassle-free experience.
            </p>
            <p>
                So why wait? Download our app today and join our growing community of users who are benefiting from our innovative P2P file transfer service and social media platform. Click the link below to download the service here and start enjoying all the benefits our app has to offer!
            </p>

            <a
                href={`${backendURL}/api/transfer/download`}
                download className="download-link">
                Download Now
            </a>
        </div>

    );
}

export default Home;