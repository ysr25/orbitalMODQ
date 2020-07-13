import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import moduleList from "./ModuleList.js";
import Col from "react-bootstrap/Col";

export default class Registration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post_list: [],
      sort_property: "datePosted",
      sort_direction: 1,
      filter_moduleCode: "",
      search: "",
    };
  }

  componentDidMount = () => {
    axios
      .get("/api/modReviews/view/all")
      .then((res) =>
        this.setState({
          post_list: res.data.content,
        })
      )
      .catch((err) => console.log(err));
  };

  compare = (property, direction) => {
    if (property === "datePosted" || property === "dateEdited") {
      return (a, b) => {
        return (
          (new Date(a[property]) < new Date(b[property]) ? 1 : -1) * direction
        );
      };
    } else if (property === "upvotes") {
      return (a, b) => {
        return (a.upvotes.length < b.upvotes.length ? 1 : -1) * direction;
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
    this.setState({ filter_moduleCode: e.target.value });
  };

  changeSearch = (e) => {
    this.setState({ search: e.target.value });
  };

  submitSearch = (e) => {
    e.preventDefault();
    axios
      .get("/api/modReviews/search", {
        params: { q: this.state.search },
      })
      .then((res) =>
        this.setState({
          post_list: res.data.content,
        })
      )
      .catch((err) => console.log(err));
  };

  reset = () => {
    axios
      .get("/api/modReviews/view/all")
      .then((res) => {
        this.setState({
          post_list: res.data.content,
          search: "",
          sort_property: "datePosted",
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
            defaultValue="datePosted"
            onChange={this.changeSort}
            value={this.state.sort_property}
          >
            <ToggleButton variant="outline-info" value="datePosted">
              Date posted
            </ToggleButton>
            <ToggleButton variant="outline-info" value="dateEdited">
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
          <Form.Control
            as="select"
            className="form-control"
            value={this.state.filter_moduleCode}
            onChange={this.changeFilter}
          >
            <option key="all" value="">
              Find with module code
            </option>
            {moduleList.map((module) => (
              <option
                key={module.code}
                value={module.code}
              >{`${module.code}: ${module.title}`}</option>
            ))}
          </Form.Control>
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
                      date posted {new Date(post.datePosted).toLocaleString()}
                    </em>
                    <br />
                    <em>
                      date edited {new Date(post.dateEdited).toLocaleString()}
                    </em>
                    <br />
                    Upvotes: {post.upvotes.length}
                    {""}
                  </Card.Text>
                  <Link to={`/modreviews/view/${post._id}`} onClick={this.props.updateUser} className="card-link">
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
