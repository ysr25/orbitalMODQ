import React, { Component } from "react";
import { Link } from "react-router-dom";
import settings from "../config/settings";
import UserForm from "../components/UserForm";

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      course: "",
      yearOfStudy: "matriculatingSoon", // default option
      username: "",
      password: "",

      status: null,
      isButtonDisabled: false,
    };
  }

  onChangeEmail = (data) => {
    this.setState({
      email: data,
      isButtonDisabled: false,
    });
  };

  onChangeCourse = (data) => {
    this.setState({
      course: data,
      isButtonDisabled: false,
    });
  };

  onChangeYearOfStudy = (data) => {
    this.setState({
      yearOfStudy: data,
      isButtonDisabled: false,
    });
  };

  onChangeUsername = (data) => {
    this.setState({
      username: data,
      isButtonDisabled: false,
    });
  };

  onChangePassword = (data) => {
    this.setState({
      password: data,
      isButtonDisabled: false,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      email: this.state.email,
      course: this.state.course,
      yearOfStudy: this.state.yearOfStudy,
      username: this.state.username,
      password: this.state.password,
    };

    this.setState({
      status: "Submitting...",
      isButtonDisabled: true,
    });

    this.props
      .api("post", "/users/signup", newUser)
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
        <h3>Create An Account</h3>
        <p>
          Already have an account? <Link to="/users/login">Log in</Link>
        </p>
        <UserForm
          email={this.state.email}
          username={this.state.username}
          password={this.state.password}
          course={this.state.course}
          yearOfStudy={this.state.yearOfStudy}
          status={this.state.status}
          isButtonDisabled={this.state.isButtonDisabled}
          disabled={false}
          displayPassword={true}
          onChangeEmail={this.onChangeEmail}
          onChangeUsername={this.onChangeUsername}
          onChangePassword={this.onChangePassword}
          onChangeCourse={this.onChangeCourse}
          onChangeYearOfStudy={this.onChangeYearOfStudy}
          onSubmit={this.onSubmit}
        />
        <br />
        <a
          href={settings.serverUrl + "api/users/login/google"}
          className="btn btn-primary"
        >
          Sign up with Google
        </a>
      </>
    );
  }
}
