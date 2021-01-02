import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form } from "react-bootstrap"
import NavBar from './components/NavBar'
import Loading from './components/Loading'

export default class Login extends Component {
    timeout = null;

    constructor(props) {
        super(props);
        this.state = {
            email: false,
            password: false,
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

    TokenAuth() {
        return Math.random().toString(26).slice(2);
    }

    async LogUser() {
        let usersTable = this.props.db.collection("users");
        let email = this.state.email;
        let password = this.state.password;
        if (email && password) {
            this.setState({ loading: true });
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
                this.errorRender("Мы не нашли аккаунт по этим данным");
                this.setState({ loading: false });
            }
        } else {
            this.errorRender("Проверьте корректность данных");
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
                        <div className="alert alert-danger" style={(this.state.error ? { opacity: 1, height: "5em" } : { opacity: 0, height: "5em" })} >
                            <strong>Error!</strong> {this.state.error}
                        </div>
                        <div>
                            <Form.Label>Email адрес</Form.Label>
                            <Form.Control type="email" placeholder="Почта" onChange={(l) => this.setState({ email: l.target.value })} />
                            <Form.Text className="text-muted">
                                Мы не передаем ваши данные сторонним сервисам.
                            </Form.Text>
                        </div>
                        <div>
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control type="password" autoComplete="off" placeholder="Пароль" onChange={(p) => this.setState({ password: p.target.value })} />
                        </div>
                        <div style={{ marginTop: "10px" }}>
                            <Button variant="primary" className="btn-primary btn btn-block" onClick={() => this.LogUser()} >
                                Вход
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
