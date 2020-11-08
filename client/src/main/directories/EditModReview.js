import React, { Component } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ReviewForm from "../components/ReviewForm"

export default class EditModReview extends Component {
  constructor(props) {
    super(props)

    this.state = {
      postId: props.match.params.id,
      title: "",
      content: "",
      moduleCode: "",
      isAnonymous: false,

      status: null,
      isButtonDisabled: false
    }
  }

  componentDidMount = () => {
    axios
      .get(`/api/reviews/${this.state.postId}`)
      .then(res => {
        const post = res.data.content
        this.setState({
          postId: post._id,
          title: post.title,
          content: post.content,
          moduleCode: post.moduleCode,
          isAnonymous: post.anonymous
        })
      })
      .catch(err => {
        this.setState({ status: err.response.data.message })
      })
  }

   onChangeTitle = (data) => {
    this.setState({ 
      title: data,
      isButtonDisabled: false
    })
  }

  onChangeContent = (data) => {
    this.setState({ 
      content: data,
      isButtonDisabled: false
    })
  }

  onChangeModuleCode = (data) => {
    this.setState({ 
      moduleCode: data,
      isButtonDisabled: false
    })
  }

  onChangeIsAnonymous = () => {
    this.setState(prevState => ({ 
      isAnonymous: !prevState.isAnonymous,
      isButtonDisabled: false 
    }))
  }

  onSubmit = (e) => {
    e.preventDefault();

    const editedPost = {
      title: this.state.title,
      content: this.state.content,
      moduleCode: this.state.moduleCode,
      anonymous: this.state.isAnonymous
    };

    axios
      .patch(`/api/reviews/${this.state.postId}`, editedPost, {
        withCredentials: true 
      })
      .then(res =>
        this.props.history.push(`/modreviews/view/${this.state.postId}`)
      )
      .catch(err => {
        this.setState({ status: err.response.data.message })
      })
  }

  onDelete = (e) => {
    axios
      .delete(`/api/reviews/${this.state.postId}`, {
        withCredentials: true
      })
      .then(res => this.props.history.push("/"))
      .catch(err => {
        this.setState({ status: err.response.data.message })
      })
  }

  render() {
    return (
      <div style={{ marginTop: 10 }}>
        <h3>Edit Post</h3>
        <ReviewForm 
          title={this.state.title}
          content={this.state.content}
          moduleCode={this.state.moduleCode}
          isAnonymous={this.state.isAnonymous}

          status={this.state.status}
          isButtonDisabled={this.state.isButtonDisabled}

          onChangeTitle={this.onChangeTitle}
          onChangeContent={this.onChangeContent}
          onChangeModuleCode={this.onChangeModuleCode}
          onChangeIsAnonymous={this.onChangeIsAnonymous}
          onSubmit={this.onSubmit}
        />
        <br />
        <Link
          className="btn btn-outline-secondary"
          to={`/modreviews/view/${this.state.postId}`}
          onClick={this.props.updateUser}>
        Cancel
        </Link>
        {" "}
        <Button variant="outline-danger" onClick={this.onDelete}>
        Delete
        </Button>
      </div>
    )
  }
}
