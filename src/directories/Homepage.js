import React, { Component } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import ToggleButton from 'react-bootstrap/ToggleButton'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'

export default class Registration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post_list: []
    };
  }

  componentDidMount = () => {
    axios
      .get("http://localhost:3001/modReviews/view/all")
      .then((res) =>
        this.setState({
          post_list: res.data.reverse(),
        })
      )
      .catch((err) => console.log(err));
  };

  changeSort = (e) => {
    if (e === "date_posted") {
        this.setState(prevState => ({
            post_list: prevState.post_list.slice().sort((a, b) => {
                return (new Date(a.datePosted) < new Date(b.datePosted)) ? 1 : -1;
            })
        }));
    } else if (e === "date_edited") {
        this.setState(prevState => ({
            post_list: prevState.post_list.slice().sort((a, b) => {
                return (new Date(a.dateEdited) < new Date(b.dateEdited)) ? 1 : -1;
            })
        }));
    } else if (e === "most_upvotes") {
        console.log("doesn't do anything for now");
    }
  }

  render() {
    return (
      <div style={{ marginTop: 10 }}>
        <div>
        <ToggleButtonGroup type="radio" name="sort_by" defaultValue="date_posted" onChange={this.changeSort}>
          <ToggleButton value="date_posted">Recently posted</ToggleButton>
          <ToggleButton value="date_edited">Recently edited</ToggleButton>
          <ToggleButton value="most_upvotes">Most upvotes</ToggleButton>
        </ToggleButtonGroup>
        </div>
        <br />
        {this.state.post_list.map((post) => (
          <div key={post._id}>
            <Card border="Secondary">
              <Card.Header>
                <b>
                  {post.moduleCode}: {post.title}
                </b>
              </Card.Header>
              <Card.Body>
                <Card.Text>{post.content}</Card.Text>
                <Card.Text>
                  <em>posted by {post.author.username}</em><br />
                  <em>date posted {new Date(post.datePosted).toLocaleString()}</em><br />
                  <em>date edited {new Date(post.dateEdited).toLocaleString()}</em>
                  {""}
                </Card.Text>
                <Card.Link href={`/modreviews/view/${post._id}`}>
                  View
                </Card.Link>
              </Card.Body>
            </Card>
            <br />
          </div>
        ))}
      </div>
    );
  }
}
