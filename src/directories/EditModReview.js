import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import moduleList from './ModuleList.js'

export default class EditModReview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post_id: props.match.params.id,
            post_title: '',
            post_content: '',
            post_moduleCode: '',
        }
    }

    componentDidMount = () => {
        axios.get(`http://localhost:3001/modReviews/view/${this.state.post_id}`)
            .then(res => this.setState({
                 post_id: res.data._id,
                 post_title: res.data.title,
                 post_content: res.data.content,
                 post_moduleCode: res.data.moduleCode
            }))
            .catch(err => console.log(err));
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
            moduleCode: this.state.post_moduleCode
        }
        
        axios.patch(`http://localhost:3001/modReviews/edit/${this.state.post_id}`, newPost)
            .then(res => console.log(res.data))
            .then(res => this.props.history.push(`/modreviews/view/${this.state.post_id}`))
            .catch(err => console.log(err));
    }

    onDelete = (e) => {
        axios.delete(`http://localhost:3001/modReviews/delete/${this.state.post_id}`)
            .then(res => console.log(res.data))
            .then(res => this.props.history.push('/'))
            .catch(err => console.log(err));
    }

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>Edit Post</h3>
                <form onSubmit={this.onSubmit}>
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
                        <Button variant="outline-primary" type="submit">Submit</Button>{' '}
                        <Button variant="outline-secondary" href={`/modreviews/view/${this.state.post_id}`}>Cancel</Button>{' '}
                        <Button variant="outline-danger" onClick={this.onDelete}>Delete</Button>
                </form>
            </div>
        )
    }
}