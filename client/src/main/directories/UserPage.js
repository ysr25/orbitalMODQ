import React, { Component } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";

export default class LoginPage extends Component {
  onClick = (e) => {
    axios
      .post("/users/logout", {}, { withCredentials: true })
      .then((res) => console.log(res.data))
      .then((res) => this.props.logout())
      .then((res) => this.props.history.push("/"))
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div style={{ marginTop: 10 }}>
        <div>
          <h3>Profile</h3>
        </div>
        <Button onClick={this.onClick} className="btn btn-primary">
          Log Out
        </Button>
      </div>
    );
  }
}
