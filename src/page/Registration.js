import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form } from "react-bootstrap"
import NavBar from './components/NavBar'
import Loading from './components/Loading'

export default class Registration extends Component {
    timeout = null;
    errorText = {
        login: "Некорректный email-адрес",
        password: "Пароль 8+ символов, буквы В/Н регистра",
        confirm: "Пароли не совпадают",
        year: "Ошибка в формате года"
    }
    
    constructor(props) {
        super(props);
        this.state = {
            email: false,
            password: false,
            confirm: false,
            error: "",
            finaly: false,
            loading: false
        }
    }

    async errorRender(error) {
        clearTimeout(this.timeout);
        this.setState({ error });
        this.timeout = await setTimeout(() => this.setState({ error: "" }), 2500);
    }

    loginValidator(event) {
        let email = event.target.value;
        if (RegExp(/\S+@\S+\.\S+/).test(email)) {
            this.setState({ email: email.replaceAll(" ", ""), error: "" });
        } else {
            this.setState({ email: false });
            this.errorRender(this.errorText.login);
        }
    }

    passwordValidator(event) {
        let password = event.target.value;
        if (RegExp(/^(?=.*\d)(?=.*[A-Z]).{8,}$/).test(password)) {
            this.setState({ password: password, error: "" });
        } else {
            this.setState({ password: false });
            this.errorRender(this.errorText.password);
        }
    }

    confirmValidator(event) {
        let confirm = event.target.value;
        if (confirm === this.state.password) {
            this.setState({ confirm: true, error: "" });
        } else {
            this.setState({ confirm: false });
            this.errorRender(this.errorText.confirm);
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
        this.setState({ finaly: true, loading: false });
    }

    async RegUser() {
        let usersTable = this.props.db.collection("users");
        let email = this.state.email;
        let password = this.state.password;
        let confirm = this.state.confirm;
        if (email && password && confirm) {
            this.setState({ loading: true });
            let sample = await usersTable.where("email", "==", email).get();
            if (sample.docs.length) {
                this.setState({ loading: false });
                this.errorRender("Этот email уже зарегистрирован");
            } else {
                let newUser = await usersTable.add({
                    email, password,
                });
                this.Auth(newUser.id);
            }
        } else {
            if (!email) {
                this.errorRender(this.errorText.login);
                return 0;
            }
            if (!password) {
                this.errorRender(this.errorText.password);
                return 0;
            }
            if (!confirm) {
                this.errorRender(this.errorText.confirm);
                return 0;
            }
        }
    }

    render() {
        if (this.state.finaly) {
            return (<Redirect to='/' />)
        } else {
            return (
                <div>
                    <NavBar />
                    {this.state.loading ? <Loading /> : false}
                    <form style={styles.container}>
                        <div className="alert alert-danger" style={this.state.error ? {
                            opacity: 1, height: "5em", display: "table", width: "100%"
                        } : { opacity: 0, height: "5em", display: "table", width: "100%" }} >
                            <div style={{ display: "table-cell", verticalAlign: "middle" }}>
                                <strong>Error!</strong> {this.state.error}
                            </div>
                        </div>
                        <div>
                            <Form.Label>Email адрес</Form.Label>
                            <Form.Control type="email" placeholder="Почта" onChange={(l) => this.loginValidator(l)} />
                            <Form.Text className="text-muted">
                                Мы не передаем ваши данные сторонним сервисам.
                            </Form.Text>
                        </div>
                        <div>
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control type="password" placeholder="Пароль" autoComplete="off" onChange={(p) => this.passwordValidator(p)} />
                        </div>
                        <div>
                            <Form.Label>Подтверждение пароля</Form.Label>
                            <Form.Control type="password" placeholder="Подтверждение" autoComplete="off" onChange={(p) => this.confirmValidator(p)} />
                        </div>
                        <div style={{ marginTop: "10px" }}>
                            <Button variant="primary" className="btn-primary btn btn-block" onClick={() => this.RegUser()} >
                                Регистрация
                            </Button>
                        </div>
                    </form>
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
