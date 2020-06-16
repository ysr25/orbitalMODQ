import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../App.css";

class Navbar extends Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
  }

  logout(event) {
    event.preventDefault();
    console.log("logging out");
    axios
      .post("http://localhost:3001/users/logout")
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) {
          this.props.updateUser({
            loggedIn: false,
          });
        }
      })
      .catch((error) => {
        console.log("Logout error");
      });
  }

  render() {
    const loggedIn = this.props.loggedIn;

    return (
      <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/modreviews/newpost" className="nav-link">
              Create A Post
            </Link>
          </li>
          {loggedIn ? (
            <li className="navbar-item">
              <Link to="#" className="nav-link" onClick={this.logout}>
                Log Out
              </Link>
            </li>
          ) : (
              <li className="navbar-item">
                <Link to="/users/signup" className="nav-link">
                  Register
                </Link>
              </li>
          )}
          {loggedIn ? (
            <blank />
          ) : (
            <li className="navbar-item">
                <Link to="/users/login" className="nav-link">
                  Log In
                </Link>
              </li>
          )}
        </ul>
      </div>
    );
  }
}

export default Navbar;
