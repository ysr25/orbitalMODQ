import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import logo from "../logo.jpg";

export default class CustomNavbar extends Component {
  logout = (e) => {
    e.preventDefault();

    this.props
      .api("post", "/users/logout")
      .then((res) => this.props.updateUser())
      .catch((err) => console.log("Logout error"));
  };

  render() {
    const loggedIn = this.props.loggedIn;

    return (
      <Navbar bg="light" expand="sm" sticky="top">
        <Link to="/" className="navbar-brand" onClick={this.props.updateUser}>
          <img src={logo} width="50" height="50" alt="MODQ Logo" />
          MODQ
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <Link to="/" className="nav-link" onClick={this.props.updateUser}>
              Home
            </Link>
            <Link
              to="/reviews/new"
              className="nav-link"
              onClick={this.props.updateUser}
            >
              Create a Post
            </Link>
            {loggedIn ? (
              <>
                <Link
                  to="/users/edit/"
                  className="nav-link"
                  onClick={this.props.updateUser}
                >
                  Edit Account Details
                </Link>
                <Link to="#" className="nav-link" onClick={this.logout}>
                  Log Out
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/users/signup"
                  className="nav-link"
                  onClick={this.props.updateUser}
                >
                  Register
                </Link>
                <Link
                  to="/users/login"
                  className="nav-link"
                  onClick={this.props.updateUser}
                >
                  Log In
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
