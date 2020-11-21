import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Col from "react-bootstrap/Col";
import ModuleInput from "../components/ModuleInput.js"

export default class Registration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post_list: [],
      sort_property: "createdAt",
      sort_direction: 1,
      filter_moduleCode: "",
      search: "",
    };
  }

  componentDidMount = () => {
    this.props.api('get', '/reviews')
      .then((res) =>
        this.setState({
          post_list: res.data.content,
        })
      )
      .catch((err) => console.log(err));
  };

  compare = (property, direction) => {
    if (property === "createdAt" || property === "editedAt") {
      return (a, b) => {
        return (
          (new Date(a[property]) < new Date(b[property]) ? 1 : -1) * direction
        );
      };
    } else if (property === "upvotes") {
      return (a, b) => {
        const avotes = a.upvotes.length - a.downvotes.length
        const bvotes = b.upvotes.length - b.downvotes.length
        return (avotes < bvotes ? 1 : -1) * direction;
      };
    }
  };

  changeSort = (e) => {
    this.setState({ sort_property: e });
  };

  changeDirection = (e) => {
    this.setState({ sort_direction: e });
  };

  changeFilter = (e) => {
    this.setState({ filter_moduleCode: e });
  };

  changeSearch = (e) => {
    this.setState({ search: e.target.value });
  };

  submitSearch = (e) => {
    e.preventDefault();

    this.props.api('get', '/reviews/search', {}, {
      q: this.state.search
    })
      .then((res) =>
        this.setState({
          post_list: res.data.content,
        })
      )
      .catch((err) => console.log(err));
  };

  reset = () => {

    this.props.api('get', '/reviews')
      .then((res) => {
        this.setState({
          post_list: res.data.content,
          search: "",
          sort_property: "createdAt",
          sort_direction: 1,
          filter_moduleCode: "",
        });
      })
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div style={{ marginTop: 10 }}>
        <div>
          <ToggleButtonGroup
            type="radio"
            name="sort_by"
            defaultValue="createdAt"
            onChange={this.changeSort}
            value={this.state.sort_property}
          >
            <ToggleButton variant="outline-info" value="createdAt">
              Date posted
            </ToggleButton>
            <ToggleButton variant="outline-info" value="editedAt">
              Date edited
            </ToggleButton>
            <ToggleButton variant="outline-info" value="upvotes">
              Upvotes
            </ToggleButton>
          </ToggleButtonGroup>{" "}
          <ToggleButtonGroup
            type="radio"
            name="sort_by"
            defaultValue={1}
            onChange={this.changeDirection}
            value={this.state.sort_direction}
          >
            <ToggleButton variant="outline-info" value={-1}>
              Oldest to Latest Post
            </ToggleButton>
            <ToggleButton variant="outline-info" value={1}>
              Latest to Oldest Post
            </ToggleButton>
          </ToggleButtonGroup>
          <br />
          <br />
          <ModuleInput 
            key={this.state.filter_moduleCode} 
            value={this.state.filter_moduleCode}
            onChange={this.changeFilter} 
          />
          <br />
          <Form onSubmit={this.submitSearch}>
            <Form.Row>
            <Col>
              <Form.Control
                value={this.state.search}
                onChange={this.changeSearch}
                required
                placeholder="Search reviews"
              />
              </Col>
              <Col>
                <Button variant="info" type="submit">
                  Search
                </Button> {''}
                <Button variant="info" onClick={this.reset}>
                  Reset
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </div>
        <br />
        {this.state.post_list
          .slice()
          .filter((post) =>
            this.state.filter_moduleCode
              ? post.moduleCode === this.state.filter_moduleCode
              : true
          )
          .sort(
            this.compare(this.state.sort_property, this.state.sort_direction)
          )
          .map((post) => (
            <div key={post._id}>
              <Card border="Secondary">
                <Card.Header>
                  <b>
                    {post.moduleCode}: {post.title}
                  </b>
                </Card.Header>
                <Card.Body>
                  <Card.Text dangerouslySetInnerHTML={{ __html: post.content}}></Card.Text>
                  <Card.Text>
                    <em>posted by {post.anonymous || !post.author ? "Anonymous" : post.author.username}</em>
                    <br />
                    <em>
                      date posted {new Date(post.createdAt).toLocaleString()}
                    </em>
                    <br />
                    <em>
                      date edited {new Date(post.editedAt).toLocaleString()}
                    </em>
                    <br />
                    Upvotes: {post.upvotes.length - post.downvotes.length}
                    {""}
                  </Card.Text>
                  <Link to={`/reviews/view/${post._id}`} onClick={this.props.updateUser} className="card-link">
                    View
                  </Link>
                </Card.Body>
              </Card>
              <br />
            </div>
          ))}
      </div>
    );
  }
}
