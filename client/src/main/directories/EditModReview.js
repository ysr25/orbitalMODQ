import React, { Component } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import ModuleInput from "../components/ModuleInput.js"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default class EditModReview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post_id: props.match.params.id,
      post_title: "",
      post_content: "",
      post_moduleCode: "",
      postStatus: null,
    };
  }

  componentDidMount = () => {
    axios
      .get(`/api/modReviews/view/${this.state.post_id}`)
      .then((res) => {
        return this.setState({
          post_id: res.data.content._id,
          post_title: res.data.content.title,
          post_content: res.data.content.content,
          post_moduleCode: res.data.content.moduleCode,
        })
      })
      .catch((err) => console.log(err));
  };

  onChangeTitle = (e) => {
    this.setState({ post_title: e.target.value });
  };

  onChangeContent = (event, editor) => {
    this.setState({ post_content: editor.getData() });
  };

  onChangeModuleCode = (e) => {
    this.setState({ post_moduleCode: e });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const newPost = {
      title: this.state.post_title,
      content: this.state.post_content,
      moduleCode: this.state.post_moduleCode,
    };

    axios
      .patch(
        `/api/modReviews/edit/${this.state.post_id}`,
        newPost, 
        { withCredentials: true },
      )
      .then((res) =>
        this.props.history.push(`/modreviews/view/${this.state.post_id}`)
      )
      .catch((err) => {
        console.log(err)
        this.setState({ 
          postStatus: err.response.data.msg,
        })
      });
  };

  onDelete = (e) => {
    axios
      .delete(
        `/api/modReviews/delete/${this.state.post_id}`,
        { withCredentials: true }
      )
      .then((res) => console.log(res.data.content))
      .then((res) => this.props.history.push("/"))
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div style={{ marginTop: 10 }}>
        <h3>Edit Post</h3>
        <form onSubmit={this.onSubmit}>
          <Form.Group as={Row}>
          <Form.Label column sm={1}>
      Title
    </Form.Label>
    <Col sm={11}>
            <Form.Control
              type="text"
              placeholder="Title"
              className="form-control"
              value={this.state.post_title}
              onChange={this.onChangeTitle}
              required
            />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
          <Form.Label column sm={1}>
          Module
          </Form.Label>
          <Col sm={11}>
            <ModuleInput 
              key={this.state.post_moduleCode}
              value={this.state.post_moduleCode}
              onChange={this.onChangeModuleCode}
            />
          </Col>
          </Form.Group>
          <CKEditor
            editor={ClassicEditor}
            data={this.state.post_content}
            config={{
              toolbar: ["heading", "|", "bold", "italic", "blockQuote", "link", "numberedList", "bulletedList", "|", "undo", "redo"]
            }}
            onChange={this.onChangeContent}
          />
          <br />
          <Button variant="outline-primary" type="submit">
            Submit
          </Button>{" "}
          <Link
            className="btn btn-outline-secondary"
            to={`/modreviews/view/${this.state.post_id}`}
            onClick={this.props.updateUser}
          >
            Cancel
          </Link>{" "}
          <Button variant="outline-danger" onClick={this.onDelete}>
            Delete
          </Button>
          <p>{this.state.postStatus}</p>
        </form>
      </div>
    );
  }
}
