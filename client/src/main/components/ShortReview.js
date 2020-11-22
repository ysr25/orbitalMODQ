import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'

export default class ShortReview extends Component {
  render () {
    const post = this.props.post
    const datePosted = new Date(post.createdAt).toLocaleString()
    const dateEdited = new Date(post.editedAt).toLocaleString()
    const shortContent = post.content.replace(/^(.{100}[^\s]*).*/, '$1')

    return (
      <Card>
        <Card.Body>
          <Card.Title className='class-title h5'>
            <strong>{post.title}</strong> <Badge variant='info'>{post.moduleCode}</Badge>
          </Card.Title>
          <Card.Subtitle>Posted by {post.displayedAuthor} on {datePosted}</Card.Subtitle>
          <br />
          <Card.Text dangerouslySetInnerHTML={{ __html: shortContent }} className='review'></Card.Text>
          <Link
            to={`/reviews/view/${post._id}`}
            onClick={this.props.updateUser}
            className='card-link'
          >
          View more
          </Link>
        </Card.Body>
        <Card.Footer>
          Last edited at {dateEdited}, {post.votes} Upvotes
        </Card.Footer>
      </Card>
    )
  }
}
