import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import moduleList from './ModuleList.js';
import SuccessfulPost from './SuccessfulPost';
import { Route, Link } from "react-router-dom";

export default class CreateModReview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post_author: '5ec846e3bab41bf6e9ba4667',
            post_title: '',
            post_content: '',
            post_moduleCode: 'ACC1002',
            isButtonDisabled: false,
            buttonVariant: 'primary'
        }
    }

    onChangeTitle = (e) => {
        this.setState({
            post_title: e.target.value
        });
    }

    onChangeContent = (e) => {
        this.setState({
            post_content: e.target.value
        });
    }

    onChangeModuleCode = (e) => {
        this.setState({
            post_moduleCode: e.target.value,
        });
    }

    onSubmit = (e) => {
        e.preventDefault();

       const newPost = {
            title: this.state.post_title,
            content: this.state.post_content,
            moduleCode: this.state.post_moduleCode,
            author: this.state.post_author
        }
        
        axios.post('http://localhost:3001/modReviews/newpost', newPost, {withCredentials: true})
            .then(res => console.log(res.data))
            .then(res => this.props.history.push('/modReviews/newpost/success'))
            .catch(err => console.log(err));

        this.setState({
            isButtonDisabled: true,
            buttonVariant: 'dark',
        });
    
    }

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>New Post</h3>
                <Form.Label>Module: </Form.Label>
                <Form.Control as="select"
                        className="form-control"
                        value={this.state.post_moduleCode}
                        onChange={this.onChangeModuleCode} 
                        required
                >                       
                {moduleList.map(module => 
                    <option key={module.code} value={module.code}>{module.code + ": " + module.title}</option>
                )}
                </Form.Control>
                <br  />
                <Form onSubmit={this.onSubmit}>
                <Form.Control
                    type="text"
                    placeholder="Title"
                    className="form-control"
                    value={this.state.post_title}
                    onChange={this.onChangeTitle}
                    required
                />
                <br  />
                <Form.Control
                    type="text"
                    as="textarea" rows="5"
                    placeholder="Content"
                    className="form-control"
                    value={this.state.post_content}
                    onChange={this.onChangeContent}
                    required
                />
                <br  />

                <div className="form-group">
                    <Button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={this.state.isButtonDisabled}
                        variant={this.state.buttonVariant}>
                            Submit Post
                        </Button>
                    <Route path="/modReviews/newpost/success" component={SuccessfulPost} />
                </div>
                </Form>
            </div>
        )
    }
}