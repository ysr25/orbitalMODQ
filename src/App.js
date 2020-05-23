import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Homepage from "./components/Homepage";
//import EditModReview from "./components/EditModReview";
import CreateModReview from "./components/CreateModReview";
import Registration from "./components/Registration";
import LoginPage from "./components/LoginPage";

import logo from "./logo.jpg";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <img src={logo} width="30" height="30" alt="MODQ Logo" />
            <Link to="/" className="navbar-brand">MODQ</Link>
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
        <Route path="/modreviews/view" exact component={Homepage} />
        <Route path="/modreviews/newpost" component={CreateModReview} />
        {/*<Route path="/modreviews/edit/:modReviewId" component={EditModReview} />*/}
        <Route path="/users/signup" component={Registration} />
        <Route path="/users/login" component={LoginPage} />
        </div>
      </Router>
    );
  }
}

export default App;