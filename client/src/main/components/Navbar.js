import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

class Navbar extends Component {
  logout = (e) => {
    e.preventDefault()

    this.props.api('post', '/users/logout')
      .then(res => this.props.updateUser())
      .catch(err => {
        console.log('Logout error')
      })
  }

  render () {
    const loggedIn = this.props.loggedIn

    return (
      <div className='collpase navbar-collapse'>
        <ul className='navbar-nav mr-auto'>
          <li className='navbar-item'>
            <Link to='/' className='nav-link' onClick={this.props.updateUser}>
              Home
            </Link>
          </li>
          <li className='navbar-item'>
            <Link to='/modreviews/newpost' className='nav-link' onClick={this.props.updateUser}>
              Create A Post
            </Link>
          </li>
          {loggedIn ? (
            <li className='navbar-item'>
              <Link to='/users/edit/' className='nav-link' onClick={this.props.updateUser}>
                Edit Account Details
              </Link>
            </li>
          ) : (
            <li className='navbar-item'>
              <Link to='/users/signup' className='nav-link' onClick={this.props.updateUser}>
                Register
              </Link>
            </li>
          )}
          {loggedIn ? (
            <li className='navbar-item'>
              <Link to='#' className='nav-link' onClick={this.logout}>
                Log Out
              </Link>
            </li>
          ) : (
            <li className='navbar-item'>
              <Link to='/users/login' className='nav-link' onClick={this.props.updateUser}>
                Log In
              </Link>
            </li>
          )}
        </ul>
      </div>
    )
  }
}

export default Navbar
