import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import Homepage from "./directories/Homepage";
import CreateReview from "./directories/CreateReview";
import EditReview from "./directories/EditReview";
import Register from "./directories/Register";
import LogIn from "./directories/LogIn";
import ViewReview from "./directories/ViewReview";
import Navbar from "./components/Navbar";
import EditUser from "./directories/EditUser";

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
    };
  }

  api = (method, url, data = {}, params = {}) => {
    console.log("api call", method, url);
    return axios
      .request({
        method: method,
        url: "/api" + url,
        data: data,
        params: params,
        withCredentials: true,
      })
      .then((res) => {
        this.setState({ loggedIn: res.data.isLoggedIn });
        return res;
      });
  };

  updateUser = () => {
    this.api("get", "/").catch((err) => console.log(err));
  };

  setShow = (show) => {
    this.setState({ show: false });
  };

  render() {
    return (
      <Router>
        <div className="container">
          <Navbar
            updateUser={this.updateUser}
            loggedIn={this.state.loggedIn}
            api={this.api}
          />
          <br />
          <Route
            exact
            path="/"
            render={(props) => <Homepage {...props} api={this.api} />}
          />
          <Route
            path="/reviews/new"
            render={(props) => <CreateReview {...props} api={this.api} />}
          />
          <Route
            path="/reviews/edit/:id"
            render={(props) => <EditReview {...props} api={this.api} />}
          />
          <Route
            path="/reviews/view/:id"
            render={(props) => (
              <ViewReview
                {...props}
                loggedIn={this.state.loggedIn}
                api={this.api}
              />
            )}
          />
          <Route
            exact
            path="/users/signup"
            render={(props) => <Register {...props} api={this.api} />}
          />
          <Route
            path="/users/login"
            render={(props) => <LogIn {...props} api={this.api} />}
          />
          <Route
            exact
            path="/users/edit"
            render={(props) => <EditUser {...props} api={this.api} />}
          />
        </div>
      </Router>
    );
  }
}

export default App;
