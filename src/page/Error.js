import { Component } from 'react';
import NavBar from './components/NavBar'

export default class Error extends Component {
    render() {
        return (
            <div>
                <NavBar />
                <h1>Error 404, Not found</h1>
            </div>
        )
    }
}