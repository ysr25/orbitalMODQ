import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Homepage from "./directories/Homepage";
import CreateModReview from "./directories/CreateModReview";
import EditModReview from "./directories/EditModReview";
import Registration from "./directories/Registration";
import LoginPage from "./directories/LoginPage";

import logo from "./logo.jpg";

class App extends Component {
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
                  <Link to="/users/login" className="nav-link">Log In</Link>
                </li>
              </ul>
            </div>
          </nav>
          <br/>
        <Route path="/" exact component={Homepage} />
        <Route path="/modreviews/newpost" component={CreateModReview} />
        <Route path="/modreviews/editpost/:id" component={EditModReview} />
        <Route path="/users/signup" component={Registration} />
        <Route path="/users/login" component={LoginPage} />
        </div>
      </Router>
    );
  }
}

export default App;