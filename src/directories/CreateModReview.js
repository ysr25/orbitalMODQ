import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import moduleList from './ModuleList.js'

export default class CreateModReview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post_author: '5ec846e3bab41bf6e9ba4667',
            post_title: '',
            post_content: '',
            post_moduleCode: 'ACC1002'
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
        
        axios.post('http://localhost:3001/modReviews/newpost', newPost)
            .then(res => console.log(res.data))
            .catch(err => console.log(err));

        this.setState({
            post_title: '',
            post_content: '',
            post_moduleCode: 'ACC1002'
        });
    }

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>New Post</h3>
                <Form onSubmit={this.onSubmit}>
                <Form.Group>
                <Form.Control
                    type="text"
                    placeholder="Title"
                    className="form-control"
                    value={this.state.post_title}
                    onChange={this.onChangeTitle}
                    required
                />
                </Form.Group>

                <Form.Group>
                <Form.Control
                    type="text"
                    as="textarea" rows="5"
                    placeholder="Content"
                    className="form-control"
                    value={this.state.post_content}
                    onChange={this.onChangeContent}
                    required
                />
                </Form.Group>

                <Form.Group>
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
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
                </Form>
            </div>
        )
    }
}