import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import axios from "axios";
import {Link} from "react-router-dom";

export default class Registration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post_list: [],
    };
  }

  componentDidMount = () => {
    axios
      .get("http://localhost:3001/modReviews/view/all")
      .then((res) =>
        this.setState({
          post_list: res.data,
        })
      )
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div style={{ marginTop: 10 }}>
        {this.state.post_list.map((post) => (
          <>
            <Card border="Secondary">
              <Card.Header>
                <b>
                  {post.moduleCode}: {post.title}
                </b>
              </Card.Header>
              <Card.Body key={post._id}>
                <Card.Text>{post.content}</Card.Text>
                <Card.Text>
                  <em>posted by {post.author.username} </em>
                  {""}
                </Card.Text>
                <Card.Link href={`/modreviews/view/${post._id}`}>
                  View
                </Card.Link>
                <Card.Link href={`/modreviews/edit/${post._id}`}>
                  Edit
                </Card.Link>
              </Card.Body>
            </Card>
            <br />
          </>
        ))}
      </div>
    );
  }
}
