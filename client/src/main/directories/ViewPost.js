import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Redirect } from "react-router-dom";

export default class ViewPost extends Component {
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
      post_votes: 0,
      originalPoster: null,

      downvote_button: "outline-danger",
      upvote_button: "outline-success",
      post_comments: [],
      post_new_comment: "",
      commentButton: "primary",
      commentStatus: "Post Comment",
      commentButtonDisabled: false,
      sort_property: "createdAt",
      sort_direction: 1,
    };

  }

  compare = (property, direction) => {
    if (property === "createdAt") {
      return (a, b) => {
        return (
          (new Date(a[property]) < new Date(b[property]) ? 1 : -1) * direction
        );
      };
    }
  };

  onUpvote = () => {
    if(this.state.upvote_button == "outline-success") {
      this.state.upvote_button = "success"
    } else {
      this.state. upvote_button = "outline-success"
    }
    axios
      .patch(
        `/api/reviews/${this.state.post_id}/upvote`, 
        {withCredentials: true}
      )
      .then((res) => {
        this.setState({ post_votes: res.data.content })
      })
      .catch((err) => console.log(err));
  }

  onDownvote = () => {
    if(this.state.downvote_button == "outline-danger") {
      this.state.downvote_button = "danger"
    } else {
      this.state.downvote_button = "outline-danger"
    }
    axios
      .patch(
        `/api/reviews/${this.state.post_id}/downvote`, 
        {withCredentials: true}
      )
      .then((res) => {
        this.setState({ post_votes: res.data.content })
      })
      .catch((err) => console.log(err));
  }

  onChangeContent = (event, editor) => {
    this.setState({ post_new_comment: editor.getData() });
  };

  onComment = (e) => {
    e.preventDefault();

    const newComment = {
      content: this.state.post_new_comment,
    };

    // this.setState({
    //   commentButtonDisabled: true,
    //   commentButton: "dark",
    //   commentStatus: "Posting Comment...",
    // });

    axios
    .post(
      `/api/reviews/${this.state.post_id}/comments`, newComment, {
        withCredentials: true,
    })
    .then((res) => {
      this.setState({
        commentButton: "primary",
        commentStatus: "Post Comment",
        commentButtonDisabled: false,
        post_new_comment: ""
      })
      window.location.reload(true);
    })
    .catch((err) => console.log(err));
  }

  componentDidMount = () => {
    axios
      .get(`/api/reviews/${this.state.post_id}`)
      .then((res) => {
        const post = res.data.content;
        this.setState({
          post_id: post._id,
          post_title: post.title,
          post_content: post.content,
          post_moduleCode: post.moduleCode,
          post_author: post.anonymous || !post.author ? "Anonymous" : post.author.username,
          post_date: post.createdAt,
          post_editedDate: post.editedAt,
          post_votes: post.upvotes.length - post.downvotes.length,
        })
      })
      .catch((err) => console.log(err));

      console.log("checking if original poster");
      axios
        .get(
          `/api/reviews/${this.state.post_id}/poster`, 
          {withCredentials: true}
        )
        .then((res) => {
          this.setState({ originalPoster: res.data.content })
        })
        .catch((err) => console.log(err));

      axios.
        get(`/api/reviews/${this.state.post_id}/comments`)
        .then((res) => {
          this.setState({ 
            post_comments: res.data.content
          })
        })
        .catch((err) => console.log(err))
  };

  render() {
    const originalPoster = this.state.originalPoster;
    return (
      <div style={{ marginTop: 10 }}>
        <div>
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
            Upvotes: {this.state.post_votes}
            <br />
            <br />
            <h5>
              Review for:{" "}
              <b>
                <em>{this.state.post_moduleCode}</em>
              </b>
            </h5>
            <br />
            <div dangerouslySetInnerHTML={{ __html: this.state.post_content}}></div>
          </Form.Group>
          <br />
          <br />
          <Form.Row>
          <Col>
          {originalPoster ? (
            <Button
            type="button"
            variant="outline-primary"
            size="sm"
            href={`/modreviews/edit/${this.state.post_id}`}
          >
            Edit
          </Button>): (
            <></>
          )}
          {" "}
          {this.props.loggedIn ?
            <>
              <Button variant={this.state.upvote_button} size="sm" onClick={this.onUpvote}>Upvote</Button>
              {" "}
              <Button variant={this.state.downvote_button} size="sm" onClick={this.onDownvote}>Downvote</Button>
            </>
          : <></> }
          {" "}
          <Link className="btn btn-outline-secondary btn-sm" to={`/`} onClick={this.props.updateUser}>
            Return to Homepage
          </Link>
          </Col>
          </Form.Row>
          <br />
          <br />
            <Form onSubmit={this.onComment}>
            {this.props.loggedIn ? (
            <>
            <h5>Post a new comment: </h5>
            <CKEditor
              editor={ClassicEditor}
              data={this.state.post_new_comment}
              config={{
                toolbar: ["heading", "|", "bold", "italic", "blockQuote", "link", "numberedList", "bulletedList", "|", "undo", "redo"]
              }}
              onChange={this.onChangeContent}
            />
            <br  />
              <Button
                // class="float-sm-right"
                type = "comment"
                variant="outline-primary"
                size="sm"
              >
                Comment
              </Button>
              </>
            ) : (
              <h6><a href={`/users/signup`}>Create an account</a> or <a href={`/users/login`}>login to an existing account</a> to make a comment.</h6>
            )}
            </Form>
        </div>
            <br />
            {this.state.post_comments
              .sort(
            this.compare(this.state.sort_property, this.state.sort_direction)
          )
            .map((comment) => (
              <div key={comment._id}>
                <Card border='light'>
                  <Card.Body>
                    <Card.Text dangerouslySetInnerHTML={{ __html: comment.content}}></Card.Text>
                    <Card.Text>
                      <em>posted by {comment.author.username}</em>
                      <br  />
                      <em>
                        date posted {new Date(comment.createdAt).toLocaleString()}
                      </em>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
        <br />
        <br />
        </div>
    );
  }
}
