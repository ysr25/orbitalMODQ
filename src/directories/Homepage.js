import React, { Component } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import ToggleButton from 'react-bootstrap/ToggleButton'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'

export default class Registration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post_list: [],
      sort_property: "datePosted",
      sort_direction: 1
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

  compare = (property, direction) => {
      if (property === "datePosted" || property === "dateEdited") {
          return (a, b) => {
              return (new Date(a[property]) < new Date(b[property]) ? 1 : -1) * direction;
          }
      } else {
          return (a, b) => {
              return (a[property] < b[property] ? 1 : -1) * direction;
          }
      }
  }

  changeSort = (e) => {
      this.setState({sort_property: e});
  }

  changeDirection = (e) => {
      this.setState({sort_direction: e});
  }

  render() {
    return (
      <div style={{ marginTop: 10 }}>
        <div>
        <ToggleButtonGroup type="radio" name="sort_by" defaultValue="datePosted" onChange={this.changeSort}>
          <ToggleButton value="datePosted">Date posted</ToggleButton>
          <ToggleButton value="dateEdited">Date edited</ToggleButton>
          <ToggleButton value="upvotes">Upvotes</ToggleButton>
        </ToggleButtonGroup>
        {' '}
        <ToggleButtonGroup type="radio" name="sort_by" defaultValue={1} onChange={this.changeDirection}>
          <ToggleButton value={-1}>Ascending</ToggleButton>
          <ToggleButton value={1}>Descending</ToggleButton>
        </ToggleButtonGroup>
        </div>
        <br />
        {this.state.post_list.slice().sort(this.compare(this.state.sort_property, this.state.sort_direction)).map((post) => (
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
