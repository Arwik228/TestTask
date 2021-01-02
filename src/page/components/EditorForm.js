import { Component } from 'react';
import Icon from './Icon'

export default class EditorForm extends Component {
    timeout = null;

    errorText = {
        isbn: "Ошибка в формате ISBN",
        name: "Ошибка в длине поля Название",
        authors: "Ошибка в длине поля Авторы",
        year: "Ошибка в формате года"
    }

    state = {
        name: false,
        authors: false,
        year: false,
        isbn: false,
        error: " "
    }

    componentDidMount() {
        this.setState({
            name: this.props.values['name'] || false,
            authors: this.props.values['authors'] ||false,
            year: this.props.values['year'] || false,
            isbn: this.props.values['ISBN'] || false
        })
    }

    async errorRender(str) {
        clearTimeout(this.timeout);
        this.setState({ error: str });
        this.timeout = await setTimeout(() => this.setState({ error: "" }), 2500);
    }

    isbnValidate(str) {
        let reg = RegExp(/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/);
        let filterStr = str.replaceAll(" ", "");
        if (reg.test(filterStr)) {
            this.setState({ error: "", isbn: filterStr });
        } else {
            this.errorRender(this.errorText.isbn);
            this.setState({ isbn: false });
        }
    }

    nameValidate(str) {
        if (str.length > 0 && str.length < 64) {
            this.setState({ error: "", name: str });
        } else {
            this.errorRender(this.errorText.name);
            this.setState({ name: false });
        }
    }

    authorsValidate(str) {
        if (str.length > 0 && str.length < 64) {
            this.setState({ error: "", authors: str });
        } else {
            this.errorRender(this.errorText.authors);
            this.setState({ authors: false });
        }
    }

    yearValidate(int) {
        if (RegExp(/^\d\d\d\d$/).test(int)) {
            this.setState({ error: "", year: int });
        } else {
            this.errorRender(this.errorText.year);
            this.setState({ year: false });
        }
    }

    finalyError(name, authors, year, isbn) {
        if (!name) {
            this.errorRender(this.errorText.name);
            return 0;
        }
        if (!authors) {
            this.errorRender(this.errorText.authors);
            return 0;
        }
        if (!year) {
            this.errorRender(this.errorText.year);
            return 0;
        }
        if (!isbn) {
            this.errorRender(this.errorText.isbn);
            return 0;
        }
    }

    createBook() {
        let name = this.state.name;
        let authors = this.state.authors;
        let year = this.state.year;
        let isbn = this.state.isbn;
        if (name && authors && year && isbn) {
            this.props.create(name, authors, year, isbn);
        } else {
            this.finalyError(name, authors, year, isbn);
        }
    }

    changeBook() {
        let name = this.state.name;
        let authors = this.state.authors;
        let year = this.state.year;
        let isbn = this.state.isbn;
        if (name && authors && year && isbn) {
            this.props.edit(name, authors, year, isbn);
        } else {
            this.finalyError(name, authors, year, isbn);
        }
    }

    render() {
        return (
            <div style={this.styles.container}>
                <div style={this.styles.form}>
                    <div style={this.styles.top}>
                        <button className="btn btn-danger" style={{ marginLeft: "auto" }} onClick={() => { this.props.close() }}>
                            <Icon name="exit" />
                        </button>
                    </div>
                    <div style={{ width: "80%", marginLeft: "10%", padding: "10px 0" }}>
                        <center><h6 style={{ height: "16px" }}>{this.state.error}</h6></center>
                        <div className="form-group">
                            <label htmlFor="formName">Название</label>
                            <input type="text" disabled={this.props.view} className="form-control"
                                id="formName" placeholder="Название" onChange={(str) => { this.nameValidate(str.target.value) }}
                                defaultValue={this.props.values['name'] || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="formName">Авторы</label>
                            <input type="text" disabled={this.props.view} className="form-control"
                                id="formAuthor" placeholder="Авторы" onChange={(str) => { this.authorsValidate(str.target.value) }}
                                defaultValue={this.props.values['authors'] || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="formYear">Год издания</label>
                            <input type="text" disabled={this.props.view} className="form-control"
                                id="formYear" placeholder="Год издания" onChange={(str) => { this.yearValidate(str.target.value) }}
                                defaultValue={this.props.values['year'] || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="formISBN">ISBN</label>
                            <input type="text" disabled={this.props.view} className="form-control"
                                id="formISBN" placeholder="ISBN" onChange={(str) => { this.isbnValidate(str.target.value) }}
                                defaultValue={this.props.values['ISBN'] || ""} />
                        </div>
                        {
                            this.props.id ? (
                                this.props.view ? false :
                                    (<button className="btn btn-warning btn-block" onClick={() => { this.changeBook() }}>Сохранить</button>)
                            ) : (
                                    <button className="btn btn-success btn-block" onClick={() => { this.createBook() }}>Создать</button>
                                )
                        }
                    </div>
                </div>
            </div>
        )
    }

    styles = {
        container: {
            width: "100%",
            height: "100%",
            background: "#0000007d",
            position: "fixed",
            zIndex: 2
        },
        form: {
            width: "100%",
            height: "auto",
            backgroundColor: "white",
            maxWidth: "500px",
            minHeight: "200px",
            borderRadius: "5px",
            position: "absolute",
            top: "40px",
            margin: "auto",
            overflow: "hidden",
            right: 0,
            left: 0
        },
        top: {
            width: "100%",
            backgroundColor: "#e9ecef",
            padding: "5px",
            display: "flex"
        }
    }
}

