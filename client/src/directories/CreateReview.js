import React, { Component } from 'react'
import ReviewForm from '../components/ReviewForm'

export default class CreateReview extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      content: '',
      moduleCode: '',
      isAnonymous: false,

      status: null,
      isButtonDisabled: false
    }
  }

  onChangeTitle = (data) => {
    this.setState({ 
      title: data,
      isButtonDisabled: false
    })
  }

  onChangeContent = (data) => {
    this.setState({ 
      content: data,
      isButtonDisabled: false
    })
  }

  onChangeModuleCode = (data) => {
    this.setState({ 
      moduleCode: data,
      isButtonDisabled: false
    })
  }

  onChangeIsAnonymous = () => {
    this.setState(prevState => ({ 
      isAnonymous: !prevState.isAnonymous,
      isButtonDisabled: false 
    }))
  }

  onSubmit = (e) => {
    e.preventDefault()

    const newPost = {
      title: this.state.title,
      content: this.state.content,
      moduleCode: this.state.moduleCode,
      anonymous: this.state.isAnonymous
    }

    this.setState({
      status:'Submitting...',
      isButtonDisabled: true
    })

    this.props.api('post', '/reviews', newPost)
      .then(res => {
        this.setState({ status: res.data.message })
        this.props.history.push(`/reviews/view/${res.data.content}`)
      })
      .catch(err => {
        this.setState({ 
          status: err.response.data.message,
          isButtonDisabled: true
        })
      })
  }

  render() {
    return (
      <>
        <h3>New Post</h3>
        <ReviewForm 
          title={this.state.title}
          content={this.state.content}
          moduleCode={this.state.moduleCode}
          isAnonymous={this.state.isAnonymous}

          status={this.state.status}
          isButtonDisabled={this.state.isButtonDisabled}

          onChangeTitle={this.onChangeTitle}
          onChangeContent={this.onChangeContent}
          onChangeModuleCode={this.onChangeModuleCode}
          onChangeIsAnonymous={this.onChangeIsAnonymous}
          onSubmit={this.onSubmit}
        />
      </>
    )
  }
}
