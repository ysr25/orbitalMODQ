import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

export default class Registration extends Component {
  onChangeEmail = (e) => {
    const email = e.target.value
    this.props.onChangeEmail(email)
  }

  onChangeCourse = (e) => {
    const course = e.target.value
    this.props.onChangeCourse(course)
  }

  onChangeYearOfStudy = (e) => {
    const yearOfStudy = e.target.value
    this.props.onChangeYearOfStudy(yearOfStudy)
  }

  onChangeUsername = (e) => {
    const username = e.target.value
    this.props.onChangeUsername(username)
  }

  onChangePassword = (e) => {
    const password = e.target.value
    this.props.onChangePassword(password)
  }

  onSubmit = (e) => {
    console.log('hi?2')
    this.props.onSubmit(e)
  }

  render () {
    const size = 2
    const displayPassword = this.props.displayPassword ? 'block' : 'none'

    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Row>
          <Form.Label 
            htmlFor="email"
            column sm={size}>
          Email
          </Form.Label>
          <Col>
            <Form.Control
              id="email"
              type="email"
              value={this.props.email}
              onChange={this.onChangeEmail}
              disabled={this.props.disabled}
              required/>
          </Col>
        </Form.Row>
        <br />

        <Form.Row>
          <Form.Label 
            htmlFor="course"
            column sm={size}>
          Course
          </Form.Label>
          <Col>
            <Form.Control
              id="course"
              type="text"
              value={this.props.course}
              onChange={this.onChangeCourse}
              required/>
          </Col>
        </Form.Row>
        <br />

        <Form.Row>
          <Form.Label 
            htmlFor="yearOfStudy"
            column sm={size}>
          Year of Study
          </Form.Label>
          <Col>
            <Form.Control
              id='yearOfStudy'
              as='select'
              value={this.props.yearOfStudy}
              onChange={this.onChangeYearOfStudy}
              required>

                <option value='matriculatingSoon'>Matriculating Soon</option>
                <option value='undergraduate'>Undergraduate</option>
                <option value='masters'>Masters</option>
                <option value='doctorate'>Doctorate</option>
                <option value='others'>Others</option>
            </Form.Control>
          </Col>
        </Form.Row>
        <br />

        <Form.Row>
        <Form.Label
          htmlFor="username"
          column sm={size}>
        Username
        </Form.Label>
        <Col>
          <Form.Control
            id="username"
            type="text"
            value={this.props.username}
            onChange={this.onChangeUsername}
            disabled={this.props.disabled}
            required/>
        </Col>
        </Form.Row>
        <br />

        <Form.Row>
        <Form.Label 
          htmlFor="password"
          style={{ display: displayPassword }}
          column sm={size}>
        Password
        </Form.Label>
        <Col>
          <Form.Control
            id="password"
            type="password"
            value={this.props.password}
            onChange={this.onChangePassword}
            style={{ display: displayPassword }}/>
        </Col>
        </Form.Row>
        <br />

        <Button
          type='submit'
          disabled={this.props.isButtonDisabled}>
        Submit
        </Button>
        <br />
        {this.props.status}
      </Form>
    )
  }
}
