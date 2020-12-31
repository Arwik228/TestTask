import { Component } from 'react';
import NavBar from './components/NavBar'
import Books from './components/Books'

export default class Index extends Component {
    state = {
        content: false,
        auth: false
    }

    async componentDidMount() {
        let user = localStorage.user;
        let token = localStorage.token;
        let arrayBook = await this.props.db.collection("books").get();
        if (user && token) {
            this.setState({ auth: true, content: arrayBook.docs });
        } else {
            this.setState({ auth: false, content: arrayBook.docs });
        }
    }

    async deleteBook(id) {
        this.setState({ content: this.state.content.filter((book => book.id !== id)) })
        await this.props.db.collection("books").doc(id).delete();
    }

    exitFunction() {
        this.setState({ auth: false });
    }

    render() {
        return (
            <div>
                <NavBar exit={() => this.exitFunction()} />
                <div style={styles.container}>
                    {(this.state.content[0]) ? (
                        <Books array={this.state.content}>
                            {(index) => <div className="indexBook" key={index['id']}>
                                <h6 style={styles.text}>Название: {index.data()['name']}</h6>
                                <h6 style={styles.text}>Авторы: {index.data()['authors']}</h6>
                                <h6 style={styles.text}>Год: {index.data()['year']}</h6>
                                <h6 style={styles.text}>ISBN: {index.data()['ISBN']}</h6>
                                {this.state.auth ? <center><button className="btn btn-block btn-outline-danger" onClick={() => this.deleteBook(index['id'])}>Удалить</button></center> : false}
                            </div>}
                        </Books>
                    ) : false}
                </div>
            </div>
        )
    }
}

const styles = {
    container: {
        width: "100%",
        height: "auto",
        backgroundColor: "white",
        maxWidth: "1060px",
        minHeight: "200px",
        borderRadius: "5px",
        position: "absolute",
        padding: "10px",
        top: "80px",
        margin: "auto",
        right: 0,
        left: 0
    },
    text: {
        overflow: "hidden",
        whiteSpace: "nowrap"
    }
}