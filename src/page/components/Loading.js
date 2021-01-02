import { Component } from 'react';

export default class Loading extends Component {
    render() {
        return (
            <div style={{
                width: "min-content", position: "absolute", top: "80px", margin: "auto", right: "0px", left: "0px",
            }}>
                <div className="spinner-border float-right" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }
}