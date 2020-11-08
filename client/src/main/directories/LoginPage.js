import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Button from 'react-bootstrap/Button'

export default class LoginPage extends Component {
  constructor () {
    super()

    this.state = {
      user_username: '',
      user_password: '',
      isButtonDisabled: false,
      buttonVariant: 'primary',
      loginStatus: 'Log In',
      loggedIn: false,
      redirectTo: null,
      loginError: null
    }
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

    const userLogIn = {
      username: this.state.user_username,
      password: this.state.user_password
    }

    this.setState({
      isButtonDisabled: true,
      buttonVariant: 'dark',
      loginStatus: 'Logging In...'
    })

    this.props.api('post', '/users/login', userLogIn)
      .then((res) => {
        this.setState({ redirectTo: '/' })
      })
      .catch((err) => {
        console.log(err)
        this.setState({
          loginError: err.response.data.message,
          buttonVariant: 'primary',
          loginStatus: 'Log In',
          isButtonDisabled: false
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
            <h3>Log in to existing account</h3>
            <p className='grey-text text-darken-1'>
              <em>Don't have an account? </em>
              <Link to='/users/signup'>Register</Link>
            </p>
          </div>
          <form onSubmit={this.onSubmit}>
            <input
              type='text'
              placeholder='Username'
              className='form-control'
              value={this.state.user_username}
              onChange={this.onChangeUsername}
              required
            />
            <br />
            <input
              type='password'
              placeholder='Password'
              className='form-control'
              value={this.state.user_password}
              onChange={this.onChangePassword}
              required
            />
            <br />
            <div className='form-group'>
              <Button
                type='submit'
                className='btn btn-primary'
                disabled={this.state.isButtonDisabled}
                variant={this.state.buttonVariant}
              >
                {this.state.loginStatus}
              </Button>
              {' '}
              <a
                href={url}
                className='btn btn-primary'
              >
                Log in with Google
              </a>
              <p>{this.state.loginError}</p>
            </div>
          </form>
        </div>
      )
    }
  }
}
