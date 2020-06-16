import axios from "axios";
import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default class Registration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post_id: props.match.params.id,
      post_title: "",
      post_content: "",
      post_moduleCode: "",
      post_authorId: "",
      post_author: "",
      post_date: "",
      post_editedDate: "",
    };
  }

  componentDidMount = () => {
    axios
      .get(`http://localhost:3001/modReviews/view/${this.state.post_id}`)
      .then((res) =>
        this.setState({
          post_id: res.data._id,
          post_title: res.data.title,
          post_content: res.data.content,
          post_moduleCode: res.data.moduleCode,
          post_author: res.data.author.username,
          post_date: res.data.datePosted,
          post_editedDate: res.data.dateEdited,
        })
      )
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div style={{ marginTop: 10 }}>
        <h6>Post #{this.state.post_id}</h6>
        <em>
          Last edited on {new Date(this.state.post_editedDate).toLocaleString()}
        </em>
        <br />
        <Form.Group>
          <br />
          <h2>{this.state.post_title}</h2>
          Posted by{" "}
          <em>
            {this.state.post_author} on{" "}
            {new Date(this.state.post_date).toLocaleString()}
          </em>
          <br />
          <br />
          <h5>
            Review for:{" "}
            <b>
              <em>{this.state.post_moduleCode}</em>
            </b>
          </h5>
          <br />
          {this.state.post_content}
        </Form.Group>
        <br />
        <Button
          type="button"
          variant="outline-primary"
          href={`/modreviews/edit/${this.state.post_id}`}
        >
          Edit
        </Button>
        <br />
        <br />
        <Button type="button" variant="outline-secondary" size="sm" href={`/`}>
          Return to Homepage
        </Button>{" "}
      </div>
    );
  }
}
