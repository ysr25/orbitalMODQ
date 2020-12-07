import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import settings from "../config/settings";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

export default class LogIn extends Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: "",
      isButtonDisabled: false,
      status: null,
    };
  }

  onChangeUsername = (e) => {
    this.setState({
      username: e.target.value,
      isButtonDisabled: false,
    });
  };

  onChangePassword = (e) => {
    this.setState({
      password: e.target.value,
      isButtonDisabled: false,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const userLogIn = {
      username: this.state.username,
      password: this.state.password,
    };

    this.setState({
      isButtonDisabled: true,
      status: "Logging In...",
    });

    this.props
      .api("post", "/users/login", userLogIn)
      .then((res) => {
        this.setState({ status: res.data.message });
        this.props.history.push("/");
      })
      .catch((err) => {
        this.setState({
          status: err.response.data.message,
          isButtonDisabled: true,
        });
      });
  };

  render() {
    return (
      <>
        <h3>Log in</h3>
        <p>
          Don't have an account? <Link to="/users/signup">Register</Link>
        </p>
        <Form onSubmit={this.onSubmit}>
          <Form.Row>
            <Form.Label htmlFor="username" column sm={2}>
              Username
            </Form.Label>
            <Col>
              <Form.Control
                id="username"
                type="text"
                value={this.state.username}
                onChange={this.onChangeUsername}
                required
              />
            </Col>
          </Form.Row>
          <br />

          <Form.Row>
            <Form.Label htmlFor="password" column sm={2}>
              Password
            </Form.Label>
            <Col>
              <Form.Control
                id="password"
                type="password"
                value={this.state.password}
                onChange={this.onChangePassword}
                required
              />
            </Col>
          </Form.Row>
          <br />

          <Button type="submit" disabled={this.state.isButtonDisabled}>
            Log In
          </Button>
          <br />
          {this.state.status}
          <br />
          <a
            href={settings.serverUrl + "api/users/login/google"}
            className="btn btn-primary"
          >
            Log in with Google
          </a>
        </Form>
      </>
    );
  }
}
