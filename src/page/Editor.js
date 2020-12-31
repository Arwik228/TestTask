import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import NavBar from './components/NavBar'
import EditorForm from './components/EditorForm'
import Books from './components/Books'

export default class Index extends Component {
    state = {
        content: false,
        auth: true,
        editorForm: false,
        idBook: false,
        values: false
    }

    async componentDidMount() {
        let user = localStorage.user;
        let token = localStorage.token;
        this.setState({ auth: ((user && token) ? true : false) })
        let arrayBook = await this.props.db.collection("books").get();
        let transformArray = [];
        for (let i = 0; i < arrayBook.docs.length; i++) {
            transformArray.push({
                id: arrayBook.docs[i].id,
                data: arrayBook.docs[i].data()
            })
        }
        this.setState({ content: transformArray });
    }

    async create() {
        this.setState({ editorForm: true });
    }

    closeForm() {
        this.setState({ editorForm: false, idBook: false, values: false });
    }

    async editForm(id) {
        let bookInfo = this.state.content.filter(e => e.id === id);
        if (bookInfo[0]) {
            this.setState({ editorForm: true, idBook: id, values: bookInfo[0].data });
        } else {
            console.log("Error, cant find this book")
        }
    }

    exitFunction() {
        this.setState({ auth: false });
    }

    async createBook(name, authors, year, isbn) {
        let objectCreate = {
            ISBN: isbn,
            authors: authors,
            date: Date.now(),
            name: name,
            year: year
        };
        let record = await this.props.db.collection("books").add(objectCreate);
        this.state.content.push({
            id: record.id,
            data: objectCreate
        });
        this.closeForm();
    }

    async editBook(name, authors, year, isbn) {
        let objectCreate = {
            ISBN: isbn,
            authors: authors,
            date: Date.now(),
            name: name,
            year: year
        };
        await this.props.db.collection("books").doc(this.state.idBook).update(objectCreate);
        let key = this.state.content.findIndex((e => e.id === this.state.idBook));
        this.state.content[key] = {
            id: this.state.idBook,
            data: objectCreate
        }
        this.closeForm();
    }

    async deleteBook(id) {
        this.setState({ content: this.state.content.filter((book => book.id !== id)) })
        await this.props.db.collection("books").doc(id).delete();
    }

    render() {
        if (this.state.auth) {
            return (
                <div>
                    {((this.state.editorForm) ?
                        <EditorForm id={this.state.idBook}
                            values={this.state.values}
                            edit={(name, authors, year, isbn) => { this.editBook(name, authors, year, isbn) }}
                            create={(name, authors, year, isbn) => { this.createBook(name, authors, year, isbn) }}
                            close={() => this.closeForm()} />
                        : false)}
                    <NavBar exit={() => this.exitFunction()} />
                    <div style={styles.container}>
                        <button className="btn btn-block btn-success" onClick={() => this.create()}>Создать</button>
                        {(this.state.content[0]) ? (
                            <Books array={this.state.content}>
                                {(index) => <div style={styles.block} key={index['id']}>
                                    <h6 style={{ whiteSpace: "nowrap", width: "calc(100% - 160px)", overflow: "hidden" }}>{index.data['name']}</h6>
                                    <div style={{ marginLeft: "auto" }}>
                                        <button className="btn btn-outline-warning" style={{ margin: "0 5px" }} onClick={() => this.editForm(index['id'])}>Update</button>
                                        <button className="btn btn-outline-danger" onClick={() => this.deleteBook(index['id'])}>Delete</button>
                                    </div>
                                </div>}
                            </Books>
                        ) : false}
                    </div>
                </div>
            )
        } else {
            return (<Redirect to='/login' />)
        }
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
    block: {
        width: "100%",
        padding: "3px 10px",
        margin: "5px 0",
        backgroundColor: "#f5f4f5",
        borderRadius: "5px",
        display: "flex"
    }
}

