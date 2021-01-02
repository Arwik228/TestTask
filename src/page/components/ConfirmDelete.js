import { Component } from 'react';
import Icon from './Icon'

export default class ConfirmDelete extends Component {
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
                        <h6>Вы подтверждаете удаление:</h6>
                        <center><h6 style={{ overflow: "hidden", color: "red" }}>{this.props.values['name']}</h6></center>
                        <button className="btn btn-danger btn-block" style={{ marginTop: "30px" }} onClick={() => { this.props.deleteBook(this.props.id) }}>Удалить</button>
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

