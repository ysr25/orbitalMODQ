import React, { Component } from 'react'
import UserForm from '../components/UserForm'

export default class EditUser extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      course: '',
      yearOfStudy: "matriculatingSoon", // default option
      username: '',
      googleAccount: false,

      status: null,
      isButtonDisabled: false
    }
  }

  componentDidMount = () => {
    this.props.api('get', '/users')
      .then(res => {
        const user = res.data.content
        return this.setState({
          email: user.email,
          course: user.course === 'notSelected' ? '' : user.course,
          yearOfStudy: user.yearOfStudy === 'notSelected' ? 'matriculatingSoon' : user.yearOfStudy,
          username: user.username,
          googleAccount: user.googleId ? true : false,
        })
      })
      .catch(err => console.log(err));
  }

  onChangeEmail = (data) => {
    this.setState({
      email: data,
      isButtonDisabled: false
    })
  }

  onChangeCourse = (data) => {
    console.log('aaa')
    this.setState({
      course: data,
      isButtonDisabled: false
    })
  }

  onChangeYearOfStudy = (data) => {
    this.setState({
      yearOfStudy: data,
      isButtonDisabled: false
    })
  }

  onChangeUsername = (data) => {
    this.setState({
      username: data,
      isButtonDisabled: false
    })
  }

  onSubmit = (e) => {
    e.preventDefault()

    const editedUser = {
      email: this.state.email,
      course: this.state.course,
      yearOfStudy: this.state.yearOfStudy,
      username: this.state.username
    }

    this.setState({
      isButtonDisabled: true,
      status: 'Submitting...',
    })

    this.props.api('patch', '/users', editedUser)
      .then(res => {
        this.setState({ status: res.data.message })
        this.props.history.push('/')
      })
      .catch(err => {
        this.setState({
          status: err.response.data.message,
          isButtonDisabled: true,
        })
      })
  }

  render() {
    return (
      <>
        <h3>Edit user details</h3>
        <UserForm
          email={this.state.email}
          username={this.state.username}
          course={this.state.course}
          yearOfStudy={this.state.yearOfStudy}

          status={this.state.status}
          isButtonDisabled={this.state.isButtonDisabled}
          disabled={this.state.googleAccount}
          displayPassword={false}

          onChangeEmail={this.onChangeEmail}
          onChangeUsername={this.onChangeUsername}
          onChangeCourse={this.onChangeCourse}
          onChangeYearOfStudy={this.onChangeYearOfStudy}
          onSubmit={this.onSubmit}
        />
      </>
    )
  }
}