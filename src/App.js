import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import Homepage from "./directories/Homepage";
import CreateModReview from "./directories/CreateModReview";
import EditModReview from "./directories/EditModReview";
import Registration from "./directories/Registration";
import LoginPage from "./directories/LoginPage";
import ViewPost from "./directories/ViewPost";
import UserPage from "./directories/UserPage";
import Navbar from "./components/Navbar";
import logo from "./logo.jpg";

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
    };

    this.getUser = this.getUser.bind(this);
    this.componentDidMount = this.componentDidMount(this);
    this.updateUser = this.updateUser.bind(this);
  }

  componentDidMount() {
    this.getUser();
  }

  updateUser(user) {
    this.setState(user);
  }

  getUser() {
    axios.get("/users").then((response) => {
      console.log("Get user response: ");
      console.log(response.data);
      if (response.data.user) {
        console.log("Get User: There is a user saved in the server session: ");
        this.setState({
          loggedIn: true,
        });
      } else {
        console.log("Get user: no user");
        this.setState({
          loggedIn: false,
        });
      }
    });
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
            <Navbar
              updateUser={this.updateUser}
              loggedIn={this.state.loggedIn}
            />
          </nav>
          <br />
          <Route exact path="/" component={Homepage} />
          <Route path="/modreviews/newpost" component={CreateModReview} />
          <Route path="/modreviews/edit/:id" component={EditModReview} />
          <Route path="/modreviews/view/:id" component={ViewPost} />
          <Route path="/users/signup" render={() => <Registration />} />
          <Route
            path="/users/login"
            render={() => <LoginPage updateUser={this.updateUser} />}
          />
          {/*still accessible by typing in the url even when not logged in*/}
          {/* <Route path="/users/profile" render={props => <UserPage {...props} logout={this.updateLoginStatus} />} /> */}
        </div>
      </Router>
    );
  }
}

export default App;
