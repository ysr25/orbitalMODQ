import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'

export default class Comment extends Component {
  render () {
    const comment = this.props.comment
    const datePosted = new Date(comment.createdAt).toLocaleString()

    return (
      <Card>
        <Card.Body>
          <Card.Text dangerouslySetInnerHTML={{ __html: comment.content }}></Card.Text>
        </Card.Body>
        <Card.Footer>
          Posted by {comment.author.username} on {datePosted}
        </Card.Footer>
      </Card>
    )
  }
}
