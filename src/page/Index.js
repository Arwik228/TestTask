import { Component } from 'react';
import NavBar from './components/NavBar'
import Books from './components/Books'
import ConfirmDelete from './components/ConfirmDelete'
import Icon from './components/Icon'

export default class Index extends Component {
    state = {
        content: false,
        auth: false,
        filter: false,
        deleteForm: false,
        idBook: false,
        values: false
    }

    async componentDidMount() {
        let user = localStorage.user;
        let token = localStorage.token;
        let arrayBook = await this.props.db.collection("books").get();
        let transformArray = [];
        for (let i = 0; i < arrayBook.docs.length; i++) {
            transformArray.push({
                id: arrayBook.docs[i].id,
                data: arrayBook.docs[i].data()
            })
        }
        if (user && token) {
            this.setState({ auth: true, content: transformArray });
        } else {
            this.setState({ auth: false, content: transformArray });
        }
    }

    generColor(str) {
        //Плохая попытка как-то разнообразить, лучше удалить
        let Acode = str.slice(0, 6).split('').map((e) => e.charCodeAt() * 2.8);
        return `linear-gradient(rgba(${Acode[0]}, ${Acode[1]}, ${Acode[2]}, 0.3), rgba(${Acode[3]}, ${Acode[4]}, ${Acode[5]}, 0.3))`;
    }

    closeForm() {
        this.setState({ deleteForm: false, idBook: false, values: false });
    }

    async deleteBook(id) {
        this.setState({ content: this.state.content.filter((book => book.id !== id)) })
        await this.props.db.collection("books").doc(id).delete();
        this.closeForm();
    }

    deleteForm(id) {
        let bookInfo = this.state.content.filter(e => e.id === id);
        if (bookInfo[0]) {
            this.setState({ deleteForm: true, idBook: id, values: bookInfo[0].data });
        } else {
            console.log("Error, cant find this book")
        }
    }

    exitFunction() {
        this.setState({ auth: false });
    }

    async sortBook(str) {
        switch (str) {
            case "old":
                this.setState({ filter: this.state.content.slice().sort((a, b) => { return (a.data.year > b.data.year ? 1 : -1) }) });
                break;
            case "new":
                this.setState({ filter: this.state.content.slice().sort((a, b) => { return (a.data.year < b.data.year ? 1 : -1) }) });
                break;
            default: this.setState({ filter: false });
        }
    }

    filterWord(str) {
        if (str.length > 3) {
            this.setState({ filter: this.state.content.filter((e) => { return RegExp(str, 'i').test(e.data.name) }) });
        } else {
            this.setState({ filter: false });
        }
    }

    render() {
        return (
            <div>
                <NavBar exit={() => this.exitFunction()} />
                {this.state.deleteForm ?
                    <ConfirmDelete id={this.state.idBook} deleteBook={(id) => { this.deleteBook(id) }} close={() => this.closeForm()} values={this.state.values} />
                    : false}
                <div style={styles.container}>
                    <div className="controlBar">
                        <input type="text" className="form-control" id="formAuthor" placeholder="Название книги" onChange={(e) => { this.filterWord(e.target.value) }} />
                        <div className="form-group col-md-4 listSort">
                            <select className="form-control" defaultValue="base" onChange={e => { this.sortBook(e.target.value) }}>
                                <option value="base">Сортировка по умолчанию</option>
                                <option value="old">Сначала старые</option>
                                <option value="new">Сначала новые</option>
                            </select>
                        </div>
                    </div>
                    {(this.state.content[0]) ? (
                        <Books array={this.state.filter ? this.state.filter : this.state.content}>
                            {(index) => <div className="indexBook" style={{ background: this.generColor(index['id']) }} key={index['id']}>
                                <div style={{ position: "absolute", bottom: "10px", width: "calc(100% - 10px)" }}>
                                    <center>
                                        <Icon name="book" />
                                    </center>
                                    <center><h6 style={styles.text}>{index.data['name']}({index.data['year']})</h6></center>
                                    {this.state.auth ? <button className="btn btn-block btn-outline-danger" onClick={() => this.deleteForm(index['id'])}>Удалить</button> : false}
                                </div>
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
