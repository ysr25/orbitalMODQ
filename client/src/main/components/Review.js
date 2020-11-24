import React, { Component } from 'react'
import Badge from 'react-bootstrap/Badge'

export default class Review extends Component {
  render () {
    const review = this.props.review
    const datePosted = new Date(review.createdAt).toLocaleString()
    const dateEdited = new Date(review.editedAt).toLocaleString()

    return (
      <>
        <p>Post #{review._id}<br />Last edited on {dateEdited}</p>
        <h1>{review.title} <Badge variant='info'>{review.moduleCode}</Badge></h1>
        <p>Posted by {review.displayedAuthor} on {datePosted}<br />Upvotes: {review.votes}</p>
        <div dangerouslySetInnerHTML={{ __html: review.content}}></div>
      </>
    )
  }
}
