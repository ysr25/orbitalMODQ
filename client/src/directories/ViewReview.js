import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Editor from "../components/Editor";
import Review from "../components/Review";
import Comment from "../components/Comment";

export default class ViewReview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post_id: props.match.params.id,
      post: "",

      isAuthor: false,
      isUpvoted: false,
      isDownvoted: false,

      comments: [],
      newComment: "",
      commentButtonDisabled: false,
      status: "Loading...",
    };
  }

  componentDidMount = () => {
    this.getData();
  };

  onUpvote = () => {
    this.props
      .api("patch", `/reviews/${this.state.post_id}/upvote`)
      .then((res) => this.getData())
      .catch((err) => console.log(err));
  };

  onDownvote = () => {
    this.props
      .api("patch", `/reviews/${this.state.post_id}/downvote`)
      .then((res) => this.getData())
      .catch((err) => console.log(err));
  };

  onChangeContent = (data) => {
    this.setState({ newComment: data });
  };

  onComment = (e) => {
    e.preventDefault();

    const newComment = {
      content: this.state.newComment,
    };

    this.setState({
      commentButtonDisabled: true,
      status: "Posting comment...",
    });

    this.props
      .api("post", `/reviews/${this.state.post_id}/comments`, newComment)
      .then((res) => {
        this.setState({
          commentButtonDisabled: false,
          newComment: "",
          status: res.data.message,
        });
        this.getData();
      })
      .catch((err) => console.log(err));
  };

  getData = () => {
    this.props
      .api("get", `/reviews/${this.state.post_id}`)
      .then((res) => {
        this.setState({
          post: res.data.content,
          isAuthor: res.data.isAuthor,
          isUpvoted: res.data.isUpvoted,
          isDownvoted: res.data.isDownvoted,
          status: "",
        });
      })
      .catch((err) => console.log(err));

    this.props
      .api("get", `/reviews/${this.state.post_id}/comments`)
      .then((res) => this.setState({ comments: res.data.content }))
      .catch((err) => console.log(err));
  };

  render() {
    const editButton =
      this.props.loggedIn && this.state.isAuthor ? (
        <Link
          className="btn btn-outline-primary"
          to={`/reviews/edit/${this.state.post_id}`}
        >
          Edit
        </Link>
      ) : (
        <></>
      );

    const postComment = this.props.loggedIn ? (
      <Form onSubmit={this.onComment}>
        Post a new comment:
        <Editor data={this.state.newComment} onChange={this.onChangeContent} />
        <br />
        <Button
          type="comment"
          variant="outline-primary"
          disabled={this.state.commentButtonDisabled}
        >
          Comment
        </Button>
        <br />
        {this.state.status}
      </Form>
    ) : (
      <>
        <a href={`/users/login`}>Log in</a> or{" "}
        <a href={`/users/signup`}>Create an account</a> to leave a comment.
      </>
    );

    const upvoteButtonType = this.state.isUpvoted
      ? "success"
      : "outline-success";
    const downvoteButtonType = this.state.isDownvoted
      ? "danger"
      : "outline-danger";

    const voteButtons = this.props.loggedIn ? (
      <>
        <Button variant={upvoteButtonType} onClick={this.onUpvote}>
          Upvote
        </Button>{" "}
        <Button variant={downvoteButtonType} onClick={this.onDownvote}>
          Downvote
        </Button>
      </>
    ) : (
      <></>
    );

    return (
      <>
        <Review review={this.state.post} />
        {editButton} {voteButtons}
        <br />
        <div style={{ marginTop: "10px" }}>{postComment}</div>
        <div style={{ marginTop: "10px" }}>
          {this.state.comments.map((comment) => (
            <Comment comment={comment} key={comment._id} />
          ))}
        </div>
      </>
    );
  }
}
