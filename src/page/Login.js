import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form } from "react-bootstrap"
import NavBar from './components/NavBar'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: false,
            password: false,
            error: "",
            finaly: false
        }
    }

    errorRender(error) {
        this.setState({ error })
    }

    TokenAuth() {
        return Math.random().toString(26).slice(2);
    }

    async LogUser() {
        let usersTable = this.props.db.collection("users");
        let email = this.state.email;
        let password = this.state.password;
        if (email && password) {
            let sample = await usersTable.where("email", "==", email).where("password", "==", password).get();
            if (sample.docs.length) {
                let token = this.TokenAuth() + this.TokenAuth();
                await this.props.db.collection("auths").add({
                    user: sample.docs[0].id, token,
                });
                localStorage.setItem('user', sample.docs[0].id);
                localStorage.setItem('token', token);
                this.setState({ finaly: true });
            } else {
                this.errorRender("Проверьте введенные данные");
            }
        } else {
            this.errorRender("Заполните все поля");
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
                            <Form.Control type="email" placeholder="Почта" onChange={(l) => this.setState({ email: l.target.value })} />
                            <Form.Text className="text-muted">
                                Мы не передаем ваши данные сторонним сервисам.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control type="password" placeholder="Пароль" onChange={(p) => this.setState({ password: p.target.value })} />
                        </Form.Group>
                        <Button variant="primary" className="btn-primary btn btn-block" onClick={() => this.LogUser()} >
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
