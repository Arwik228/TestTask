import { Component } from 'react';
import { Button } from "react-bootstrap"
export default class EditorForm extends Component {
    state = {
        name: false,
        authors: false,
        year: false,
        isbn: false,
        error: " "
    }

    async errorRender(str) {
        this.setState({ error: str });
        await setTimeout(() => this.setState({ error: "" }), 2000)
    }

    isbnValidate(str) {
        let reg = RegExp(/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/);
        if (reg.test(str)) {
            this.setState({ error: "", isbn: str });
        } else {
            this.errorRender("Ошибка в ISBN");
            this.setState({ isbn: false });
        }
    }

    nameValidate(str) {
        if (str.length > 0 && str.length < 64) {
            this.setState({ error: "", name: str });
        } else {
            this.errorRender("Ошибка в Названии");
            this.setState({ name: false });
        }
    }

    authorsValidate(str) {
        if (str.length > 0 && str.length < 64) {
            this.setState({ error: "", authors: str });
        } else {
            this.errorRender("Ошибка в Авторах");
            this.setState({ authors: false });
        }
    }

    yearValidate(int) {
        if (!isNaN(int)) {
            this.setState({ error: "", year: int });
        } else {
            this.errorRender("Ошибка в Годе");
            this.setState({ year: false });
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
            this.errorRender("Заполни все поля");
        }
    }

    changeBook() {
        let name = this.state.name || this.props.values['name'];
        let authors = this.state.authors || this.props.values['authors'];
        let year = this.state.year || this.props.values['year'];
        let isbn = this.state.isbn || this.props.values['ISBN'];
        if (name && authors && year && isbn) {
            this.props.edit(name, authors, year, isbn);
        } else {
            this.errorRender("Заполни все поля");
        }
    }

    render() {
        return (
            <div style={this.styles.container}>
                <div style={this.styles.form}>
                    <div style={this.styles.top}>
                        <Button onClick={() => { this.props.close() }}>Закрыть</Button>
                    </div>
                    <div style={{ width: "80%", marginLeft: "10%", padding: "10px 0" }}>
                        <center><h6 style={{ height: "16px" }}>{this.state.error}</h6></center>
                        <div className="form-group">
                            <label htmlFor="formName">Название</label>
                            <input type="text" className="form-control" id="formName" placeholder="Название" onChange={(str) => { this.nameValidate(str.target.value) }} defaultValue={this.props.values['name'] || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="formName">Авторы</label>
                            <input type="text" className="form-control" id="formAuthor" placeholder="Авторы" onChange={(str) => { this.authorsValidate(str.target.value) }} defaultValue={this.props.values['authors'] || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="formYear">Год издания</label>
                            <input type="text" className="form-control" id="formYear" placeholder="Год издания" onChange={(str) => { this.yearValidate(str.target.value) }} defaultValue={this.props.values['year'] || ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="formISBN">ISBN</label>
                            <input type="text" className="form-control" id="formISBN" placeholder="ISBN" onChange={(str) => { this.isbnValidate(str.target.value) }} defaultValue={this.props.values['ISBN'] || ""} />
                        </div>
                        {
                            this.props.id ? (
                                <button className="btn btn-outline-warning btn-block" onClick={() => { this.changeBook() }}>Редактировать</button>
                            ) : (
                                    <button className="btn  btn-outline-success btn-block" onClick={() => { this.createBook() }}>Создать</button>
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
            padding: "5px"
        }
    }
}

