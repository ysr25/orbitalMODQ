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
import Navbar from './components/Navbar'
import EditUser from './directories/EditUser'
import logo from './logo.jpg'

class App extends Component {
  constructor () {
    super()
    this.state = {
      loggedIn: false
    }
  }

  api = (method, url, data = {}, params = {}) => {
    console.log('api call', method, url)
    return axios.request({
      method: method,
      url: '/api' + url,
      data: data,
      params: params,
      withCredentials: true
    })
      .then(res => {
        this.setState({ loggedIn: res.data.isLoggedIn })
        return res
      })
  }

  updateUser = () => {
    this.api('get', '/')
      .catch(err => console.log(err))
  }

  setShow = (show) => {
    this.setState({ show: false })
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
              api={this.api}
            />
          </nav>
          <br />
          <Route
            exact path='/'
            render={props => <Homepage {...props} api={this.api} />}
          />
          <Route 
            path='/modreviews/newpost' 
            render={props => <CreateModReview {...props} api={this.api} />}
          />
          <Route
            path='/modreviews/edit/:id'
            render={props => <EditModReview {...props} api={this.api} />}
          />
          <Route
            path='/modreviews/view/:id'
            render={props => <ViewPost
              {...props}
              loggedIn={this.state.loggedIn}
              api={this.api}
            />}
          />
          <Route
            exact path='/users/signup'
            render={props => <Registration {...props} api={this.api} />}
          />
          <Route
            path='/users/login'
            render={props => <LoginPage {...props} api={this.api} />}
          />
          <Route
            exact path='/users/edit'
            render={props => <EditUser {...props} api={this.api} />}
          />
        </div>
      </Router>
    )
  }
}

export default App
