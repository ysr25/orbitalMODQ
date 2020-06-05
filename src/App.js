import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";

import Homepage from "./directories/Homepage";
import CreateModReview from "./directories/CreateModReview";
import EditModReview from "./directories/EditModReview";
import Registration from "./directories/Registration";
import LoginPage from "./directories/LoginPage";
import ViewPost from "./directories/ViewPost";
import UserPage from "./directories/UserPage";

import logo from "./logo.jpg";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false
        }
    }

  checkLoggedIn = () => {
    axios
      .get("http://localhost:3001/users/status", {withCredentials: true})
      .then(res => this.setState({loggedIn: res.data.loggedIn}))
      .catch((err) => console.log(err));
  }

  componentDidMount = () => {
    this.checkLoggedIn();
  }

  render() {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/" className="navbar-brand">
              <img src={logo} width="50" height="50" alt="MODQ Logo" />
              MODQ
            </Link>
            <div className="collpase navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/modreviews/newpost" className="nav-link">Create A Post</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/users/signup" className="nav-link">Register</Link>
                </li>
                <li className="navbar-item">
                  {this.state.loggedIn
                    ? <Link to="/users/profile" className="nav-link">Profile</Link>
                    : <Link to="/users/login" className="nav-link">Log In</Link>
                  }
                </li>
              </ul>
            </div>
          </nav>
          <br/>
        <Route path="/" exact component={Homepage} />
        <Route path="/modreviews/newpost" component={CreateModReview} />
        <Route path="/modreviews/edit/:id" component={EditModReview} />
        <Route path="/modreviews/view/:id" component={ViewPost} />
        <Route path="/users/signup" component={Registration} />
        <Route path="/users/login" render={props => <LoginPage {...props} login={this.checkLoggedIn} />} />
        {/*still accessible by typing in the url even when not logged in*/}
        <Route path="/users/profile" render={props => <UserPage {...props} logout={this.checkLoggedIn} />} />
        </div>
      </Router>
    );
  }
}

export default App;