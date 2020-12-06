import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ToggleButton from 'react-bootstrap/ToggleButton'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import Col from 'react-bootstrap/Col'
import ModuleInput from '../components/ModuleInput.js'
import ShortReview from '../components/ShortReview.js'

export default class Homepage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      reviews: [],
      sort: '-createdAt',
      filter: '',
      search: '',
    }
  }

  getReviews = () => {
    this.props.api('get', '/reviews')
      .then(res =>
        this.setState({
          reviews: res.data.content,
          sort: '-createdAt',
          filter: '',
          search: ''
        })
      )
      .catch(err => console.log(err))
  }

  componentDidMount = () => {
    this.getReviews() 
  }

  changeSort = (e) => {
    this.setState({ sort: e })
  }

  changeFilter = (e) => {
    this.setState({ filter: e })
  }

  changeSearch = (e) => {
    this.setState({ search: e.target.value })
  }

  onSubmit = (e) => {
    e.preventDefault()

    this.props.api('get', '/reviews/search', {}, {
      q: this.state.search,
      sort: this.state.sort,
      filter: this.state.filter
    })
      .then(res => this.setState({ reviews: res.data.content }))
      .catch(err => console.log(err))
  }

  onReset = () => {
    this.getReviews()
  }

  render() {
    let content
    if (this.state.reviews.length) {
      content = this.state.reviews.map(review => <ShortReview review={review} key={review._id}/>)
    } else {
      content = 'No reviews found.'
    }

    return (<>
      <Form onSubmit={this.onSubmit} className='search'>
        <Form.Row>
          <Col md className='searchComponent'>
            <ToggleButtonGroup 
              type="radio"
              name='sort'
              className='d-flex'
              onChange={this.changeSort}
              value={this.state.sort}>
              <ToggleButton variant='outline-info' value='-createdAt'>
                Newest
              </ToggleButton>
              <ToggleButton variant='outline-info' value='createdAt'>
                Oldest
              </ToggleButton>
              <ToggleButton variant='outline-info' value='-editedAt'>
                Edited
              </ToggleButton>
              <ToggleButton variant='outline-info' value='-votes'>
                Votes
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>

          <Col className='searchComponent'>
            <ModuleInput
              key={this.state.filter} 
              value={this.state.filter}
              onChange={this.changeFilter}/>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col sm className='searchComponent'>
            <Form.Control
              value={this.state.search}
              onChange={this.changeSearch}
              placeholder='Search reviews'/>
          </Col>
            
          <Col xs='auto' className='searchComponent'>
            <Button variant='info' type='submit' className='d-flex'>
            Submit
            </Button>
          </Col >
          
          <Col xs='auto' className='searchComponent'>
            <Button variant='info' onClick={this.onReset} className='d-flex'>
              Reset
            </Button>
          </Col>
        </Form.Row>
      </Form>
    {content}
  </>)
  }
}
