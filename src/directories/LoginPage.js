import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { Redirect } from "react-router-dom";

export default class LoginPage extends Component {
  constructor() {
    super();
    
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      user_username: "",
      user_password: "",
      isButtonDisabled: false,
      buttonVariant: "primary",
      loginStatus: "Log In",
      loggedIn: false,
      redirectTo: null,
      loginError: null
    };
  }

  onChangeUsername(e) {
    this.setState({
      user_username: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      user_password: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const userLogIn = {
      username: this.state.user_username,
      password: this.state.user_password,
    };

    this.setState({
      isButtonDisabled: true,
      buttonVariant: "dark",
      loginStatus: "Logging In...",
    });

    axios
      .post("http://localhost:3001/users/login", userLogIn, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) {
          this.props.updateUser();
          this.setState({
            redirectTo: "/",
          });
        }
      })
      .catch((err) => {
        console.log(err)
        this.setState({
          loginError: "Please try again. The account does not exist, or wrong account info entered.",
          buttonVariant: "primary",
          loginStatus: "Log In",
          isButtonDisabled: false
        })
      });
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={{ pathname: this.state.redirectTo }} />;
    } else {
      return (
        <div style={{ marginTop: 10 }}>
          <div>
            <h3>Log in to existing account</h3>
            <p className="grey-text text-darken-1">
              <em>Don't have an account? </em>
              <Link to="/users/signup">Register</Link>
            </p>
          </div>
          <form onSubmit={this.onSubmit}>
            <input
              type="text"
              placeholder="Username"
              className="form-control"
              value={this.state.user_username}
              onChange={this.onChangeUsername}
            />
            <br></br>
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              value={this.state.user_password}
              onChange={this.onChangePassword}
            />
            <br />
            <div className="form-group">
              <Button
                type="submit"
                className="btn btn-primary"
                disabled={this.state.isButtonDisabled}
                variant={this.state.buttonVariant}
              >
                {this.state.loginStatus}
              </Button>
              <p>{this.state.loginError}</p>
            </div>
          </form>
        </div>
      );
    }
  }
}
