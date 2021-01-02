import { Component } from 'react';
import NavBar from './components/NavBar'
import { Link } from 'react-router-dom';

export default class Error extends Component {
    render() {
        return (
            <div>
                <NavBar />
                <div style={{
                    height: "max-content", justifyContent: "center", alignItems: "center",
                    top: "0px", width: "100%", margin: "auto", bottom: "120px", position: "absolute"
                }}>
                    <span>
                        <center><h1>404</h1></center>
                        <center><h4>Page not found</h4></center>
                        <center><h6>The page you are looking for doesn't exist or an other error occurred.</h6></center>
                        <center><h6><Link to="/" style={{ textDecoration: "unset" }}>Go back or go to main page</Link></h6></center>
                    </span>
                </div>
            </div>
        )
    }
}