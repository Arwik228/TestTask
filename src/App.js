
import { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'

import Index from './page/Index'
import Login from './page/Login'
import Registration from './page/Registration'
import Editor from './page/Editor'
import Error from './page/Error'

export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" >
            <Index db={this.props.connection} />
          </Route>
          <Route path="/login" >
            <Login db={this.props.connection} />
          </Route>
          <Route path="/registration" >
            <Registration db={this.props.connection} />
          </Route>
          <Route exact path="/editor" >
            <Editor db={this.props.connection} />
          </Route>
          <Route component={Error} />
        </Switch>
      </Router >
    )
  }
}