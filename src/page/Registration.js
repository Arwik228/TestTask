import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form } from "react-bootstrap"
import NavBar from './components/NavBar'

export default class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: false,
            password: false,
            confirm: false,
            error: "",
            finaly: false
        }
    }

    errorRender(error) {
        this.setState({ error })
    }

    loginValidator(event) {
        let email = event.target.value;
        if (RegExp(/\S+@\S+\.\S+/).test(email)) {
            this.setState({ email: email.replaceAll(" ", ""), error: "" });
        } else {
            this.setState({ email: false });
            this.errorRender("Некорректный email-адрес");
        }
    }

    passwordValidator(event) {
        let password = event.target.value;
        if (RegExp(/^(?=.*\d)(?=.*[A-Z]).{8,}$/).test(password)) {
            this.setState({ password: password, error: "" });
        } else {
            this.setState({ password: false });
            this.errorRender("Пароль не соответствуют правилам:");
        }
    }

    confirmValidator(event) {
        let confirm = event.target.value;
        if (confirm === this.state.password) {
            this.setState({ confirm: true, error: "" });
        } else {
            this.setState({ confirm: false });
            this.errorRender("Пароли не совпадают");
        }
    }

    TokenAuth() {
        return Math.random().toString(26).slice(2);
    }

    async Auth(id) {
        let token = this.TokenAuth() + this.TokenAuth();
        await this.props.db.collection("auths").add({
            user: id, token,
        });
        localStorage.setItem('user', id);
        localStorage.setItem('token', token);
        this.setState({ finaly: true });
    }

    async RegUser() {
        let usersTable = this.props.db.collection("users");
        let email = this.state.email;
        let password = this.state.password;
        if (email && password && this.state.confirm) {
            let sample = await usersTable.where("email", "==", email).get();
            if (sample.docs.length) {
                this.errorRender("Этот email уже зарегистрирован");
            } else {
                let newUser = await usersTable.add({
                    email, password,
                });
                this.Auth(newUser.id);
            }
        } else {
            this.errorRender("Заполни все поля");
        }
    }

    render() {
        if (this.state.finaly) {
            return (<Redirect to='/' />)
        } else {
            return (
                <div>
                    <NavBar />
                    <div style={styles.container}>
                        <div className="alert alert-danger" style={this.state.error ? { opacity: 1 } : { opacity: 0 }} >
                            <strong>Error!</strong> {this.state.error}.
                        </div>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email адрес</Form.Label>
                            <Form.Control type="email" placeholder="Почта" onChange={(l) => this.loginValidator(l)} />
                            <Form.Text className="text-muted">
                                Мы не передаем ваши данные сторонним сервисам.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control type="password" placeholder="Пароль" onChange={(p) => this.passwordValidator(p)} />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Подтверждение пароля</Form.Label>
                            <Form.Control type="password" placeholder="Подтверждение" onChange={(p) => this.confirmValidator(p)} />
                        </Form.Group>
                        <Button variant="primary" className="btn-primary btn btn-block" onClick={() => this.RegUser()} >
                            Вход
                        </Button>
                    </div>
                </div>
            )
        }
    }
}

const styles = {
    container: {
        width: "100%",
        maxWidth: "400px",
        position: "absolute",
        top: "80px",
        margin: "auto",
        right: 0,
        left: 0
    }
}
