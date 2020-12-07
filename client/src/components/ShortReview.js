import React, { Component } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";

export default class ShortReview extends Component {
  render() {
    const review = this.props.review;
    const datePosted = new Date(review.createdAt).toLocaleString();
    const dateEdited = new Date(review.editedAt).toLocaleString();

    return (
      <Card>
        <Card.Body>
          <Card.Title className="class-title h5">
            <strong>{review.title}</strong>{" "}
            <Badge variant="info">{review.moduleCode}</Badge>
          </Card.Title>
          <Card.Subtitle>
            Posted by {review.displayedAuthor} on {datePosted}
          </Card.Subtitle>
          <br />
          <Link
            to={`/reviews/view/${review._id}`}
            onClick={this.props.updateUser}
            className="card-link"
          >
            View full review
          </Link>
        </Card.Body>
        <Card.Footer>
          Last edited at {dateEdited}, {review.votes} Upvotes
        </Card.Footer>
      </Card>
    );
  }
}
