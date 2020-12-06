import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Editor from './Editor'
import ModuleInput from './ModuleInput'

export default class ReviewForm extends Component {
  onChangeTitle = (e) => {
    const title = e.target.value
    this.props.onChangeTitle(title)
  }

  onChangeContent = (data) => {
    this.props.onChangeContent(data)
  }

  onChangeModuleCode = (data) => {
    this.props.onChangeModuleCode(data)
  }

  onChangeIsAnonymous = (e) => {
    this.props.onChangeIsAnonymous()
  }

  onSubmit = (e) => {
    this.props.onSubmit(e)
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Row>
          <Form.Label 
            htmlFor='title'
            column sm={2}>
          Title
          </Form.Label>
          <Col>
            <Form.Control
              id='title'
              type='text'
              value={this.props.title}
              onChange={this.onChangeTitle}
              required/>
          </Col>
        </Form.Row>
        <br />

        <Form.Row>
          <Form.Label
            htmlFor='module'
            column sm={2}>
          Module
          </Form.Label>
          <Col>
            <ModuleInput
              id='module'
              key={this.props.moduleCode} 
              value={this.props.moduleCode} 
              onChange={this.onChangeModuleCode}/>
          </Col>
        </Form.Row>
        <br />

        <Editor
          aria-labelledby='content'
          data={this.props.content}
          onChange={this.onChangeContent}
        />
        <br />

        <Form.Check
          type='checkbox'
          label='Post Anonymously'
          aria-label='Post Anonymously'
          checked={this.props.isAnonymous}
          onChange={this.onChangeIsAnonymous}
        />
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
