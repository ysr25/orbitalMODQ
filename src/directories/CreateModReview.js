import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import moduleList from './ModuleList.js'

export default class CreateModReview extends Component {
    constructor(props) {
        super(props);

        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeContent = this.onChangeContent.bind(this);
        this.onChangeModuleCode = this.onChangeModuleCode.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            post_author: '5ec846e3bab41bf6e9ba4667',
            post_title: '',
            post_content: '',
            post_moduleCode: 'ACC1002'
        }
    }

    onChangeTitle(e) {
        this.setState({
            post_title: e.target.value
        });
    }

    onChangeContent(e) {
        this.setState({
            post_content: e.target.value
        });
    }

    onChangeModuleCode(e) {
        this.setState({
            post_moduleCode: e.target.value
        });
    }

    onSubmit(e) {
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
                <form onSubmit={this.onSubmit}>
                <Form.Control
                    type="text"
                    placeholder="Title"
                    className="form-control"
                    value={this.state.post_title}
                    onChange={this.onChangeTitle}
                    required
                />
                <br />
                <Form.Control
                    type="text"
                    placeholder="Content"
                    className="form-control"
                    value={this.state.post_content}
                    onChange={this.onChangeContent}
                    required
                />
                <br />
                <div className="form-group">
                    <label>Module: </label>
                        <select required
                                className="form-control"
                                value={this.state.user_moduleCode}
                                onChange={this.onChangeModuleCode} 
                        >
                        {moduleList.map(module => 
                            <option key={module.code} value={module.code}>{module.code + ": " + module.title}</option>
                        )}
                        </select>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Create Post" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}