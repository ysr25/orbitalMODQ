import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'

import Homepage from './directories/Homepage'
import CreateModReview from './directories/CreateModReview'
import EditModReview from './directories/EditModReview'
import Registration from './directories/Registration'
import LoginPage from './directories/LoginPage'
import ViewPost from './directories/ViewPost'
// import UserPage from "./directories/UserPage";
import Navbar from './components/Navbar'
import EditUser from './directories/EditUser'
import logo from './logo.jpg'

class App extends Component {
  constructor () {
    super()
    this.state = {
      loggedIn: false
    }

    this.updateUser = this.updateUser.bind(this)
  }

  componentDidMount () {
    this.updateUser()
  }

  updateUser () {
    axios.get('/api/users', {
      withCredentials: true
    })
      .then((response) => {
        console.log('Get user response: ')
        console.log(response.data)
        if (response.data.isLoggedIn) {
          console.log('Get User: There is a user saved in the server session: ')
          this.setState({ loggedIn: true })
        } else {
          console.log('Get user: no user')
          this.setState({ loggedIn: false })
        }
      })
      .catch((err) => console.log(err))
  }

  render () {
    return (
      <Router>
        <div className='container'>
          <nav className='navbar navbar-expand-lg navbar-light bg-light'>
            <Link to='/' className='navbar-brand' onClick={this.updateUser}>
              <img src={logo} width='50' height='50' alt='MODQ Logo' />
              MODQ
            </Link>
            <Navbar
              updateUser={this.updateUser}
              loggedIn={this.state.loggedIn}
            />
          </nav>
          <br />
          <Route
            exact
            path='/'
            render={props => <Homepage {...props} updateUser={this.updateUser} />}
          />
          <Route path='/modreviews/newpost' component={CreateModReview} />
          <Route
            path='/modreviews/edit/:id'
            render={props => <EditModReview {...props} updateUser={this.updateUser} />}
          />
          <Route
            path='/modreviews/view/:id'
            render={props => <ViewPost
              {...props}
              loggedIn={this.state.loggedIn}
              updateUser={this.updateUser}
            />}
          />
          <Route
            exact
            path='/users/signup'
            render={props => <Registration {...props} updateUser={this.updateUser} />}
          />
          <Route
            path='/users/login'
            render={props => <LoginPage {...props} updateUser={this.updateUser} />}
          />
          <Route
            exact
            path='/users/edit'
            render={props => <EditUser {...props} updateUser={this.updateUser} />}
          />
          {/* <Route path="/users/profile" render={props => <UserPage {...props} logout={this.updateUser} />} /> */}
        </div>
      </Router>
    )
  }
}

export default App
