import axios from 'axios'
import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { Link, Redirect } from 'react-router-dom'

export default class Registration extends Component {
  constructor (props) {
    super(props)

    this.state = {
      user_email: '',
      user_course: '',
      user_yearOfStudy: 'matriculatingSoon', // default option
      user_username: '',
      user_password: '',
      isButtonDisabled: false,
      buttonVariant: 'primary',
      regStatus: 'Create Account',
      errorMessage: null
    }
  }

  onChangeEmail = (e) => {
    this.setState({
      user_email: e.target.value
    })
  }

  onChangeCourse = (e) => {
    this.setState({
      user_course: e.target.value
    })
  }

  onChangeYearOfStudy = (e) => {
    this.setState({
      user_yearOfStudy: e.target.value
    })
  }

  onChangeUsername = (e) => {
    this.setState({
      user_username: e.target.value
    })
  }

  onChangePassword = (e) => {
    this.setState({
      user_password: e.target.value
    })
  }

  onSubmit = (e) => {
    e.preventDefault()

    // variable names are same as backend
    const newUser = {
      email: this.state.user_email,
      course: this.state.user_course,
      yearOfStudy: this.state.user_yearOfStudy,
      username: this.state.user_username,
      password: this.state.user_password
    }

    console.log('New User successfully created (not submitted): ' + newUser)

    this.setState({
      isButtonDisabled: true,
      buttonVariant: 'dark',
      regStatus: 'Creating Account...'
    })

    axios
      .post('/api/users/signup', newUser, {
        withCredentials: true
      })
      .then((res) => {
        console.log(res.data)
        console.log('successful signup')
        this.props.updateUser()
        this.setState({ redirectTo: '/' })
      })
      .catch((err) => {
        console.log(err)
        this.setState({
          errorMessage: err.response.data.message,
          isButtonDisabled: false,
          buttonVariant: 'primary',
          regStatus: 'Create Account'
        })
      })
  }

  render () {
    const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api/users/login/google' : '/api/users/login/google'
    if (this.state.redirectTo) {
      return <Redirect to={{ pathname: this.state.redirectTo }} />
    } else {
      return (
        <div style={{ marginTop: 10 }}>
          <div>
            <h3>Create An Account</h3>
            <p className='grey-text text-darken-1'>
              <em>Already have an account? </em>
              <Link to='/users/login'>Log in to an existing account</Link>
            </p>
          </div>
          <form onSubmit={this.onSubmit}>
            <br />
            <Form.Row>
              <Col>
                <Form.Control
                  type='email'
                  placeholder='Email Address'
                  className='form-control'
                  value={this.state.user_email}
                  onChange={this.onChangeEmail}
                  required
                />
              </Col>
              <Col>
                <Form.Control
                  type='text'
                  placeholder='Course of Study'
                  className='form-control'
                  value={this.state.user_course}
                  onChange={this.onChangeCourse}
                  required
                />
              </Col>
            </Form.Row>
            <br />
            <div className='form-group'>
              <label>Year of Study: </label>
              <select
                required
                className='form-control'
                value={this.state.user_yearOfStudy}
                onChange={this.onChangeYearOfStudy}
              >
                <option value='matriculatingSoon'>Matriculating Soon</option>
                <option value='undergraduate'>Undergraduate</option>
                <option value='masters'>Masters</option>
                <option value='doctorate'>Doctorate</option>
                <option value='others'>Others</option>
              </select>
            </div>
            <Form.Row>
              <Col>
                <Form.Control
                  type='text'
                  placeholder='Username'
                  className='form-control'
                  value={this.state.user_username}
                  onChange={this.onChangeUsername}
                  required
                />
              </Col>
              <Col>
                <Form.Control
                  type='password'
                  placeholder='Password'
                  className='form-control'
                  value={this.state.user_password}
                  onChange={this.onChangePassword}
                  required
                />
              </Col>
            </Form.Row>
            <br />
            <div className='form-group'>
              <Button
                type='submit'
                className='btn btn-primary'
                disabled={this.state.isButtonDisabled}
                variant={this.state.buttonVariant}
              >
                {this.state.regStatus}
              </Button>
              {' '}
              <a
                href={url}
                className='btn btn-primary'
              >
                Sign up with Google
              </a>
              <p>{this.state.errorMessage}</p>
            </div>
          </form>
        </div>
      )
    }
  }
}
