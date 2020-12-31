import { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button, Form } from "react-bootstrap"
export default class NavBar extends Component {
    state = {
        auth: localStorage.user
    }

    exit() {
        localStorage.clear();
        this.setState({ auth: false })
    }

    render() {
        if (this.state.auth) {
            return (
                <Navbar bg="dark" variant="dark" expand="lg" style={{ zIndex: 1 }}>
                    <Navbar.Brand>Booking</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Link to="/" className="nav-link">
                                Главная
                            </Link>
                            <Link to="/editor" className="nav-link">
                                Редактор
                            </Link>
                        </Nav>
                        <Form inline>
                            <Button style={{ marginLeft: "10px" }} onClick={() => { this.exit(); this.props.exit() }}>Выход</Button>
                        </Form>
                    </Navbar.Collapse>
                </Navbar >
            )
        } else {
            return (
                <Navbar bg="dark" variant="dark" expand="lg" style={{ zIndex: 1 }}>
                    <Navbar.Brand>Booking</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Link to="/" className="nav-link">
                                Главная
                            </Link>
                            <Link to="/registration" className="nav-link">
                                Регистрация
                            </Link>
                            <Link to="/login" className="nav-link">
                                Вход
                            </Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            )
        }
    }
}
