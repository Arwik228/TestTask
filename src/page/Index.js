import { Component } from 'react';
import NavBar from './components/NavBar'
import Books from './components/Books'

export default class Index extends Component {
    state = {
        content: false,
        auth: false,
        filter: false
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

    async deleteBook(id) {
        this.setState({ content: this.state.content.filter((book => book.id !== id)) })
        await this.props.db.collection("books").doc(id).delete();
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
                <div style={styles.container}>
                    <div style={{ width: "100%", display: "flex" }}>
                        <input type="text" className="form-control" id="formAuthor" placeholder="Название книги" onChange={(e) => { this.filterWord(e.target.value) }} />
                        <div className="form-group col-md-4">
                            <select className="form-control" defaultValue="dis" onChange={e => { this.sortBook(e.target.value) }}>
                                <option disabled value="dis" >Сортировка</option>
                                <option value="base">Хронология</option>
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
                                        <svg width="8em" height="7em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <g fill="#61DAFB">
                                                <path d="M3.214 1.072C4.813.752 6.916.71 8.354 2.146A.5.5 0 0 1 8.5 2.5v11a.5.5 0 0 1-.854.354c-.843-.844-2.115-1.059-3.47-.92-1.344.14-2.66.617-3.452 1.013A.5.5 0 0 1 0 13.5v-11a.5.5 0 0 1 .276-.447L.5 2.5l-.224-.447.002-.001.004-.002.013-.006a5.017 5.017 0 0 1 .22-.103 12.958 12.958 0 0 1 2.7-.869zM1 2.82v9.908c.846-.343 1.944-.672 3.074-.788 1.143-.118 2.387-.023 3.426.56V2.718c-1.063-.929-2.631-.956-4.09-.664A11.958 11.958 0 0 0 1 2.82z" />
                                                <path d="M12.786 1.072C11.188.752 9.084.71 7.646 2.146A.5.5 0 0 0 7.5 2.5v11a.5.5 0 0 0 .854.354c.843-.844 2.115-1.059 3.47-.92 1.344.14 2.66.617 3.452 1.013A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.276-.447L15.5 2.5l.224-.447-.002-.001-.004-.002-.013-.006-.047-.023a12.582 12.582 0 0 0-.799-.34 12.96 12.96 0 0 0-2.073-.609zM15 2.82v9.908c-.846-.343-1.944-.672-3.074-.788-1.143-.118-2.387-.023-3.426.56V2.718c1.063-.929 2.631-.956 4.09-.664A11.956 11.956 0 0 1 15 2.82z" />
                                            </g>
                                        </svg>
                                    </center>
                                    <center><h6 style={styles.text}>{index.data['name']}({index.data['year']})</h6></center>
                                    {this.state.auth ? <button className="btn btn-block btn-outline-danger" onClick={() => this.deleteBook(index['id'])}>Удалить</button> : false}
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
