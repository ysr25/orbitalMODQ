import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import moduleList from "./ModuleList.js";

export default class CreateModReview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post_title: "",
      post_content: "",
      post_moduleCode: "ACC1002",
      isButtonDisabled: false,
      buttonVariant: "primary",
      post_id: "",
      post_anonymously: false,
      postStatus: null
    };
  }

  onChangeTitle = (e) => {
    this.setState({ post_title: e.target.value });
  };

  onChangeContent = (e) => {
    this.setState({ post_content: e.target.value });
  };

  onChangeModuleCode = (e) => {
    this.setState({ post_moduleCode: e.target.value });
  };

  onChangeAnonymous = (e) => {
    this.setState(prevState => ({ post_anonymously: !prevState.post_anonymously }));
  };

  onSubmit = (e) => {
    e.preventDefault();

    const newPost = {
      title: this.state.post_title,
      content: this.state.post_content,
      moduleCode: this.state.post_moduleCode,
      anonymous: this.state.post_anonymously,
    };

    axios
      .post('/api/modReviews/newpost', newPost, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        console.log(res);
        this.setState({ postStatus: res.data.msg });
        this.props.history.push(`/modreviews/view/${res.data.content}`);
      })
      .catch((err) => {
        console.log(err);
        this.setState({ postStatus: err.response.data.msg })
      });

    this.setState({
      isButtonDisabled: true,
      buttonVariant: "dark",
    });
  };

  render() {
    return (
      <div style={{ marginTop: 10 }}>
        <h3>New Post</h3>
        <Form onSubmit={this.onSubmit}>
          <Form.Label>Module: </Form.Label>
          <Form.Control
            as="select"
            className="form-control"
            value={this.state.post_moduleCode}
            onChange={this.onChangeModuleCode}
            required
          >
            {moduleList.map((module) => (
              <option key={module.code} value={module.code}>
                {module.code + ": " + module.title}
              </option>
            ))}
          </Form.Control>
          <br />
          <Form.Control
            type="text"
            placeholder="Title"
            className="form-control"
            value={this.state.post_title}
            onChange={this.onChangeTitle}
            required
          />
          <br />
          <Form.Control
            type="text"
            as="textarea"
            rows="16"
            placeholder="Content"
            className="form-control"
            value={this.state.post_content}
            onChange={this.onChangeContent}
            required
          />
          <br />
          <Form.Check
            type="checkbox"
            id="postAnonymously"
            label="Post anonymously"
            checked={this.state.post_anonymously}
            onChange={this.onChangeAnonymous}
          />
          <br />
          <div className="form-group">
            <Button
              type="submit"
              className="btn btn-primary"
              disabled={this.state.isButtonDisabled}
              variant={this.state.buttonVariant}
            >
              Submit Post
            </Button>
            <p>{this.state.postStatus}</p>
          </div>
        </Form>
      </div>
    );
  }
}
